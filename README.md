# Devsphere Backend

This is the backend service for Devsphere, built with TypeScript, Express, and Prisma. This RESTful API poweres the DevSphere community platform with features like:

## Key Features

- **User Authentication & Authorization** - Secure JWT-based authentication with role-based access control
- **Project Management** - Complete CRUD operations for community projects with GitHub integration
- **Event Management** - Create, manage, and track community events and activities
- **Automated Contributor Sync** - Daily cron jobs to automatically fetch and sync GitHub contributors
- **Member Management** - Comprehensive team member profiles and role assignments
- **File Upload Support** - Cloudinary integration for seamless image and file uploads

## Table of Contents

- [Prerequisites](#prerequisites)
- [Architecture](#architecture)
- [Installation & Setup](#installation--setup)
- [Contributing](#contributing)
- [Tests](#tests)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v8 or higher)
- **PostgreSQL** (v13 or higher)
- **Git**

## Architecture

The following documents provide visual diagrams and workflow explanations for key backend processes:

- [Contributor Cron Job Workflow](docs/Contributor_CRON_Architecture.MD)

---

## Installation & Setup

### 1. Fork the Repository

```bash
git clone {your-forked-repo-url}
cd devsphere-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory and add the following variables:

```bash
cp .env.example .env
```

### 4. Database Setup

This project uses PostgreSQL with Prisma.

1. Make sure you have a PostgreSQL database set up.

2. Run migrations to set up the database schema:

```bash
npx prisma migrate deploy
```

3. Generate the Prisma client:

```bash
npx prisma generate
```

4. Seed the database with initial data:

```bash
npm run prisma.seed
```

5. Start the development server:

```bash
npm run dev
```

The API is running at [http://localhost:3000](http://localhost:3000).

Note: **If you make ANY changes to the Prisma schema files** (in `prisma/schema/`), you **MUST** migrate the changes to the database:

```bash
npx prisma migrate dev --name <migration_name>
```

This includes:

- Adding new models/tables
- Modifying existing fields
- Adding/removing relationships
- Changing field types
- Adding/removing indexes

## Contributing

Please see the [CONTRIBUTING.md](CONTRIBUTING.md) file for detailed guidelines on how to contribute to this project.

## Tests

- `npx vitest src/tests/events/create.test.ts` : target a particular file
- `npm run test` : test all

## Workflow test

**Make sure u have `docker` and `act` installed**

- mock the push using `act push` **ONLY USE THIS COMMAND FOR FIRST TIME**
- now check if the images are installed on docker `docker images`
- now everytime u call use `act push --reuse` so instead of creating new image it uses the existing image
