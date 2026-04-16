# CalClone — Scheduling Platform

A full-stack scheduling application inspired by [Cal.com](https://cal.com), built as part of the Scaler SDE Intern Fullstack Assignment.

## 🛠 Tech Stack

| Layer      | Technology                     |
|------------|--------------------------------|
| Frontend   | Next.js 16 (App Router), React 19, Tailwind CSS 4 |
| Backend    | Node.js, Express 5             |
| Database   | PostgreSQL, Prisma ORM 5       |
| Validation | Zod                            |

## ✨ Features

### Core Features
- **Event Types Management** — Create, edit, delete event types with title, description, duration, and URL slug
- **Availability Settings** — Set available days and time ranges per event type with timezone support
- **Public Booking Page** — Calendar view, time slot selection, booking form with name/email, double-booking prevention
- **Bookings Dashboard** — View upcoming/past bookings, cancel bookings, filter by event type and search

### Bonus Features
- Buffer time between meetings
- Past slot filtering (can't book times that have already passed)
- Soft-delete for bookings (preserves history)
- Input validation on all API endpoints
- Responsive sidebar navigation

## 📂 Project Structure

```
cal-clone/
├── client/                  # Next.js frontend
│   ├── app/                 # App Router pages
│   │   ├── (admin)/         # Admin pages (with sidebar layout)
│   │   └── (public)/        # Public booking page
│   ├── components/          # Reusable UI components
│   ├── hooks/               # Custom React hooks
│   └── lib/                 # API client
├── server/                  # Express backend
│   ├── prisma/              # Schema + migrations + seed
│   └── src/
│       ├── config/          # Prisma client, env config
│       ├── controllers/     # Request/response handling
│       ├── middleware/       # Validation, error handling
│       ├── routes/          # API route definitions
│       ├── services/        # Business logic
│       ├── utils/           # Slot generation
│       └── validators/      # Zod schemas
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL running locally

### 1. Clone the repository
```bash
git clone <repo-url>
cd cal-clone
```

### 2. Setup the backend
```bash
cd server
npm install

# Create .env file with your database URL
echo 'DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/cal_clone"' > .env

# Run database migrations
npx prisma migrate dev --name init

# Seed sample data
npx prisma db seed

# Start the server
npm start
```

### 3. Setup the frontend
```bash
cd client
npm install

# Create .env.local
echo 'NEXT_PUBLIC_API_URL=http://localhost:5000' > .env.local

# Start the dev server
npm run dev
```

### 4. Open the app
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📊 Database Schema

```
EventType (1) ──── (N) Availability
EventType (1) ──── (N) Booking
```

- **EventType**: id, title, description, duration, slug, bufferTime
- **Availability**: id, eventTypeId, dayOfWeek, startTime, endTime, timezone
- **Booking**: id, eventTypeId, name, email, startTime, endTime, status

## 🔑 Key Design Decisions

1. **Atomic availability saves** — Uses Prisma transactions to prevent partial data loss
2. **Double-booking prevention** — Database unique constraint + server-side validation
3. **Soft delete for bookings** — Status enum (CONFIRMED/CANCELLED) instead of hard delete
4. **Pure slot generation** — Arithmetic-only algorithm with no Date object dependency
5. **Timezone-aware slots** — Day-of-week calculated in the host's timezone
6. **Input validation** — Zod schemas on all mutation endpoints
7. **Layered architecture** — Routes → Controllers → Services → Prisma

## 🤔 Assumptions

- A default user is assumed to be logged in (no authentication)
- Availability timezone defaults to browser timezone, stored per availability record
- Booking times are stored in UTC
- All event types are visible to all visitors on the public booking page
