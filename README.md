# Portfolio + Admin (MongoDB Edition)

Full-stack starter for an AI/ML + Full-Stack engineer portfolio with:

- React + Tailwind client
- Express backend
- MongoDB (via Mongoose) for projects
- JWT admin auth
- Resume upload (Multer)
- Admin panel for projects + resume

## 1. Backend setup

```bash
cd server
cp .env.example .env
# edit .env and set MONGO_URI, ADMIN_EMAIL, ADMIN_PASSWORD, CLIENT_ORIGIN, JWT_SECRET
npm install
npm run dev
```

To seed dummy projects:

```bash
npm run seed
```

## 2. Frontend setup

```bash
cd client
npm install
echo "VITE_API_BASE_URL=http://localhost:5000" > .env
npm run dev
```

- Public site: http://localhost:5173
- Admin login: http://localhost:5173/login
  - Email & password from `server/.env`
