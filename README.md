# IssueForge

IssueForge is a full-stack software issue and QA defect tracker built with **React + TypeScript** and **Java + Spring Boot**.

It is designed as a portfolio project that demonstrates a realistic engineering workflow rather than a simple CRUD demo: developers and testers can record defects, assign severity and priority, capture reproduction steps and environment details, move issues through a lifecycle, and review dashboard metrics.

## Stack

### Frontend
- React
- TypeScript
- Vite
- TanStack Query
- Vitest
- React Testing Library

### Backend
- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA
- Jakarta Validation
- PostgreSQL
- H2 for automated tests
- JUnit 5 / MockMvc

### Engineering
- REST API
- Layered backend architecture
- DTO validation
- Search and filtering
- Docker / Docker Compose
- GitHub Actions CI
- Responsive UI

## Core features

- Create, edit, view, and delete issues
- Track status: Open, In Progress, Ready for Test, Resolved, Closed
- Track severity: Low, Medium, High, Critical
- Track priority: Low, Medium, High, Urgent
- Store environment and reproduction steps
- Search issues by title, component, or reporter
- Filter by status and severity
- Dashboard metrics
- PostgreSQL persistence
- API validation and error handling
- Automated frontend and backend tests

## Run with Docker

```bash
docker compose up --build
```

Then open:

- Frontend: http://localhost:5173
- Backend API: http://localhost:8080/api
- Health: http://localhost:8080/api/health

## Run locally

### Backend

Requirements: Java 21 and Maven.

```bash
cd backend
mvn spring-boot:run
```

The local profile uses H2 by default if `DATABASE_URL` is not provided.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Portfolio value

IssueForge demonstrates React component architecture, TypeScript, asynchronous server-state management, Java/Spring Boot API design, validation, relational data persistence, automated testing, containerization, and CI.

## Future improvements

- Authentication and role-based permissions
- Comments and activity history
- File attachments
- WebSocket live updates
- Sprint/milestone grouping
- GitHub issue synchronization
- End-to-end Playwright tests

## License

MIT
