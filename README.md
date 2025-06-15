# Node Clean Architecture Boilerplate

Este projeto é um template de API Node.js com TypeScript, Sequelize, Docker, Clean Architecture e suporte a HTTPS, pronto para ser usado como base para novos projetos escaláveis.

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

## Segurança: Senha de Usuário Encriptada

Ao criar ou atualizar um usuário, a senha é automaticamente encriptada usando bcrypt antes de ser salva no banco de dados.

- O hash é feito via hooks do Sequelize (`beforeCreate` e `beforeUpdate`).
- O campo `password` nunca é salvo em texto puro.
- Para autenticação, compare a senha informada com o hash usando `bcrypt.compare`.

**Exemplo de uso no service:**

```typescript
import bcrypt from "bcrypt";
// ...existing code...
const isValid = await bcrypt.compare(senhaInformada, user.password);
if (!isValid) throw new UnauthorizedError("Senha inválida");
// ...existing code...
```

> **Atenção:** Nunca retorne o campo `password` em respostas de API.

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

> **Nota:** Este template não inclui rotas de domínio reais. Adicione suas entidades, casos de uso e controllers conforme a necessidade do seu projeto.

## CHANGELOG

Consulte o arquivo [CHANGELOG.md](./CHANGELOG.md) para ver as mudanças de cada versão.
