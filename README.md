# 101515982 COMP3123 Assignment 2

Full-stack employee management platform built with Node.js/Express/MongoDB and React (CRA) + Material UI. The app supports secure auth, employee CRUD, department/position search, and profile photo uploads, all orchestrated through Docker Compose.

 **Backend Setup**

   ```bash
   cd backend
   cp .env.example .env
   # edit .env: set MONGO_URI, JWT_SECRET, CORS_ORIGIN
   npm install
   npm run dev
   ```

   - Wait for the `MongoDB connected` and `Server listening` logs.
   - Optional: GET `http://localhost:5001/health` to confirm uptime.

 **Frontend Setup (new terminal)**

   ```bash
   cd frontend/101515982_comp3123_assignment2_reactjs
   cp .env.example .env
   # set REACT_APP_API_BASE_URL=http://localhost:5001/api
   npm install
   npm start
   ```

   - CRA boots at `http://localhost:3000`.
   - Signup, login, and exercise CRUD/search/upload flows end-to-end.
