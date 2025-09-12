# my-better-t-app

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines Express, TRPC, and more.

## Features

- **TypeScript** - For type safety and improved developer experience
- **Express** - Fast, unopinionated web framework
- **Node.js** - Runtime environment
- **Prisma** - TypeScript-first ORM
- **PostgreSQL** - Database engine
- **Authentication** - Better-Auth
- **Husky** - Git hooks for code quality

## Getting Started

First, install the dependencies:

```bash
npm install
```
## Database Setup

This project uses PostgreSQL with Prisma.

1. Make sure you have a PostgreSQL database set up.
2. Generate the Prisma client:
```bash
npm run db:generate
```


**If you make ANY changes to the Prisma schema files** (in `prisma/schema/`), you **MUST** push the changes to the database:

```bash
npm run db:push
```

This includes:
- Adding new models/tables
- Modifying existing fields
- Adding/removing relationships
- Changing field types
- Adding/removing indexes

**Always run `npm run db:push` after schema changes** to keep your database in sync with your schema definition.


Then, run the development server:

```bash
npm run dev
```

The API is running at [http://localhost:3000](http://localhost:3000).






## Available Scripts

- `npm run dev`: Start all applications in development mode
- `npm run build`: Build all applications
- `npm run dev:web`: Start only the web application
- `npm run dev:server`: Start only the server
- `npm run check-types`: Check TypeScript types across all apps
- `npm run db:push`: Push schema changes to database
- `npm run db:studio`: Open database studio UI
 - `npm run db:generate`: Generate prisma client

