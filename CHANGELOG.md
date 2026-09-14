# Changelog

## [Unreleased]

### Added

- Suíte de testes com Vitest rodando sobre sqlite em memória: `npm test` não precisa de MySQL
- Cobertura com mínimo obrigatório em `vitest.config.mts`
- CI no GitHub Actions: `lint`, `typecheck`, `build` e `test` em Node 20 e 24 a cada push
- Dependabot semanal para npm e GitHub Actions
- Validação de corpo de requisição com zod em `@infra/express/validators`, com erro por campo
- Rota de leitura real: `GetTestByIdUseCase` e `TestRepository.getById`
- `CONTRIBUTING.md`
- HTTPS opcional via `TLS_CERT_PATH` / `TLS_KEY_PATH`

### Changed

- Erros de domínio movidos para `@domain/errors`: o domínio não importa mais de `@infra`
- Status HTTP passam a ser decididos só pelo middleware; controllers usam `next(error)`
- `tsconfig` dividido em base (lint e typecheck) e `tsconfig.build.json` (emissão)
- Dockerfile passa a compilar a aplicação e copiar `config/` e `migrations/`
- docker-compose espera o healthcheck do MySQL antes de subir a API

### Fixed

- Build quebrado: `src/infrastructure/express/index.ts` importava um `./app` inexistente
- `GET /tests/:id` criava um registro em vez de ler (chamava o caso de uso de criação)
- Campos de model Sequelize declarados com `public id!: number` liam `undefined` com target ES2022; agora usam `declare`
- Import circular entre o barrel do Sequelize e o model
- `npm run lint` falhava por CRLF, por `.eslintignore` ignorado pelo ESLint 9 e por scaffolding morto

### Security

- Chave privada TLS (`certs/cert.key`) removida do repositório e adicionada ao `.gitignore`
- `config/config.cjs` não imprime mais `DB_PASSWORD` no stdout
- Erros desconhecidos respondem `500` genérico em vez de ecoar a mensagem lançada

## [0.1.0] - 2025-06-15

### Added

- Estrutura Clean Architecture (Domain, Usecases, Infrastructure, Main)
- Aliases de path: `@domain`, `@infra`, `@usecases`, `@main`
- Bootstrap Express desacoplado e centralizado em `src/main/express/app.ts`
- Composição de dependências em `src/main/composer.ts`
- Middleware global de erro robusto com classes customizadas (`BadRequestError`, `UnauthorizedError`, `NotFoundError`, `InternalServerError`)
- Logger centralizado com Winston (logs em arquivo e console)
- Scripts de build, dev, lint, format, migrate, generate-migration
- Suporte a dev (`ts-node` + `tsconfig-paths`) e produção (`tsc` + `tsc-alias`)
- Dockerfile e docker-compose com MySQL, migrações automáticas e ambiente pronto para produção
- ESLint, Prettier e EditorConfig para padronização de código
- Exemplo de controller, caso de uso e service
- README completo e `.env.example` para facilitar setup

### Changed

- Imports refatorados para usar apenas aliases
- Controllers e services lançam erros customizados para tratamento centralizado

### Fixed

- Ambiente Docker pronto para uso imediato
- Migrações automáticas ao subir o container

---

Para detalhes, veja o README.md.
