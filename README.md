# ITPM

Component-based MERN application focused on student boarding discovery with:

- Student Search and Discovery module
- Recently viewed history (local + server sync)
- Compare boardings workflow (2-3 listings)
- Verified student ratings and comments
- Student bookmarks
- OTP-based role registration and login (Student, Hostel Owner, Admin)
- Student, owner, and admin profile/dashboard views
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
- `/boardings` Boarding search with advanced filters, recently viewed, and compare strip/modal
- `/boardings/:listingId` Boarding details with map, WhatsApp CTA, reviews, bookmark toggle
- `/bookmarks` Saved boarding list (student-only)
- `/register-student` Student registration with OTP onboarding
- `/register-hostel-owner` Hostel owner registration with OTP onboarding
- `/verify-otp` OTP verification
- `/admin-login` Admin login
- `/student-profile` Student profile (student-only)
- `/owner-dashboard` Owner profile/dashboard (owner-only)
- `/admin-dashboard` Admin dashboard (admin-only)

### Student UX highlights

- Compare up to 3 listings with side-by-side modal and key-difference indicators.
- Sticky compare strip keeps selected items visible while scrolling.
- Compare modal supports printing/exporting a comparison sheet.
- Keyboard shortcuts on Discover page:
  - `Alt+C` open compare modal (when at least 2 selected)
  - `Alt+X` clear compare list
  - `Esc` close compare modal
- Recently viewed section on Discover page:
  - Tracks on details-page visits
  - Uses local storage fallback
  - Syncs to backend for signed-in students
  - Supports clear history action

### Backend API

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/login/role`
- `GET /api/auth/me`
- `POST /api/students/register`
- `GET /api/students` (admin only)
- `GET /api/students/:id` (admin or self)
- `PUT /api/students/:id` (admin or self)
- `DELETE /api/students/:id` (admin only)
- `POST /api/hostel-owners/register`
- `GET /api/hostel-owners` (admin only)
- `GET /api/hostel-owners/:id` (admin or self)
- `PUT /api/hostel-owners/:id` (admin or self)
- `DELETE /api/hostel-owners/:id` (admin only)
- `GET /api/admin` (admin only)
- `GET /api/admin/:id` (admin only)
- `DELETE /api/admin/:id` (admin only)
- `POST /api/otp/send`
- `POST /api/otp/verify`
- `POST /api/otp/resend`
- `GET /api/listings`
- `GET /api/listings/:listingId`
- `GET /api/reviews?listingId=...`
- `POST /api/reviews` (verified students only)
- `GET /api/bookmarks` (student only)
- `POST /api/bookmarks` (student only)
- `DELETE /api/bookmarks/:listingId` (student only)
- `GET /api/history/viewed?limit=5` (student only)
- `POST /api/history/viewed` (student only)
- `DELETE /api/history/viewed` (student only)

## Environment Variables

### Backend (`backend/.env`)

Use `backend/.env.example` as reference.

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN` (optional, default `7d`)
- `CLIENT_URL`
- `GMAIL_USER`
- `GMAIL_APP_PASSWORD`

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
- Seed script now includes multiple diverse boardings to demonstrate filters and compare.
- Protected endpoints expect JWT payload fields:
  - `sub` (user id)
  - `role` (`student`, `owner`, `admin`)
  - `isVerifiedStudent` (boolean)
- OTP verification is mandatory for student and owner role accounts before role login.
- Review submission is restricted to verified students.
- Listing search returns only approved and available entries.
- Owner privacy rule is respected by only exposing safe review data to public/student views.
