# KisanBazaar

A farm-to-market marketplace for farmers, buyers, and administrators.

## Project structure

```text
Project-01/
├── frontend/
│   ├── App.tsx
│   ├── components/
│   ├── features/
│   ├── pages/
│   ├── services/
│   ├── store/
│   ├── public/
│   ├── package.json
│   ├── index.html
│   ├── vite.config.ts
│   └── tsconfig*.json
├── backend/
│   ├── index.js
│   ├── auth.js
│   ├── config/
│   ├── models/
│   └── package.json
└── README.md
```

All React, TypeScript, Vite, and frontend static files are inside `frontend/`.
All Express, authentication, MongoDB, and backend files are inside `backend/`.

## Backend setup

Create the local environment file:

```powershell
Copy-Item backend/.env.example backend/.env
```

Set the MongoDB and JWT values in `backend/.env`, then run:

```powershell
cd backend
npm install
npm run dev
```

The backend health check is available at:

```text
http://localhost:4000/api/health
```

## Frontend setup

In a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the frontend at `http://localhost:5173`.

The deployed frontend uses `https://kisanbazaar-1.onrender.com/api` by default. Set
`frontend/.env` with `VITE_API_URL` to override the API URL when needed.

For the deployed backend, set the Render environment variable
`CLIENT_ORIGIN=https://kisanbazaar-v1-1.onrender.com,http://localhost:5173`.

## Run both services

From the frontend folder:

```powershell
cd frontend
npm run dev:full
```

## Validation

Run these commands from `frontend/`:

```powershell
npm run build
npm run lint
```

The backend requires `MONGODB_URI` and `JWT_SECRET` before it can start.
Never commit `backend/.env` or any real credentials.
