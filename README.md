# Smart Complaint Management System

A full-stack web application for Gram Panchayat Waregaon to manage civic complaints efficiently.

## Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS + Chart.js + React Router v6
- **Backend:** Java 17 + Spring Boot 3.2 + Spring Security + JWT (jjwt 0.12.3)
- **Database:** PostgreSQL (Production) / H2 (Development)
- **Deployment:** Docker Compose / Render

## Features

### Citizen
- Register/Login
- Create complaints with category, title, description, priority, and GPS location
- View and track complaint status with unique ID (WGR-YYYY-NNNNNN)
- Filter and search complaints by status
- View complaint timeline and status history
- Submit feedback (1-5 star rating + comment) on resolved complaints
- Receive in-app notifications
- Edit profile (name, phone, village, address)

### Admin
- Dashboard with Chart.js bar and doughnut charts (category & priority breakdown)
- Search and filter all complaints
- Assign complaints to workers with workload visibility
- View complaint timeline and audit log
- Monitor overdue complaints with SLA deadlines
- View worker list and statistics

### Worker
- View assigned complaints with Start Work / Mark Resolved buttons
- Worker-specific statistics (total assigned, in progress, completed, overdue)
- Add resolution remarks

### System Features
- Complaint ID format: WGR-YYYY-NNNNNN
- SLA deadlines: URGENT=24h, HIGH=3d, MEDIUM=5d, LOW=7d
- In-app notifications for status changes, assignments, and feedback
- Audit log tracking all complaint actions

## Complaint Status Flow

```
PENDING → ASSIGNED → IN_PROGRESS → RESOLVED → CLOSED
```

## Demo Credentials

| Role    | Email                      | Password    |
|---------|----------------------------|-------------|
| Admin   | admin@waregaon.gov.in      | admin123    |
| Worker  | ramesh@waregaon.gov.in     | worker123   |
| Citizen | priya@example.com          | citizen123  |

## Local Development

### Prerequisites
- Java 17
- Node.js 18+
- Docker (optional)

### Using Docker Compose (Recommended)

```bash
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:8080

### Manual Setup

#### Backend
```bash
cd backend
./mvnw spring-boot:run
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:8080

## Database Tables

- **users** - User accounts (Citizen, Admin, Worker) with village, address, avatar
- **complaints** - Complaint records with complaintId, priority, deadline, GPS coordinates
- **complaint_assignments** - Worker assignments
- **complaint_updates** - Status change history (timeline)
- **notifications** - In-app notifications
- **feedback** - Complaint feedback (1-5 stars + comment)
- **audit_logs** - Audit trail of all actions

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `PUT /api/auth/profile` - Update profile

### Profile
- `GET /api/profile` - Get current user profile
- `PUT /api/profile` - Update profile

### Complaints
- `POST /api/complaints` - Create complaint
- `GET /api/complaints/my` - Get my complaints
- `GET /api/complaints/{id}` - Get complaint by ID
- `GET /api/complaints/track/{complaintId}` - Track by complaint ID
- `GET /api/complaints/{id}/timeline` - Get complaint timeline
- `PUT /api/complaints/{id}/assign` - Assign worker
- `PUT /api/complaints/{id}/status` - Update status
- `POST /api/complaints/{id}/feedback` - Submit feedback

### Worker
- `GET /api/complaints/worker/my` - Get assigned complaints
- `GET /api/complaints/worker/stats` - Get worker statistics

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/{id}/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read

### Admin
- `GET /api/admin/dashboard` - Get dashboard stats
- `GET /api/admin/complaints` - Search/get all complaints
- `GET /api/admin/workers` - Get all workers
- `GET /api/admin/audit/{complaintId}` - Get audit log

## Project Structure

```
complaint_management_system/
├── backend/
│   ├── src/main/java/com/waregaon/complaint/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── entity/
│   │   ├── exception/
│   │   ├── repository/
│   │   ├── security/
│   │   └── service/
│   ├── src/main/resources/
│   ├── Dockerfile
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Deployment on Render

### Backend
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `cd backend && ./mvnw clean install`
4. Set start command: `cd backend && java -jar target/*.jar`
5. Add environment variables:
   - `SPRING_PROFILES_ACTIVE=production`
   - `SPRING_DATASOURCE_URL` (from Render PostgreSQL)
   - `SPRING_DATASOURCE_USERNAME`
   - `SPRING_DATASOURCE_PASSWORD`
   - `JWT_SECRET` (generate a secure secret)

### Frontend
1. Create a new Static Site on Render
2. Connect your GitHub repository
3. Set build command: `cd frontend && npm install && npm run build`
4. Set publish directory: `frontend/dist`
5. Add environment variable:
   - `VITE_API_URL` = Your backend URL + `/api`

### Database
1. Create a new PostgreSQL database on Render
2. Use the connection details for backend environment variables
