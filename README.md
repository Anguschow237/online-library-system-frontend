# Online Library Management System (Frontend)

Full-stack online library system — **this is the Vue.js 3 frontend**.

A responsive single-page application built with Vue 3 (Composition API), Vue Router, and Bootstrap 5. It consumes the Express.js backend API to provide user authentication, book browsing, borrowing, and admin management features with role-based access control.

## Features
- **Login & Authentication**: Secure login with JWT token storage in localStorage
- **Role-Based UI**: Normal users see book browsing & borrowing; Admins see full management (books & users)
- **Book Management**: List, search, pagination, view details
- **Borrowing System**: Borrow/return books with validation feedback
- **Admin Dashboard**: User list, book CRUD, borrowing history (with Oruga Table for pagination, sorting, filtering)
- **Responsive Design**: Mobile-friendly layout using Bootstrap 5
- **Route Guards**: Protected routes redirect unauthenticated users to login
- **Composition API**: Clean state management with ref(), computed(), and composables

## Tech Stack
- Vue.js 3 (Composition API)
- Vue Router (with guards)
- Bootstrap 5 (styling & layout)
- Oruga UI (advanced tables for user/book history)
- Fetch API (for backend communication)

## Screenshots
![Login Page](images/login-page.png)  
![Books List](images/books-list.png)  
![Admin Dashboard](images/admin-dashboard.png)  
![Borrow Book](images/borrow-book.png)  
(Upload your own screenshots to an `images/` folder in the repo)

## Setup & Running
1. Clone the repository:
   ```bash
   git clone https://github.com/Anguschow237/online-library-frontend.git
   cd online-library-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure proxy (optional, for development):
   - Edit `vite.config.js` or `vue.config.js` to proxy API requests to backend (e.g., `/api` → `http://localhost:5000/api`)
4. Start the development server:
   ```bash
   npm run dev
   ```
   App runs at `http://localhost:5173` (or port shown in terminal)

## Related Repository
- Backend (Express.js): [online-library-backend](https://github.com/Anguschow237/online-library-backend)

Built by Chow Tsz Hin (Angus) — full-stack web application developed during Software Engineering course at HKBU.
