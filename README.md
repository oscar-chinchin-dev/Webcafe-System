# MiWebCafe Angular Frontend

Frontend application built with Angular to manage cafeteria operations through a secure REST API.

This client consumes the MiWebCafe API backend.

---

## Features

- JWT Authentication
- Role-based route protection
- Sales registration UI
- Cash register management
- HTTP interceptors for token handling
- Route guards

---

## Tech Stack

- Angular
- TypeScript
- Angular Router
- HTTP Client
- Interceptors
- Route Guards

---

## Authentication Flow

1. User logs in
2. JWT token is stored
3. Token is attached to HTTP requests
4. Backend validates authorization

Roles:
- Admin
- Cashier

---

## Running Locally

npm install
ng serve


Application runs at:
(http://localhost:4200)

---

## Backend Dependency

This frontend requires the MiWebCafe API backend to be running.

API base URL should be configured in:
environment.ts

---

## Future Improvements

- UI enhancements
- Dashboard analytics
- Inventory module
- Deployment optimization

---

## Author

Oscar Chinchin
