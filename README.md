# Node Clean Architecture Boilerplate

Este projeto é um template de API Node.js com TypeScript, Sequelize, Docker, Clean Architecture e suporte a HTTPS, pronto para ser usado como base para novos projetos escaláveis.

## Principais Funcionalidades

- **Estrutura Clean Architecture**: Separação clara entre camadas de domínio, casos de uso, infraestrutura e interfaces.
- **TypeScript**: Tipagem estática e moderna para maior robustez e produtividade.
- **Aliases de Path**: Imports organizados usando `@domain`, `@infra` e `@usecases` para facilitar a manutenção e refatoração.
- **Sequelize ORM**: Integração pronta para bancos relacionais (MySQL por padrão), com suporte a migrações e models.
- **Migrations Automatizadas**: Migrações do banco de dados executadas automaticamente no Docker e via script.
- **Docker & Docker Compose**: Ambiente pronto para desenvolvimento e produção, incluindo banco de dados MySQL e scripts de inicialização.
- **HTTPS Ready**: Suporte nativo a HTTPS com certificados customizáveis.
- **ESLint & Prettier**: Padrão de código consistente e automatizado, com integração para formatar ao salvar.
- **EditorConfig**: Padronização de finais de linha, indentação e charset em todo o projeto.
- **Scripts de build e produção**: Scripts prontos para build (`npm run build`) e execução do código compilado (`npm start`).
- **Configuração por .env**: Variáveis de ambiente centralizadas para fácil customização.
- **Index Pattern**: Cada pasta principal expõe seus módulos via `index.ts`, permitindo imports limpos e centralizados.

## Estrutura de Pastas

```
├── src/
│   ├── domain/         # Entidades, repositórios e serviços de domínio
│   ├── usecases/       # Casos de uso (application layer)
│   ├── infrastructure/ # Implementações técnicas (DB, Express, etc)
│   └── server.ts       # Bootstrap do servidor
├── config/             # Configurações do Sequelize CLI
├── migrations/         # Migrações do banco de dados
├── certs/              # Certificados SSL para HTTPS
├── Dockerfile          # Build da aplicação
├── docker-compose.yml  # Orquestração de containers
├── .env                # Variáveis de ambiente
├── .editorconfig       # Padrão de editor
├── .eslintrc.json      # Configuração do ESLint
├── .prettierrc         # Configuração do Prettier
```

## Como usar

### Desenvolvimento

```sh
npm install
npm run dev
```

### Produção

```sh
npm run build
npm start
```

### Docker

```sh
docker-compose up --build
```

### Migrações

```sh
npm run migrate
```

### Gerar nova migração

```sh
npm run generate-migration -- nome-da-migracao
```

## Excepcionalidades e Diferenciais

- **Aliases globais**: Imports limpos e sem caminhos relativos complexos.
- **Compatível com Node.js 24+**: Pronto para ESM ou CommonJS, conforme necessidade.
- **Padronização de código garantida**: ESLint, Prettier e EditorConfig integrados.
- **HTTPS nativo**: Segurança pronta para produção.
- **Migrações automáticas no Docker**: Banco sempre atualizado ao subir o ambiente.
- **Arquitetura escalável**: Fácil de expandir para múltiplos domínios, casos de uso e integrações.

---

> **Nota:** Este template não inclui rotas de teste ou exemplos de domínio. Adicione suas entidades, casos de uso e controllers conforme a necessidade do seu projeto.
