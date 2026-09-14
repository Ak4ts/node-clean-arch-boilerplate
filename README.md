# Node Clean Architecture

[![CI](https://github.com/Ak4ts/node-clean-arch-boilerplate/actions/workflows/ci.yml/badge.svg)](https://github.com/Ak4ts/node-clean-arch-boilerplate/actions/workflows/ci.yml)

API HTTP em Node.js + TypeScript organizada em Clean Architecture, com Sequelize sobre MySQL, logging estruturado com Winston e tratamento de erro centralizado.

A regra que sustenta o projeto: **as dependências apontam para dentro**. `domain` não conhece Express nem Sequelize; `usecases` conhece apenas `domain`; `infrastructure` implementa as interfaces do domínio; `main` conecta tudo. Erros de domínio vivem em `@domain/errors` e não carregam status HTTP — traduzi-los para a resposta é trabalho do middleware em `@infra/express/middlewares/error-handler`.

## Requisitos

- Node.js 20 ou 24
- MySQL 8 (apenas para rodar a API; a suíte de testes não precisa de banco)
- Docker e Docker Compose (opcional, sobe tudo de uma vez)

## Começando

```sh
git clone https://github.com/Ak4ts/node-clean-arch-boilerplate.git
cd node-clean-arch-boilerplate
npm ci
npm test          # não precisa de banco nenhum
```

Para rodar a API com o banco junto:

```sh
cp .env.example .env
docker compose up --build
```

O compose espera o MySQL passar no healthcheck, aplica as migrações e sobe a API em `http://localhost:5000`.

Sem Docker, com um MySQL já disponível e o `.env` preenchido:

```sh
npm run migrate
npm run dev
```

## API

| Método | Rota         | Corpo               | Respostas                                                     |
| ------ | ------------ | ------------------- | ------------------------------------------------------------- |
| `POST` | `/tests`     | `{ "name": "..." }` | `201` criado, `400` nome já existente                         |
| `GET`  | `/tests/:id` | —                   | `200` encontrado, `400` id não numérico, `404` não encontrado |

```sh
curl -X POST localhost:5000/tests -H 'content-type: application/json' -d '{"name":"alpha"}'
curl localhost:5000/tests/1
```

Sucesso:

```json
{
  "id": 1,
  "name": "alpha",
  "createdAt": "2025-06-15T12:00:00.000Z",
  "updatedAt": "2025-06-15T12:00:00.000Z"
}
```

Erro — sempre o mesmo formato, venha de onde vier:

```json
{
  "status": 404,
  "message": "Test with ID 123 not found"
}
```

Corpo inválido em `POST /tests` é recusado antes de chegar ao caso de uso, com detalhe por campo:

```json
{
  "status": 400,
  "message": "Invalid request",
  "issues": [{ "field": "name", "message": "name must not be empty" }]
}
```

O `name` é aparado antes de validar — `"  alpha  "` e `"alpha"` são o mesmo nome — e chaves desconhecidas no corpo são ignoradas, não recusadas.

Erros não reconhecidos viram `500` com a mensagem genérica `"Internal server error"`; a causa real vai para o log, nunca para a resposta.

## Testes

```sh
npm test          # vitest run --coverage
npm run test:watch
```

A suíte roda contra **sqlite em memória** (`NODE_ENV=test` em `src/infrastructure/databases/sequelize/connection.ts`), então um clone novo consegue rodar os testes antes mesmo de ter um banco configurado. `test/setup.ts` recria o schema antes de cada teste.

Cobertura tem mínimo obrigatório configurado em `vitest.config.mts`. Os números sobem conforme novas suítes entram — não se abaixa o limite para o build passar.

## Scripts

| Script                       | O que faz                                                   |
| ---------------------------- | ----------------------------------------------------------- |
| `npm run dev`                | Sobe a API com `ts-node` e recarrega os aliases de path     |
| `npm run build`              | Compila para `dist/` (`tsconfig.build.json`, sem os testes) |
| `npm start`                  | Roda o build gerado                                         |
| `npm test`                   | Suíte completa com cobertura                                |
| `npm run typecheck`          | `tsc --noEmit` sobre `src/`, `test/` e a config do vitest   |
| `npm run lint`               | ESLint + Prettier                                           |
| `npm run format`             | Aplica o Prettier                                           |
| `npm run migrate`            | Aplica as migrações do Sequelize                            |
| `npm run generate-migration` | Cria uma nova migração                                      |

CI roda `lint`, `typecheck`, `build` e `test` em Node 20 e 24 a cada push.

## Variáveis de ambiente

Copie `.env.example` para `.env`. As de banco (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`) e `PORT` são as usuais.

`TLS_CERT_PATH` e `TLS_KEY_PATH` são opcionais: definidas as duas, o servidor sobe em HTTPS; sem elas, sobe em HTTP e assume que o TLS termina antes (proxy, load balancer). Para HTTPS local:

```sh
mkdir -p certs
openssl req -x509 -newkey rsa:2048 -nodes -days 365 \
  -keyout certs/cert.key -out certs/cert.crt -subj "/CN=localhost"

export TLS_CERT_PATH=certs/cert.crt
export TLS_KEY_PATH=certs/cert.key
npm run dev
```

O diretório `certs/` é ignorado pelo Git. Chave privada não se versiona.

## Estrutura

```
├── src/
│   ├── domain/         # Entidades, erros, interfaces de repositório e serviços
│   ├── usecases/       # Casos de uso (application layer)
│   ├── infrastructure/ # Sequelize, Express, logger
│   ├── main/           # Composição de dependências e app Express
│   └── server.ts       # Bootstrap do processo
├── test/               # Setup do vitest e testes de API
├── config/             # Configuração do Sequelize CLI
├── migrations/         # Migrações do banco
├── .github/workflows/  # CI
├── Dockerfile
├── docker-compose.yml
```

Os aliases `@domain`, `@usecases`, `@infra` e `@main` estão em `tsconfig.json` e valem também nos testes, que os resolvem nativamente pelo Vite.

---

## Adicionando uma entidade

O fluxo abaixo usa `Produto` como exemplo e segue exatamente o caminho que `Test` já percorre no código.

### 1. Entidade e erros de domínio

`src/domain/models/produto-model.ts`:

```typescript
export interface Produto {
  id: number;
  nome: string;
  preco: number;
  createdAt?: Date;
  updatedAt?: Date;
}
```

Exporte no `index.ts` da pasta `models`. Se precisar de um erro novo, estenda `DomainError` em `src/domain/errors/domain-error.ts` — sem status HTTP.

### 2. Interface do repositório

`src/domain/repositories/produto-repository.ts`:

```typescript
import { Produto } from "@domain/models/produto-model";

export interface ProdutoRepository {
  create(produto: NewProduto): Promise<Produto>;
  getById(id: number): Promise<Produto | null>;
}

export type NewProduto = Omit<Produto, "id" | "createdAt" | "updatedAt">;
```

O tipo `New*` existe para que a camada de cima não precise inventar um `id` antes de persistir.

### 3. Model e implementação do repositório

`src/infrastructure/databases/sequelize/models/produto-model.ts`:

```typescript
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection";

export class ProdutoModel extends Model {
  // `declare`, nunca `public nome!: string`: com target ES2022 o TypeScript
  // emite campos de classe como propriedades reais, que escondem os getters
  // que o Sequelize instala no prototype — e tudo lê `undefined`.
  declare id: number;
  declare nome: string;
}

ProdutoModel.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nome: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, tableName: "produto" },
);
```

Importe a conexão e o model por caminho relativo, não pelo barrel `@infra`: o barrel reexporta esses mesmos arquivos, e importar dele de dentro cria ciclo.

`src/infrastructure/databases/sequelize/repositories/produto-repository.ts` implementa `ProdutoRepository` usando `ProdutoModel`.

### 4. Service

`src/domain/services/produto-service.ts` — aqui moram as regras de negócio, e é daqui que saem os erros de domínio:

```typescript
import { NotFoundError } from "@domain/errors";
import { Produto } from "@domain/models/produto-model";
import { NewProduto, ProdutoRepository } from "@domain/repositories/produto-repository";

export class ProdutoService {
  constructor(private readonly produtoRepository: ProdutoRepository) {}

  async criarProduto(produto: NewProduto): Promise<Produto> {
    return this.produtoRepository.create(produto);
  }

  async buscarProdutoPorId(id: number): Promise<Produto> {
    const produto = await this.produtoRepository.getById(id);
    if (!produto) {
      throw new NotFoundError(`Produto ${id} não encontrado`);
    }
    return produto;
  }
}
```

### 5. Caso de uso

`src/usecases/ProdutoCase/create-produto-use-case.ts`:

```typescript
import { NewProduto, Produto, ProdutoService } from "@domain";

export class CreateProdutoUseCase {
  constructor(private readonly produtoService: ProdutoService) {}

  async execute(input: NewProduto): Promise<Produto> {
    return this.produtoService.criarProduto(input);
  }
}
```

### 6. Controller

O controller não decide status de erro: ele chama `next(error)` e deixa o middleware traduzir.

```typescript
import { NextFunction, Request, Response } from "express";
import { CreateProdutoUseCase } from "@usecases";

export class ProdutoController {
  constructor(private readonly createProdutoUseCase: CreateProdutoUseCase) {}

  async createProduto(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const produto = await this.createProdutoUseCase.execute(req.body);
      res.status(201).json(produto);
    } catch (error) {
      next(error);
    }
  }
}
```

### 7. Composição e rota

`src/main/composer.ts` monta a cadeia repositório → service → caso de uso → controller, e `src/main/express/app.ts` registra a rota. O `errorHandler` fica registrado por último, depois de todas as rotas.

### 8. Testes

Todo comportamento novo entra junto com o teste que o prova, no mesmo commit:

- regra de negócio → teste do service contra um repositório stub (`src/domain/services/test-service.test.ts` serve de modelo);
- persistência → teste do repositório contra o sqlite em memória;
- rota → teste de API com supertest em `test/`.

---

## Contribuindo

Veja [CONTRIBUTING.md](./CONTRIBUTING.md).

## CHANGELOG

Consulte o arquivo [CHANGELOG.md](./CHANGELOG.md) para ver as mudanças de cada versão.
