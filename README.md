# Projeto API NestJS

Este projeto é uma API construída com o framework **NestJS**, projetada para gerenciar categorias, produtos, pedidos.

## Estrutura do Projeto

O projeto segue uma arquitetura modular, com cada funcionalidade principal organizada em módulos separados.

```
src/
├── category/            # Modulo para gerenciar categorias
├── common/              # Reutilizáveis
├── config/              # Configurações
├── dashboard/           # Modulos dashboard
├── order/               # Módulo para gerenciar pedidos
├── product/             # Módulo para gerenciar produtos
├── app.module.ts        # Módulo raiz da aplicação
├── main.ts              # Ponto de entrada da aplicação
```

## Tecnologias Utilizadas

- **Node.js**
- **NestJS** - Framework para construção da API.
- **MongoDB** - Banco de dados NoSQL.
- **Mongoose** - ODM para interação com o MongoDB.
- **TypeScript** - Superset do JavaScript.
- **class-validator** - Validação de objetos e DTOs.
- **Swagger** - Documentação da API com Swagger UI.
- **Joi** - Validação de esquemas.

## Instalação

1. Clone este repositório:

   ```bash
   git clone <url-do-repositorio>
   cd <nome-do-projeto>
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente no arquivo `.env`. Exemplo:

   ```env
   MONGO_URI=
   MONGO_DB_NAME=
   MONGO_USER=
   MONGO_PASSWORD=
   PORT=3000
   PAGINATION_DEFAULT_PAGE=1
   PAGINATION_DEFAULT_LIMIT=
   ```

4. Inicie o servidor:
   ```bash
   npm run start:dev
   ```

## Seeder

Para popular o banco de dados com dados iniciais, execute o comando:

```bash
npx ts-node scripts/seed.ts
```

## Documentação

Para acessar a documentação Swagger
/documentation

---
