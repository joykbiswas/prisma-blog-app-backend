# Prisma ORM with PostgreSQL

This project uses **Prisma ORM** with a **PostgreSQL** database.

## Prisma Blog

### Getting Started

First, install the dependencies and run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:5000]
 in your browser to see the application.

### API Documentation (Swagger)

Swagger UI is available at: [http://localhost:5000/api-docs/]

## Prisma Setup 

```bash
1. npx prisma init
2. npx prisma migrate dev --name init
3. npx prisma generate
# or Schema Changes Workflow
4. npx prisma migrate dev --name update_schema

```