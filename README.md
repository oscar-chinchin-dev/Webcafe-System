# WebCafe System

Full-stack web application designed to manage the daily operations of a cafeteria, including authentication, sales management, and administrative reporting.

This project was developed as a practical learning exercise to simulate a real-world business workflow using modern web technologies and a clean backend architecture.

---

## Features

- User authentication with JWT
- Role-based access control (Admin / Cashier)
- Sales registration and management
- Administrative reports
- Secure API communication
- Separation of concerns using services and DTOs

---

## Tech Stack

**Frontend**
- Angular
- TypeScript
- HTTP Client
- Route Guards
- Interceptors

**Backend**
- ASP.NET Core Web API
- Entity Framework Core
- JWT Authentication
- RESTful API design

**Database**
- SQL Server (SSMS)

---

## Project Structure

Webcafe-System
│
├── MiWebCafe.API        # Backend (ASP.NET Core Web API)
├── src / public         # Frontend (Angular)
└── README.md

---

## Authentication & Security

The system uses:

- JWT tokens for authentication
- Role-based authorization
- Route guards on the frontend
- Middleware validation on the backend

Roles implemented:
- Admin
- Cashier

---

## How to Run the Project

### Backend

1. Open the solution in Visual Studio
2. Configure the connection string in:

appsettings.json

3. Update the database:

Update-Database

4. Run the API

---

### Frontend

In the project root:

npm install
ng serve

The application will run at:

http://localhost:4200

---

## Learning Goals of This Project

This project was built to practice:

- Full-stack architecture
- REST API design
- Authentication with JWT
- Angular services and guards
- Database design with Entity Framework
- Clean code and project documentation

---

## Author

Developed by Oscar Chinchin

---

## Future Improvements

- Dashboard analytics
- Inventory module
- Deployment to cloud environment
- UI improvements
