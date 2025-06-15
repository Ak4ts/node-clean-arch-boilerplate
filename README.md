# Node Clean Architecture Boilerplate

Este projeto é um template de API Node.js com TypeScript, Sequelize, Docker, Clean Architecture e suporte a HTTPS, pronto para ser usado como base para novos projetos escaláveis e facilmente extensível para suas próprias regras de negócio.

## Principais Funcionalidades

- **Clean Architecture**: Separação clara entre domínio, casos de uso, infraestrutura e camada de entrada.
- **TypeScript**: Tipagem estática e moderna.
- **Aliases de Path**: Imports organizados usando `@domain`, `@infra`, `@usecases`, `@main`.
- **Sequelize ORM**: Integração pronta para MySQL, com suporte a migrações e models.
- **Migrations Automatizadas**: Migrações executadas automaticamente no Docker e via script.
- **Docker & Docker Compose**: Ambiente pronto para dev e produção, incluindo banco MySQL e scripts de inicialização.
- **HTTPS Ready**: Suporte nativo a HTTPS com certificados customizáveis.
- **Logger Winston**: Logging centralizado, com logs em arquivo e console.
- **Middleware de Erro Robusto**: Tratamento customizado para status HTTP (200, 201, 400, 401, 404, 500) e logging de erros.
- **ESLint, Prettier e EditorConfig**: Padronização de código garantida.
- **Scripts de build, dev, lint, format, migrate**: Prontos para uso.
- **Exemplo de controller, caso de uso e service**.
- **.env.example**: Facilita o setup do ambiente.

## Estrutura de Pastas

```
├── src/
│   ├── domain/         # Entidades, repositórios e serviços de domínio
│   ├── usecases/       # Casos de uso (application layer)
│   ├── infrastructure/ # Implementações técnicas (DB, Express, etc)
│   └── main/           # Bootstrap, composição e app Express
│   └── server.ts       # Bootstrap do servidor
├── config/             # Configurações do Sequelize CLI
├── migrations/         # Migrações do banco de dados
├── certs/              # Certificados SSL para HTTPS
├── Dockerfile          # Build da aplicação
├── docker-compose.yml  # Orquestração de containers
├── .env.example        # Exemplo de variáveis de ambiente
├── .editorconfig       # Padrão de editor
├── .eslintrc.json      # Configuração do ESLint
├── .prettierrc         # Configuração do Prettier
```

## Como usar

### 1. Instalação

```sh
npm install
```

### 2. Ambiente de Desenvolvimento

```sh
npm run dev
```

### 3. Build e Produção

```sh
npm run build
npm start
```

### 4. Docker (dev ou produção)

```sh
docker-compose up --build
```

### 5. Migrações

```sh
npm run migrate
```

### 6. Gerar nova migração

```sh
npm run generate-migration -- nome-da-migracao
```

## Exemplo de Resposta de Erro

```json
{
  "status": 400,
  "message": "Test already exists with that email address"
}
```

```json
{
  "status": 404,
  "message": "Test with ID 123 not found"
}
```

## Exemplo de Resposta de Sucesso

```json
{
  "id": 1,
  "name": "example",
  "createdAt": "2025-06-15T12:00:00.000Z",
  "updatedAt": "2025-06-15T12:00:00.000Z"
}
```

## Diferenciais

- **Aliases globais**: Imports limpos e sem caminhos relativos complexos.
- **Compatível com Node.js 24+**
- **Padronização de código garantida**
- **HTTPS nativo**
- **Migrações automáticas no Docker**
- **Arquitetura escalável**
- **Logger robusto com Winston**
- **Middleware de erro customizado**

---

## Walkthrough: Como criar sua API a partir deste template

Este passo a passo mostra como você pode usar este template para criar rapidamente sua própria API, adicionando suas entidades e regras de negócio.

### 1. Crie sua entidade de domínio

Exemplo: `src/domain/models/produto-model.ts`

```typescript
export interface Produto {
  id: number;
  nome: string;
  preco: number;
  createdAt?: Date;
  updatedAt?: Date;
}
```

Adicione ao `index.ts` da pasta `models`:

```typescript
export * from "./produto-model";
```

### 2. Crie o repositório da entidade

Exemplo: `src/domain/repositories/produto-repository.ts`

```typescript
import { Produto } from "@domain";

export interface ProdutoRepository {
  create(produto: Produto): Promise<Produto>;
  getById(id: number): Promise<Produto | null>;
}
```

Adicione ao `index.ts` da pasta `repositories`:

```typescript
export * from "./produto-repository";
```

### 3. Implemente o repositório na infraestrutura

Exemplo: `src/infrastructure/databases/sequelize/repositories/produto-repository.ts`

```typescript
import { Produto } from "@domain";
import { ProdutoRepository } from "@domain";
import { ProdutoModel } from "@infra";

export class ProdutoRepositoryImpl implements ProdutoRepository {
  async create(produto: Produto): Promise<Produto> {
    // ...implementação usando Sequelize
  }
  async getById(id: number): Promise<Produto | null> {
    // ...implementação usando Sequelize
  }
}
```

### 4. Crie o service de domínio

O service representa as regras de negócio da sua entidade e orquestra o uso dos repositórios.

Exemplo: `src/domain/services/produto-service.ts`

```typescript
import { Produto } from "@domain";
import { ProdutoRepository } from "@domain";

export class ProdutoService {
  constructor(private readonly produtoRepository: ProdutoRepository) {}

  async criarProduto(produto: Produto): Promise<Produto> {
    // Regras de negócio, validações, etc
    return this.produtoRepository.create(produto);
  }

  async buscarProdutoPorId(id: number): Promise<Produto | null> {
    return this.produtoRepository.getById(id);
  }
}
```

Adicione ao `index.ts` da pasta `services`:

```typescript
export * from "./produto-service";
```

### 5. Crie o caso de uso (use case)

Exemplo: `src/usecases/ProdutoCase/create-produto-use-case.ts`

```typescript
import { Produto } from "@domain";
import { ProdutoService } from "@domain";

export class CreateProdutoUseCase {
  constructor(private readonly produtoService: ProdutoService) {}
  async execute(input: Produto): Promise<Produto> {
    return this.produtoService.criarProduto(input);
  }
}
```

Adapte os próximos passos conforme necessário.

### 6. Crie o controller

Exemplo: `src/infrastructure/express/controllers/produto-controller.ts`

```typescript
import { Request, Response } from "express";
import { CreateProdutoUseCase } from "@usecases";

export class ProdutoController {
  constructor(private readonly createProdutoUseCase: CreateProdutoUseCase) {}
  async createProduto(req: Request, res: Response): Promise<void> {
    const produto = await this.createProdutoUseCase.execute(req.body);
    res.status(201).json(produto);
  }
}
```

### 7. Faça a composição das dependências

Exemplo: `src/main/composer.ts`

```typescript
import { ProdutoRepositoryImpl } from "@infra";
import { ProdutoService } from "@domain";
import { CreateProdutoUseCase } from "@usecases";
import { ProdutoController } from "@infra";

export function makeProdutoController() {
  const produtoRepository = new ProdutoRepositoryImpl();
  const produtoService = new ProdutoService(produtoRepository);
  const createProdutoUseCase = new CreateProdutoUseCase(produtoService);
  return new ProdutoController(createProdutoUseCase);
}
```

### 8. Adicione a rota no Express

Exemplo: `src/main/express/app.ts`

```typescript
import { makeProdutoController } from "@main/composer";
// ...
const produtoController = makeProdutoController();
app.post("/produtos", produtoController.createProduto.bind(produtoController));
```

### 9. Rode a aplicação

- `npm run dev` para desenvolvimento
- `npm run build && npm start` para produção
- `docker-compose up --build` para ambiente Docker

Pronto! Basta repetir o processo para cada nova entidade/caso de uso.

---

> Dúvidas? Veja os exemplos no código ou abra uma issue!

---

> **Nota:** Este template não inclui rotas de domínio reais. Adicione suas entidades, casos de uso e controllers conforme a necessidade do seu projeto.

## CHANGELOG

Consulte o arquivo [CHANGELOG.md](./CHANGELOG.md) para ver as mudanças de cada versão.
