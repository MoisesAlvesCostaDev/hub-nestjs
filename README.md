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
- **docker-compose** - orquestrador de containers.

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

4. suba os serviços para isso acesse a pasta docker e execulte o comando:

   ```bash
   docker-compose up mongodb mongo-express localstack
   ```

   Configure o slasticStack S3

   ```bash
   aws configure
   ```

   Crie um Bucket

   ```bash
   aws s3api create-bucket --bucket "nome do bucket" --endpoint-url= url configurada
   ```

   Ajuste as variaveis de ambiente

5. Na raiz do projeto inicie o servidor de desenvolvimento:
   ```bash
   npm run start:dev
   ```

## Seeder

Para popular o banco de dados com dados iniciais, execute o comando:

```bash
npx ts-node scripts/seed.ts
```

## Documentação

Para acessar a documentação Swagger acesso o endpoint
/documentation

## Build

Para rodar o projeto configure as variaveis de ambiente e execulte o comando na pasta docker

```bash
docker-compose up --build
```

---
