# Natour — Node.js Tours App

Simple RESTful Node.js app from Jonas Schmedtmann's Natours course (section 6).

## Features

- Tours and users API
- Pug templates for views
- Sample JSON seed data in `dev-data`

## Requirements

- Node.js 14+ (or newer)
- npm

## Setup

1. Install dependencies

   npm install

2. Create environment file

   - Copy `config.env` or create an `.env` with required environment variables (PORT, DATABASE, etc.).

3. Seed / dev data

   - Sample JSON data is available in `dev-data/data/` for quick testing.

## Run

- Start production server:

  node server.js

- Run in development (if you have `nodemon`):

  nodemon server.js

## Project structure

- `app.js` — Express app setup
- `server.js` — App bootstrap
- `routes/` — Route definitions (`tourRoutes.js`, `userRoutes.js`)
- `controllers/` — Request handlers
- `models/` — Data models
- `dev-data/` — Sample JSON data for seeding/testing
- `public/` — Static assets and frontend templates
- `img/templates/` — Pug templates used for emails and views

## Notes

- Adjust `config.env` values before running in production.
- The API endpoints are defined in `routes/tourRoutes.js` and `routes/userRoutes.js`.

## License

This repository contains course/demo code; check original course license for reuse.
