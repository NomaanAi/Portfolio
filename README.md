# Portfolio Project with Admin Panel (Production-ready skeleton)

This repository contains a full-stack portfolio website with an admin panel.
Tech stack:
- Frontend: React + Vite + Tailwind CSS + Radix UI + React Router
- Admin Panel: React (inside frontend/admin)
- Backend: Node.js + Express
- Database: MongoDB (Mongoose)
- Auth: JWT (http-only cookies)

## Quick start (local)

1. Backend
```bash
cd backend
cp .env.example .env
# edit .env to set MONGO_URI and JWT_SECRET
npm install
npm run dev
```

2. Frontend
```bash
cd frontend
npm install
npm run dev
```

## Notes
- This is a scaffold with full controllers, models, routes and example frontend admin pages.
- For production, configure CORS origins, secure cookies, and use an external storage for uploads.
