# 🏍️ ONN Bikes - Bike Rental Platform

Full-stack bike rental application with a React frontend and Java Spring Boot backend.

## 📁 Project Structure

```
bike-rental-app/
├── frontend/          # React + TanStack + Vite (deployed on Vercel)
├── backend/           # Java Spring Boot + Maven (deployed on Render)
├── supabase/          # Supabase migrations & config
└── .gitignore
```

## 🚀 Deployment

| Service   | Folder     | Platform |
|-----------|------------|----------|
| Frontend  | `frontend/` | Vercel   |
| Backend   | `backend/`  | Render   |

## 🛠️ Tech Stack

- **Frontend**: React, TanStack Router, Vite, Tailwind CSS, Supabase
- **Backend**: Java 25, Spring Boot 3.5.16, PostgreSQL, JPA/Hibernate
- **Database**: Supabase (PostgreSQL)

## 🏃 Local Development

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
mvn spring-boot:run
```
