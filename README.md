# Kaleg Portfolio

Full-stack personal portfolio website built with **Laravel** (REST API) and **React** (SPA).

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Backend | Laravel 13 + Sanctum |
| Frontend | Vite + React |
| Database | MySQL |
| Auth | Laravel Sanctum (token-based) |

## 📁 Project Structure

```
kaleg.my.id/
├── backend/     → Laravel REST API
└── frontend/    → Vite + React SPA
```

## 🚀 Setup

### Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate

# Configure MySQL in .env then:
php artisan migrate --seed
php artisan serve
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## 🌐 API Endpoints

### Public
- `GET /api/v1/profile`
- `GET /api/v1/skills`
- `GET /api/v1/experiences`
- `GET /api/v1/posts`
- `GET /api/v1/posts/{slug}`

### Admin (Bearer Token)
- `POST /api/v1/auth/login`
- `PUT /api/v1/admin/profile`
- `CRUD /api/v1/admin/skills`
- `CRUD /api/v1/admin/experiences`
- `CRUD /api/v1/admin/posts`

## 🔐 Default Admin

After seeding:
- Email: `admin@kaleg.my.id`
- Password: `password`

> ⚠️ Change the password after first login!

## 🏗️ Deployment

### Backend (Laravel)
Point Nginx to `backend/public/` as document root.

### Frontend (React SPA)
```bash
cd frontend
npm run build
```
Point Nginx to `frontend/dist/` with try_files fallback for SPA routing.
