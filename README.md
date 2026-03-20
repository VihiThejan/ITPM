# ITPM

Component-based MERN application scaffold focused on:

- Student Search and Discovery module
- Landing page
- Home page

## Tech Stack

- Frontend: React + Vite + JavaScript + Material UI
- Backend: Node.js + Express (REST)
- Database: MongoDB + Mongoose

## Project Structure

```text
ITPM/
  backend/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      validators/
      scripts/
  frontend/
    src/
      components/
      context/
      pages/
      services/
      utils/
```

## Implemented Scope

### Frontend pages

- `/` Landing page
- `/home` Home page
- `/boardings` Boarding search with advanced filters
- `/boardings/:listingId` Boarding details with map, WhatsApp CTA, reviews
- `/bookmarks` Saved boarding list

### Backend API

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/listings`
- `GET /api/listings/:listingId`
- `GET /api/reviews?listingId=...`
- `POST /api/reviews` (verified students only)
- `GET /api/bookmarks` (student only)
- `POST /api/bookmarks` (student only)
- `DELETE /api/bookmarks/:listingId` (student only)

## Environment Variables

### Backend (`backend/.env`)

Use `backend/.env.example` as reference.

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `CLIENT_URL`

### Frontend (`frontend/.env`)

Use `frontend/.env.example` as reference.

- `VITE_API_BASE_URL`

## Run Locally

### 1. Start backend

```bash
cd backend
npm install
copy .env.example .env
npm run seed
npm run dev
```

### 2. Start frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

## Notes for Team Integration

- Seeded demo users:
  - Student: `nimali@my.sliit.lk` / `Student@123`
  - Owner: `kamal.owner@gmail.com` / `Owner@123`
- Protected endpoints expect JWT payload fields:
  - `sub` (user id)
  - `role` (`student`, `owner`, `admin`)
  - `isVerifiedStudent` (boolean)
- Review submission is restricted to verified students.
- Listing search returns only approved and available entries.
- Owner privacy rule is respected by only exposing safe review data to public/student views.
