# Changelog

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
