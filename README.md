# AI-Based Employee Performance Analytics & Recommendation System

## Overview
A full-stack MERN application for HR/Admin users to manage employees, track performance, and generate AI-based recommendations for promotions, training, and rankings using the OpenRouter/OpenAI API.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, React Router, Recharts, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT, bcryptjs

## Prerequisites
- Node.js (v18+)
- MongoDB (running locally or a MongoDB Atlas URI)
- OpenRouter API Key

## Setup & Installation

1. **Clone & Install Dependencies**
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the `server` directory using `.env.example` as a template:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/employee-ai-db
   JWT_SECRET=your_secret_key
   OPENROUTER_API_KEY=your_openrouter_api_key
   ```

3. **Run the Application**
   ```bash
   # Start backend (from server directory)
   node server.js

   # Start frontend (from client directory)
   npm run dev
   ```

## API Routes

### Authentication
- `POST /api/auth/signup` - Register a new admin user
- `POST /api/auth/login` - Login

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get single employee
- `POST /api/employees` - Add new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee
- `GET /api/employees/search?department=...` - Search employees

### AI Recommendations
- `POST /api/ai/recommend` - Generate AI recommendations for an employee
