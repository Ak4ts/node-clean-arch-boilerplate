# Contribuindo

## Antes de abrir um PR

```sh
npm ci
npm run lint
npm run typecheck
npm run build
npm test
```

São exatamente os quatro comandos que a CI roda, em Node 20 e 24. Se passam localmente, passam lá.

## Commits

- Um commit por mudança. Feature ou correção vai junto com o teste que a prova, no mesmo commit.
- Nada de commit misturando formatação, refactor e feature: isso esconde o que realmente mudou.
- [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `refactor:`, `test:`, `chore:`, `ci:`, `docs:`.
- A mensagem explica **por que**, não o que o diff já mostra.

## Regras que o código precisa respeitar

- **Dependências apontam para dentro.** `domain` não importa de `@infra`, `@usecases` ou `express`. Se o domínio precisa sinalizar um erro, estenda `DomainError` em `@domain/errors` — sem status HTTP.
- **Status HTTP só na infraestrutura.** Controllers chamam `next(error)`; quem traduz erro em status é `@infra/express/middlewares/error-handler`.
- **Nada de importar do barrel de dentro dele.** Dentro de `src/infrastructure/databases/sequelize`, use caminhos relativos: importar de `@infra` cria ciclo.
- **Models Sequelize declaram campos com `declare`.** `public id!: number` vira propriedade real com target ES2022 e esconde os getters do Sequelize.
- **Nada de segredo no repositório.** Sem `.env`, sem chave privada, sem credencial em log. `certs/` é ignorado.

## Testes

- Regra de negócio: teste do service contra um repositório stub.
- Persistência: teste do repositório contra o sqlite em memória — sem precisar de MySQL.
- Rota: teste de API com supertest.

A cobertura tem mínimo obrigatório em `vitest.config.mts`. Quando a cobertura sobe, suba o mínimo junto. Nunca baixe o mínimo para fazer um build passar.
