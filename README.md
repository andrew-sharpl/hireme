# HireMe

A full-stack job booking platform built with ASP.NET Core, React, and MySQL. Post jobs, discover opportunities, and express interest — all in real time.

## Tech Stack

- **Backend:** ASP.NET Core 8 Web API
- **Frontend:** React (Vite) + Material UI
- **Database:** MySQL with Entity Framework Core (Pomelo provider)
- **Authentication:** JWT Bearer tokens with role-based authorization
- **Real-time:** SignalR (real-time notifications for job interest events)
- **Language:** TypeScript (frontend)

## Features

- User registration and login with JWT authentication
- Two user roles: **Posters** (create, edit, delete jobs) and **Viewers** (browse and express interest)
- Paginated job listings with search/filter
- Interest tracking — Viewers can mark jobs they're interested in
- Posters can see which users are interested in their jobs
- Jobs automatically hidden after 2 months
- Role-based access control on all endpoints
- Real-time notifications via SignalR — Posters are instantly notified when a Viewer expresses interest in their job

---

## Getting Started

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
- [MySQL](https://dev.mysql.com/downloads/) (8.0+)
- [Node.js](https://nodejs.org/) (20+)
- [EF Core CLI tools](https://learn.microsoft.com/en-us/ef/core/cli/dotnet): `dotnet tool install --global dotnet-ef`

### 1. Set up MySQL

Start the MySQL service:

```bash
sudo service mysql start
```

Open the MySQL prompt:

```bash
sudo mysql
```

Create the database and a dedicated user:

```sql
CREATE DATABASE hireme;
CREATE USER 'hireme_admin'@'localhost' IDENTIFIED BY 'YourPasswordHere';
GRANT ALL PRIVILEGES ON hireme.* TO 'hireme_admin'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Verify the user can connect:

```bash
mysql -u hireme_admin -p
SHOW DATABASES;
EXIT;
```

You should see `hireme` in the database list.

### 2. Configure the backend

Navigate to the API project:

```bash
cd HireMe.API
```

Create an `appsettings.Development.json` file using the example as a template:

```bash
cp appsettings.Development.json.example appsettings.Development.json
```

Open `appsettings.Development.json` and fill in your values:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=hireme;User=hireme_admin;Password=YourPasswordHere;"
  },
  "Jwt": {
    "Key": "YourSuperSecretKeyThatIsAtLeast32CharsLong!",
    "Issuer": "HireMe",
    "Audience": "HireMe"
  }
}
```

The JWT key must be at least 32 characters. The Issuer and Audience can be any matching string.

### 3. Run database migrations

From the `HireMe.API` directory:

```bash
dotnet ef database update
```

This creates all the tables (Users, Jobs, JobInterests) in your MySQL database.

### 4. Run the API

```bash
dotnet run
```

The API will start on `http://localhost:5264` (or similar — check the terminal output). Visit `http://localhost:<port>/swagger` to explore and test the API endpoints.

### 5. Run the frontend

Navigate to the frontend directory:

```bash
cd hireme-client
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will start on `http://localhost:5173`. Make sure the backend is also running.

---

## API Endpoints

### Authentication (no token required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create a new account |
| POST | `/api/auth/login` | Log in and receive a JWT |

### Jobs (token required)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/jobs` | Any | List jobs (paginated, filterable) |
| GET | `/api/jobs/{id}` | Any | Get a single job |
| POST | `/api/jobs` | Poster | Create a job |
| PUT | `/api/jobs/{id}` | Poster + owner | Edit a job |
| DELETE | `/api/jobs/{id}` | Poster + owner | Delete a job |

### Interest (token required)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/jobs/{id}/interest` | Viewer | Toggle interest on a job |
| POST | `/api/jobs/{id}/interested` | Poster + owner | View interested users |

### Query Parameters for GET /api/jobs

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | int | 1 | Page number |
| pageSize | int | 10 | Items per page |
| search | string | null | Filter by title or body |

---

## Project Structure

```
hireme-client/
├── src/
│   ├── pages/              — Full page components (one per route)
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── JobListPage.tsx
│   │   ├── JobDetailPage.tsx
│   │   ├── CreateJobPage.tsx
│   │   └── EditJobPage.tsx
│   ├── components/         — Reusable UI components
│   │   ├── Navbar.tsx
│   │   ├── JobCard.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── SignalRListener.tsx
│   ├── services/           — API call functions
│   │   ├── api.ts
│   │   └── signalrService.ts
│   ├── context/            — React context (shared global state)
│   │   └── AuthContext.tsx
│   ├── App.tsx             — Routes + providers
│   └── main.tsx            — Entry point
├── index.html
└── vite.config.ts
```

```
HireMe.API/
├── Controllers/        — API endpoints
│   ├── AuthController.cs
│   ├── JobController.cs
│   └── InterestController.cs
├── Hubs/               — SignalR hubs
│   └── NotificationHub.cs
├── Models/             — EF Core entities
│   ├── User.cs
│   ├── Job.cs
│   └── JobInterest.cs
├── DTOs/               — Request/response objects
│   ├── RegisterRequest.cs
│   ├── LoginRequest.cs
│   ├── LoginResponse.cs
│   ├── CreateJobRequest.cs
│   ├── UpdateJobRequest.cs
│   ├── JobResponse.cs
│   ├── PagedResponse.cs
│   └── ServiceResult.cs
├── Services/           — Business logic
│   ├── IAuthService.cs
│   ├── AuthService.cs
│   ├── IJobService.cs
│   └── JobService.cs
├── Data/               — Database context
│   └── AppDbContext.cs
├── Program.cs          — App configuration
├── appsettings.json
└── appsettings.Development.json.example
```
