# 🚀 PrimeTrade Full-Stack Assignment

A high-performance, premium full-stack application featuring a Next.js 14 frontend and a robust Node.js/Express backend. This project is optimized for deployment as a single unified service on Render.

## ✨ Features

- **User Authentication**: Secure JWT-based registration and login system.
- **Product Management**: Full CRUD operations (Create, Read, Update, Delete) for products.
- **Premium UI/UX**: Built with Tailwind CSS v4, Inter font, and subtle micro-animations for a high-end feel.
- **Unified Deployment**: Frontend is served directly by the backend for a simple, single-service deployment.
- **Database**: PostgreSQL with Prisma ORM (v7) and driver adapters for high reliability.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS v4, Lucide Icons.
- **Backend**: Node.js, Express 5, Prisma v7, PostgreSQL.
- **Security**: Helmet, CORS, JWT, BcryptJS, Express-Rate-Limit.

---

## 🚦 Getting Started Locally

### 1. Prerequisites
- Node.js 20.x
- PostgreSQL database

### 2. Environment Setup
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
DATABASE_URL=your_postgresql_url
JWT_SECRET=your_secret_string
NODE_ENV=development
```

### 3. Installation & Run
From the root directory:
```bash
# Install all dependencies and build everything
npm run build

# Start the application
npm start
```
Your app will be running at `http://localhost:5000`.

---

## ☁️ Deployment on Render

This project is pre-configured for **Render** monolith deployment.

1. **Build Command**: `npm run build`
2. **Start Command**: `npm start`
3. **Environment Variables**:
   - `DATABASE_URL`: Your Render DB URL
   - `JWT_SECRET`: A strong random secret
   - `NODE_ENV`: `production`

---

## 🐳 Docker Support

You can also run the entire unified stack using Docker:

### 1. Build the image
```bash
docker build -t primetrade-app .
```

### 2. Run the container
```bash
docker run -p 5000:5000 \
  -e DATABASE_URL=your_db_url \
  -e JWT_SECRET=your_secret \
  -e NODE_ENV=production \
  primetrade-app
```

---

## 💻 Scripts Overview

- `npm run build`: Installs all dependencies and builds both backend (Prisma) and frontend (Next.js).
- `npm start`: Runs Prisma migrations and starts the production server.
- `npm run build:frontend`: Specifically builds the frontend static export.
- `npm run build:backend`: Specifically installs backend deps and generates Prisma Client.

---

Developed for the PrimeTrade Backend Assignment.
