# Project Context: kaleg.my.id

## 1. Architecture Overview
- **Type**: Monorepo Portfolio & Content Management System.
- **Backend**: Laravel (PHP 8.3+) REST API.
  - Authentication: Laravel Sanctum (`AdminUser` model, token-based).
  - Database: MySQL / SQLite support with Eloquent migrations and seeders.
  - Endpoints: Public profile/skills/posts API (`/api/v1/*`) and Sanctum-protected Admin API (`/api/v1/admin/*`).
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS.
  - State & Routing: `react-router-dom`, `axios`.

## 2. Security & Design Constraints
- **Secrets Management**:
  - Never hardcode administrative credentials, tokens, or personal emails into codebase or seeders.
  - Decouple all sensitive defaults to environment variables (`.env`).
  - Provide safe, non-sensitive fallback defaults for local development environments in `.env.example`.
- **Git Tracking Policy**:
  - Codebase integrity must be maintained: core framework files such as `DatabaseSeeder.php` must remain tracked in Git to ensure consistent schema and data hydration across development, staging, and CI/CD environments.
  - Files ignored: `.env`, local SQLite artifacts, `/vendor`, `/node_modules`, `/storage`, build artifacts.

## 3. Changelog & Modifications
### 31 Oktober 2026 23:55 WIB
- **Drafting Context.md**: Initial architectural context and documentation setup.
- **Security Audit (DatabaseSeeder.php)**:
  - Identified hardcoded admin credentials in `backend/database/seeders/DatabaseSeeder.php`.
  - Addressed request to ignore seeder: advised decoupling credentials to `.env` rather than ignoring `DatabaseSeeder.php` in `.gitignore` to prevent CI/CD breakage and maintain repository integrity.

