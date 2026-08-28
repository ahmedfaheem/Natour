# 🏔️ Natours — Tour Booking API

A full-featured RESTful API and server-side rendered web app for booking nature tours. Built with **Node.js**, **Express**, and **MongoDB** as part of the [Node.js by Jonas Schmedtmann](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/) course.

[![Postman Docs](https://img.shields.io/badge/Postman-API%20Docs-orange?logo=postman&logoColor=white)](https://documenter.getpostman.com/view/48604520/2sBYAuSB2G)

---

## ✨ Features

- 🔐 **JWT Authentication** — Signup, login, logout with HTTP-only cookies
- 👮 **Role-Based Access Control** — `user`, `guide`, `lead-guide`, `admin`
- 🗺️ **Geospatial Queries** — Find tours within a radius using MongoDB 2dsphere indexes
- 📷 **Image Upload & Processing** — Profile and tour images via Multer + Sharp
- 💳 **Stripe Payments** — Secure online tour booking/checkout
- 📧 **Email Notifications** — Welcome & password-reset emails via Nodemailer
- 🛡️ **Security** — Rate limiting, HPP, NoSQL injection & XSS protection, Helmet headers
- 🗜️ **Compression** — Gzip response compression for performance
- 🖥️ **Server-Side Rendering** — Pug template engine for web views
- ⭐ **Reviews & Ratings** — Users can review booked tours with auto-calculated averages

---

## 🗂️ Project Structure

```
natours/
├── controllers/          # Route handler logic
│   ├── authController.js      # Auth, JWT, password reset
│   ├── tourController.js      # Tour CRUD + geo queries
│   ├── userController.js      # User profile management
│   ├── reviewController.js    # Review CRUD
│   ├── bookingController.js   # Stripe checkout & bookings
│   ├── viewController.js      # SSR page controllers
│   ├── handlerFactory.js      # Generic CRUD factory functions
│   └── errorController.js     # Global error handler
├── models/               # Mongoose schemas
│   ├── tourModel.js
│   ├── userModel.js
│   ├── reviewModel.js
│   └── bookingModel.js
├── routes/               # Express routers
│   ├── tourRoutes.js
│   ├── userRoutes.js
│   ├── reviewRoutes.js
│   ├── bookingRoutes.js
│   └── viewRoutes.js
├── views/                # Pug templates (SSR)
├── public/               # Static assets (CSS, JS, images)
├── utils/                # Helper utilities (AppError, etc.)
├── dev-data/             # Seed data & scripts
├── app.js                # Express app setup & middleware
├── server.js             # Server entry point & DB connection
└── config.env            # Environment variables (not committed)
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- A [Stripe](https://stripe.com) account (for payments)
- A SMTP email provider (e.g. Mailtrap, SendGrid)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd natours
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example file and fill in your values:

```bash
cp config.env.example config.env
```

| Variable | Description |
|---|---|
| `NODE_ENV` | `development` or `production` |
| `PORT` | Port to run the server (default: `3000`) |
| `DB_GLOBAL` | MongoDB Atlas connection string |
| `DB_LOCAL` | Local MongoDB URI |
| `DB_PASS` | MongoDB Atlas password |
| `JWT_SECRET` | Strong secret key for JWT signing |
| `JWT_EXPIERS_IN` | JWT expiry duration (e.g. `90d`) |
| `JWT_COOKIES_EXPIERS_IN` | Cookie expiry in days (e.g. `90`) |
| `EMAIL_HOST` | SMTP host |
| `EMAIL_PORT` | SMTP port |
| `EMAIL_USERNAME` | SMTP username |
| `EMAIL_PASSWORD` | SMTP password |
| `WebEmail` | Sender email address |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `MAPBOX_ACCESS_TOKEN` | Mapbox token for maps |
| `DNS_SERVERS` | Custom DNS servers (e.g. `8.8.8.8,1.1.1.1`) |

### 4. Run the development server

```bash
npm run dev
```

Server starts at **http://localhost:3000**

---

## 📡 API Endpoints

Base URL: `/api/v1`

### Tours

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/tours` | Public | Get all tours |
| GET | `/tours/:id` | Public | Get a single tour |
| POST | `/tours` | Admin/Lead | Create a tour |
| PATCH | `/tours/:id` | Admin/Lead | Update a tour |
| DELETE | `/tours/:id` | Admin/Lead | Delete a tour |
| GET | `/tours/top-5-cheap` | Public | Get top 5 cheap tours |
| GET | `/tours/tour-stats` | Public | Aggregated tour statistics |
| GET | `/tours/monthly-plan/:year` | Admin/Lead | Monthly tour plan |
| GET | `/tours/tours-within/:dist/center/:latlng/unit/:unit` | Public | Tours within radius |
| GET | `/tours/distances/:latlng/unit/:unit` | Public | Distances from a point |

### Users

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/users/signup` | Public | Register a new user |
| POST | `/users/login` | Public | Login and receive JWT cookie |
| GET | `/users/logout` | Public | Clear auth cookie |
| POST | `/users/forgotPassword` | Public | Send password reset email |
| PATCH | `/users/resetPassword/:token` | Public | Reset password with token |
| GET | `/users/me` | Protected | Get current user profile |
| PATCH | `/users/updateMe` | Protected | Update name, email, photo |
| PATCH | `/users/updateMyPassword` | Protected | Change password |
| DELETE | `/users/deleteMe` | Protected | Deactivate account |
| GET | `/users` | Admin | Get all users |

### Reviews

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/reviews` | Public | Get all reviews |
| POST | `/tours/:tourId/reviews` | User | Create review for a tour |
| PATCH | `/reviews/:id` | User/Admin | Update a review |
| DELETE | `/reviews/:id` | User/Admin | Delete a review |

### Bookings

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/bookings/checkout-session/:tourId` | Protected (User) | Get Stripe checkout session |
| GET | `/bookings` | Admin/Lead-guide | Get all bookings |
| POST | `/bookings` | Admin/Lead-guide | Create a booking |
| GET | `/bookings/:id` | Admin/Lead-guide | Get a single booking |
| PATCH | `/bookings/:id` | Admin/Lead-guide | Update a booking |
| DELETE | `/bookings/:id` | Admin/Lead-guide | Delete a booking |

---

## 📦 3rd Party Middlewares

All middlewares are registered in [`app.js`](./app.js) unless noted.

### 🔒 Security

| Package | Usage in app.js | Description |
|---|---|---|
| `helmet` | `app.use(helmet(...))` | Sets secure HTTP headers (XSS, clickjacking, etc.) |
| `express-rate-limit` | `app.use('/api', rateLimiter)` | Limits each IP to 100 requests/hour on all `/api` routes |
| `express-mongo-sanitize` | `app.use(mongooseSanitize())` | Strips `$` and `.` from req body/params to block NoSQL injection |
| `xss-clean` | `app.use(xss())` | Sanitizes user input to prevent XSS attacks |
| `hpp` | `app.use(hpp({ whitelist: [...] }))` | Prevents HTTP parameter pollution; whitelists select query params |
| `cors` | `app.use(cors({ origin, credentials }))` | Enables cross-origin requests from the configured frontend origin |
| `bcrypt` | Used in `userModel.js` | Hashes passwords before saving to the database |

### 🛠️ Request Handling

| Package | Usage in app.js | Description |
|---|---|---|
| `express` | Core framework | HTTP routing and middleware pipeline |
| `cookie-parser` | `app.use(cookieParser())` | Parses `Cookie` header and populates `req.cookies` |
| `qs` | `app.set('query parser', qs.parse)` | Advanced query string parsing — supports nested objects like `price[gte]=100` |
| `multer` | Used in `userController.js` / `tourController.js` | Handles `multipart/form-data` file uploads |
| `compression` | `app.use(compression())` | Gzip-compresses all HTTP responses for better performance |
| `morgan` | `app.use(morgan('dev'))` | HTTP request logger (development only) |

### 🗄️ Database & ODM

| Package | Usage | Description |
|---|---|---|
| `mongoose` | `server.js` | MongoDB ODM — schemas, models, queries, middleware |
| `dotenv` | `server.js` | Loads `config.env` into `process.env` |
| `slugify` | `tourModel.js` pre-save hook | Converts tour names into URL-friendly slugs |
| `validator` | `userModel.js` | String validation (email, alpha, etc.) |

### 📷 Media Processing

| Package | Usage | Description |
|---|---|---|
| `multer` | `userController`, `tourController` | Parses uploaded files from form requests |
| `sharp` | After multer in controllers | Resizes and converts uploaded images (e.g. WebP, 500×500) |

### 💳 Payments & Emails

| Package | Usage | Description |
|---|---|---|
| `stripe` | `bookingController.js` | Creates Stripe checkout sessions for tour purchases |
| `nodemailer` | `utils/` (email helper) | Sends transactional emails (welcome, password reset) |
| `html-to-text` | Email utility | Converts HTML email templates to plain text fallback |
| `axios` | Frontend (`public/js`) | Makes API requests from client-side JS |

### 🖥️ Rendering

| Package | Usage | Description |
|---|---|---|
| `pug` | `app.set('view engine', 'pug')` | Server-side HTML templating engine |

---

## 🔒 Security Measures

- **Rate Limiting** — 100 requests per hour per IP on `/api/*`
- **Helmet** — Sets security-related HTTP headers
- **express-mongo-sanitize** — Prevents NoSQL injection attacks
- **xss-clean** — Sanitizes user input against XSS attacks
- **hpp** — Prevents HTTP parameter pollution
- **bcrypt** — Passwords hashed before storing
- **CORS** — Configured for specific origins

---

## 🛠️ Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server with nodemon |
| `npm run esbuild:dev` | Bundle frontend JS in watch mode |
| `npm run esbuild:build` | Build and minify frontend JS bundle |

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Auth | JSON Web Tokens (JWT) |
| Templating | Pug |
| Payments | Stripe |
| Email | Nodemailer |
| File Upload | Multer + Sharp |
| Bundler | esbuild |
| Linting | ESLint (Airbnb) + Prettier |

---

## 👤 Author

**Ahmed Faheem**

---

## 📄 License

ISC
