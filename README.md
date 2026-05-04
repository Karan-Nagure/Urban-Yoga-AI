# 🧘 Urban Yogi — Setup Guide

## Prerequisites
- Node.js 14+ and npm
- MySQL 8.0+

---

## 1. MySQL Database Setup

Open MySQL and run the schema file:

```bash
mysql -u root -p < backend/schema.sql
```

This creates the `urban_yogi` database with `users` and `pose_sessions` tables.

---

## 2. Backend Setup (Express + MySQL)

```bash
cd backend

# Edit .env with your MySQL credentials
# Open .env and set DB_PASSWORD to your MySQL root password

npm install
node server.js
```

Backend runs on **http://localhost:5000**

Test it: open http://localhost:5000/api/health in your browser — you should see `{"status":"OK"}`

---

## 3. Frontend Setup (React)

```bash
# From the project root folder (UrbanYoga-Final)
npm install
npm start
```

Frontend runs on **http://localhost:3000**

---

## Features Added

### 🔐 Authentication
- `/register` — Create a new account (username, email, password)
- `/login`    — Sign in to your account
- Protected routes: `/start`, `/yoga`, `/profile` require login

### 👤 Profile Page (`/profile`)
- Avatar color picker
- Personal info: Full Name, Age, Gender, Height, Weight
- Fitness Goal selector (8 options)
- Bio text field
- Edit via `/profile/edit`

### 📊 Yoga Session Tracking
- Every time you stop a pose session, it's saved to MySQL automatically
- Profile shows per-pose stats: total sessions, total time, personal best
- Recent sessions table with date/time

---

## Database Tables

### `users`
| Column | Type | Description |
|--------|------|-------------|
| id | INT AUTO_INCREMENT | Primary key |
| username | VARCHAR(50) | Unique username |
| email | VARCHAR(100) | Unique email |
| password | VARCHAR(255) | Bcrypt hashed |
| full_name | VARCHAR(100) | Display name |
| age | INT | User age |
| gender | ENUM | Gender |
| height_cm | FLOAT | Height in cm |
| weight_kg | FLOAT | Weight in kg |
| fitness_goal | VARCHAR(200) | Selected goal |
| bio | TEXT | User bio |
| avatar_color | VARCHAR(20) | Hex color code |
| created_at | TIMESTAMP | Registration date |

### `pose_sessions`
| Column | Type | Description |
|--------|------|-------------|
| id | INT AUTO_INCREMENT | Primary key |
| user_id | INT | Foreign key → users.id |
| pose_name | VARCHAR(100) | e.g. "Tree", "Cobra" |
| duration_sec | FLOAT | Pose hold time |
| best_sec | FLOAT | Personal best for this run |
| practiced_at | TIMESTAMP | When session happened |

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Create account |
| POST | /api/auth/login | No | Login |
| GET | /api/user/profile | Yes | Get profile |
| PUT | /api/user/profile | Yes | Update profile |
| POST | /api/user/session | Yes | Save pose session |
| GET | /api/user/sessions | Yes | Get last sessions |
| GET | /api/user/stats | Yes | Get per-pose stats |
