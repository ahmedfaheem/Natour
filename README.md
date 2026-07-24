# Natour — Node.js Tours App

Simple RESTful Node.js app based on Jonas Schmedtmann's Natours course (section 6).

## Features

- Tours and Users REST API
- Pug templates for server-rendered views
- Sample JSON seed data in `dev-data/data`

## Requirements

- Node.js 14+ (recommended 16+)
- npm (or yarn)

## Installation

1. Install dependencies

   npm install

2. Create environment file

   - Copy `config.env` (if provided) or create a `.env`/`config.env` file in the project root with the following variables as needed:

     - `PORT` — port to run the server (default: 3000)
     - `DATABASE` — MongoDB connection string
     - `DATABASE_PASSWORD` — (if using a placeholder in `DATABASE` string)
     - `NODE_ENV` — `development` or `production`

3. (Optional) Seed dev data

   - Sample JSON files are in `dev-data/data/` for manual import or quick testing.

## Scripts

- `npm run dev` — start the app with `nodemon` (development)

Use `node server.js` to start the app without `nodemon`.

## Run

- Development (recommended):

```
npm run dev
```

- Production:

```
node server.js
```

## API overview

- Routes are defined in `routes/tourRoutes.js` and `routes/userRoutes.js`.
- Main resources: `/api/v1/tours` and `/api/v1/users` (see route files for full list).

## Project structure

- `app.js` — Express app and middleware setup
- `server.js` — Server bootstrap and database connection
- `routes/` — Route definitions
- `controllers/` — Request handlers (controllers)
- `models/` — Mongoose models
- `dev-data/` — Sample JSON data for seeding/testing
- `public/` — Static assets and client HTML/CSS
- `img/templates/` — Pug templates used for views and emails

## Development notes

- Edit `config.env` values before running in production.
- Install `nodemon` globally or use the `dev` npm script for auto-reload.

## License

This repository contains course/demo code; review the original course license before reuse.
