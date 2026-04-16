# Cal.com Clone – Scheduling App

A full-stack scheduling application inspired by Cal.com, featuring dynamic slot generation, availability management, and robust double-booking prevention using database constraints.

---

## 🚀 Features

* Create and manage event types
* Configure weekly availability
* Dynamic time slot generation
* Public booking page (`/book/[slug]`)
* Prevents double booking using database constraints
* Real-time slot updates after booking
* Clean and minimal UI

---

## 🛠️ Tech Stack

**Frontend**

* Next.js (App Router)
* Tailwind CSS

**Backend**

* Node.js
* Express.js

**Database**

* PostgreSQL
* Prisma ORM

---

## ⚙️ Setup Instructions

### 1. Clone repo

```bash
git clone https://github.com/sethi-44/cal-clone.git
cd cal-clone
```

### 2. Backend setup

```bash
cd server
npm install
```

Create `.env`:

```env
DATABASE_URL=your_postgres_url
```

Run:

```bash
npx prisma db push
node src/index.js
```

---

### 3. Frontend setup

```bash
cd client
npm install
npm run dev
```

---

## 🌐 Usage

* Create an event
* Set availability
* Visit `/book/[slug]`
* Select date & time
* Book slot (no double booking allowed)

---

## 🧠 Key Learning

* Handling time-based data correctly
* Preventing race conditions using DB constraints
* Full-stack state synchronization
* Building production-like scheduling systems

---

## 📌 Future Improvements

* Backend-driven slot availability (instead of frontend generation)
* Authentication system
* Booking dashboard
* UI enhancements (Cal.com style)
* Deployment (Vercel + Railway)

---

## 👨‍💻 Author

Divyanshu Sethi
