# Wing Bank - Digital App Configuration Management System

A full-stack administration platform for managing digital app configurations, localization, user roles, and mobile API settings for Wing Bank (Cambodia).

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Running with Docker](#running-with-docker)
- [Running Locally](#running-locally)
- [Demo Credentials](#demo-credentials)
- [API Endpoints](#api-endpoints)
- [Frontend Pages](#frontend-pages)
- [Database Schema](#database-schema)
- [Modules](#modules)
- [Security](#security)
- [Theme & Branding](#theme--branding)
- [Configuration](#configuration)
- [Environment Variables](#environment-variables)

---

## Overview

This system provides a centralized admin panel for managing:

- **User Management** - CRUD operations with role assignment
- **Roles & Permissions** - Granular role-based access control (RBAC)
- **Countries** - Country configurations with dial codes and currencies
- **Translations** - Multi-language support (English/Khmer) for mobile apps
- **API Messages** - Centralized error/success message management
- **Notification Templates** - Push/SMS/Email notification template management
- **Global Configs** - App versioning, feature flags, maintenance mode
- **Audit Logs** - Complete audit trail of all admin actions
- **Mobile API** - Aggregated config endpoint for mobile apps with Redis caching

---

## Tech Stack

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Java | 21 | Programming Language |
| Spring Boot | 3.2.5 | Application Framework |
| Spring Security | 6.x | Authentication & Authorization |
| Spring Data JPA | 3.x | Database ORM |
| Spring Data Redis | 3.x | Caching Layer |
| PostgreSQL | 16 | Relational Database |
| Redis | 7 | Cache Store |
| Flyway | 9.x | Database Migrations |
| JJWT | 0.12.3 | JWT Token Management |
| SpringDoc OpenAPI | 2.3.0 | API Documentation (Swagger) |
| Lombok | Latest | Boilerplate Reduction |
| Maven | 3.9 | Build Tool |

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI Framework |
| TypeScript | 5.9 | Type-safe JavaScript |
| Vite | 7.3 | Build Tool & Dev Server |
| Tailwind CSS | 4.x | Utility-first CSS Framework |
| React Router | 7.x | Client-side Routing |
| TanStack React Query | 5.x | Server State Management |
| Axios | 1.x | HTTP Client |
| Lucide React | 0.564 | Icon Library |
| React Hot Toast | 2.x | Toast Notifications |
| ESLint | 9.x | Code Linting |

### Infrastructure

| Technology | Version | Purpose |
|---|---|---|
| Docker | 29+ | Containerization |
| Docker Compose | 5+ | Multi-container Orchestration |

---

## Architecture

```
┌─────────────────────┐     ┌──────────────────────────────────┐
│                     │     │         Spring Boot API           │
│   React Admin UI    │────▶│                                  │
│   (Port 3000)       │     │  ┌────────────┐ ┌─────────────┐ │
│                     │     │  │ Controllers │ │  Security   │ │
│  - Vite + TS        │     │  │  (REST)     │ │  (JWT)      │ │
│  - Tailwind CSS     │     │  └──────┬─────┘ └─────────────┘ │
│  - React Query      │     │         │                        │
│  - Axios            │     │  ┌──────▼─────┐ ┌─────────────┐ │
└─────────────────────┘     │  │  Services   │ │  Flyway     │ │
                            │  │  (Business) │ │  Migrations │ │
┌─────────────────────┐     │  └──────┬─────┘ └─────────────┘ │
│                     │     │         │                        │
│   Mobile Apps       │────▶│  ┌──────▼─────┐                 │
│   (iOS/Android)     │     │  │ Repositories│                 │
│                     │     │  │  (JPA)      │                 │
└─────────────────────┘     │  └──────┬─────┘                 │
                            │         │                        │
                            └─────────┼────────────────────────┘
                                      │
                            ┌─────────▼──────────┐  ┌─────────┐
                            │   PostgreSQL 16    │  │ Redis 7 │
                            │   (Port 5432)      │  │ (6379)  │
                            └────────────────────┘  └─────────┘
```

---

## Project Structure

```
digital-app-configurations/
├── docker-compose.yml                    # Docker orchestration
├── README.md
│
├── java-backend-api/                     # Spring Boot Backend
│   ├── Dockerfile                        # Multi-stage Docker build
│   ├── pom.xml                           # Maven dependencies
│   └── src/main/
│       ├── java/com/wingbank/config/
│       │   ├── WingBankConfigApplication.java
│       │   │
│       │   ├── common/                   # Shared infrastructure
│       │   │   ├── audit/
│       │   │   │   └── AuditEntity.java          # Base entity (UUID, timestamps, soft delete)
│       │   │   ├── config/
│       │   │   │   ├── CorsConfig.java            # CORS configuration
│       │   │   │   ├── RedisConfig.java            # Redis cache config
│       │   │   │   └── SwaggerConfig.java          # OpenAPI/Swagger config
│       │   │   ├── dto/
│       │   │   │   ├── ApiResponse.java            # Standard API response wrapper
│       │   │   │   └── PagedResponse.java          # Paginated response wrapper
│       │   │   ├── exception/
│       │   │   │   ├── BadRequestException.java
│       │   │   │   ├── GlobalExceptionHandler.java # @ControllerAdvice
│       │   │   │   ├── ResourceNotFoundException.java
│       │   │   │   └── UnauthorizedException.java
│       │   │   └── util/
│       │   │       └── AppConstants.java
│       │   │
│       │   ├── security/                 # JWT Authentication
│       │   │   ├── config/
│       │   │   │   └── SecurityConfig.java         # Security filter chain
│       │   │   ├── jwt/
│       │   │   │   ├── JwtAuthenticationEntryPoint.java
│       │   │   │   ├── JwtAuthenticationFilter.java  # Bearer token filter
│       │   │   │   └── JwtTokenProvider.java         # Token generation/validation
│       │   │   ├── service/
│       │   │   │   └── CustomUserDetailsService.java
│       │   │   └── dto/
│       │   │       ├── LoginRequest.java
│       │   │       ├── LoginResponse.java
│       │   │       └── RefreshTokenRequest.java
│       │   │
│       │   ├── auth/controller/          # Auth endpoints
│       │   │   └── AuthController.java             # login, refresh token
│       │   │
│       │   ├── user/                     # User module
│       │   │   ├── entity/User.java
│       │   │   ├── repository/UserRepository.java
│       │   │   ├── service/UserService.java
│       │   │   ├── service/impl/UserServiceImpl.java
│       │   │   ├── controller/UserController.java
│       │   │   └── dto/
│       │   │       ├── UserRequest.java
│       │   │       ├── UserResponse.java
│       │   │       └── UserRoleAssignRequest.java
│       │   │
│       │   ├── role/                     # Role & Permission module
│       │   │   ├── entity/Role.java
│       │   │   ├── entity/Permission.java
│       │   │   ├── repository/RoleRepository.java
│       │   │   ├── repository/PermissionRepository.java
│       │   │   ├── service/RoleService.java
│       │   │   ├── service/impl/RoleServiceImpl.java
│       │   │   ├── service/PermissionService.java
│       │   │   ├── service/impl/PermissionServiceImpl.java
│       │   │   ├── controller/RoleController.java
│       │   │   ├── controller/PermissionController.java
│       │   │   └── dto/
│       │   │       ├── RoleRequest.java
│       │   │       ├── RoleResponse.java
│       │   │       ├── PermissionRequest.java
│       │   │       └── PermissionResponse.java
│       │   │
│       │   ├── country/                  # Country module
│       │   │   ├── entity/Country.java
│       │   │   ├── repository/CountryRepository.java
│       │   │   ├── service/CountryService.java
│       │   │   ├── service/impl/CountryServiceImpl.java
│       │   │   ├── controller/CountryController.java
│       │   │   └── dto/
│       │   │       ├── CountryRequest.java
│       │   │       └── CountryResponse.java
│       │   │
│       │   ├── translation/              # Translation module
│       │   │   ├── entity/Translation.java
│       │   │   ├── repository/TranslationRepository.java
│       │   │   ├── service/TranslationService.java
│       │   │   ├── service/impl/TranslationServiceImpl.java
│       │   │   ├── controller/TranslationController.java
│       │   │   ├── controller/MobileTranslationController.java
│       │   │   └── dto/
│       │   │       ├── TranslationRequest.java
│       │   │       └── TranslationResponse.java
│       │   │
│       │   ├── message/                  # API Messages module
│       │   │   ├── entity/ApiMessage.java
│       │   │   ├── repository/ApiMessageRepository.java
│       │   │   ├── service/ApiMessageService.java
│       │   │   ├── service/impl/ApiMessageServiceImpl.java
│       │   │   ├── controller/ApiMessageController.java
│       │   │   └── dto/
│       │   │       ├── ApiMessageRequest.java
│       │   │       └── ApiMessageResponse.java
│       │   │
│       │   ├── notification/             # Notification Templates module
│       │   │   ├── entity/NotificationTemplate.java
│       │   │   ├── repository/NotificationTemplateRepository.java
│       │   │   ├── service/NotificationTemplateService.java
│       │   │   ├── service/impl/NotificationTemplateServiceImpl.java
│       │   │   ├── controller/NotificationTemplateController.java
│       │   │   └── dto/
│       │   │       ├── NotificationTemplateRequest.java
│       │   │       └── NotificationTemplateResponse.java
│       │   │
│       │   ├── globalconfig/             # Global Config module
│       │   │   ├── entity/GlobalConfig.java
│       │   │   ├── repository/GlobalConfigRepository.java
│       │   │   ├── service/GlobalConfigService.java
│       │   │   ├── service/impl/GlobalConfigServiceImpl.java
│       │   │   ├── controller/GlobalConfigController.java
│       │   │   └── dto/
│       │   │       ├── GlobalConfigRequest.java
│       │   │       └── GlobalConfigResponse.java
│       │   │
│       │   ├── audit/                    # Audit Log module
│       │   │   ├── entity/AuditLog.java
│       │   │   ├── repository/AuditLogRepository.java
│       │   │   ├── service/AuditLogService.java
│       │   │   ├── service/impl/AuditLogServiceImpl.java
│       │   │   └── controller/AuditLogController.java
│       │   │
│       │   └── mobile/                   # Mobile API module
│       │       ├── controller/MobileConfigController.java
│       │       └── dto/MobileConfigResponse.java
│       │
│       └── resources/
│           ├── application.yml                     # App configuration
│           └── db/migration/
│               ├── V1__init_schema.sql             # Database schema
│               └── V2__seed_data.sql               # Initial seed data
│
└── react-ui/                             # React Frontend
    ├── package.json                      # NPM dependencies
    ├── vite.config.ts                    # Vite configuration
    ├── tsconfig.json                     # TypeScript base config
    ├── tsconfig.app.json                 # TypeScript app config
    ├── tsconfig.node.json                # TypeScript node config
    ├── eslint.config.js                  # ESLint configuration
    ├── index.html                        # HTML entry point
    └── src/
        ├── main.tsx                      # App entry point
        ├── App.tsx                       # Root component (providers)
        ├── index.css                     # Tailwind + Wing Bank theme
        │
        ├── api/                          # API client layer
        │   ├── axios.ts                  # Axios instance + interceptors
        │   ├── auth.api.ts
        │   ├── users.api.ts
        │   ├── roles.api.ts
        │   ├── permissions.api.ts
        │   ├── countries.api.ts
        │   ├── translations.api.ts
        │   ├── messages.api.ts
        │   ├── notifications.api.ts
        │   ├── globalConfigs.api.ts
        │   └── auditLogs.api.ts
        │
        ├── types/                        # TypeScript type definitions
        │   ├── api.types.ts
        │   ├── auth.types.ts
        │   ├── user.types.ts
        │   ├── role.types.ts
        │   ├── country.types.ts
        │   ├── translation.types.ts
        │   ├── message.types.ts
        │   ├── notification.types.ts
        │   ├── globalConfig.types.ts
        │   └── auditLog.types.ts
        │
        ├── context/
        │   └── AuthContext.tsx            # Auth state + token management
        │
        ├── hooks/
        │   ├── useAuth.ts                # Auth hook
        │   └── useDebounce.ts            # Debounce hook
        │
        ├── components/
        │   ├── layout/
        │   │   ├── MainLayout.tsx         # Layout with sidebar + header
        │   │   ├── Sidebar.tsx            # Navigation sidebar
        │   │   └── Header.tsx             # Top header bar
        │   ├── common/
        │   │   ├── DataTable.tsx           # Reusable data table
        │   │   ├── Modal.tsx               # Modal dialog
        │   │   ├── ConfirmDialog.tsx        # Delete confirmation
        │   │   ├── SearchFilter.tsx         # Search + filter bar
        │   │   ├── PageHeader.tsx           # Page title + actions
        │   │   ├── StatusBadge.tsx          # Status indicator
        │   │   └── LoadingSpinner.tsx       # Loading state
        │   └── forms/
        │       ├── InputField.tsx           # Text input
        │       ├── SelectField.tsx          # Select dropdown
        │       └── TextAreaField.tsx         # Textarea
        │
        ├── pages/
        │   ├── auth/
        │   │   └── LoginPage.tsx           # Login page
        │   ├── dashboard/
        │   │   └── DashboardPage.tsx        # Dashboard
        │   ├── users/
        │   │   ├── UserListPage.tsx         # User list + CRUD
        │   │   └── UserFormModal.tsx         # User form modal
        │   ├── roles/
        │   │   ├── RoleListPage.tsx
        │   │   └── RoleFormModal.tsx
        │   ├── permissions/
        │   │   ├── PermissionListPage.tsx
        │   │   └── PermissionFormModal.tsx
        │   ├── countries/
        │   │   ├── CountryListPage.tsx
        │   │   └── CountryFormModal.tsx
        │   ├── translations/
        │   │   ├── TranslationListPage.tsx
        │   │   └── TranslationFormModal.tsx
        │   ├── messages/
        │   │   ├── MessageListPage.tsx
        │   │   └── MessageFormModal.tsx
        │   ├── notifications/
        │   │   ├── NotificationListPage.tsx
        │   │   └── NotificationFormModal.tsx
        │   ├── globalConfigs/
        │   │   ├── GlobalConfigListPage.tsx
        │   │   └── GlobalConfigFormModal.tsx
        │   └── audit/
        │       └── AuditLogPage.tsx         # Audit logs (read-only)
        │
        └── routes/
            ├── AppRoutes.tsx               # Route definitions
            └── ProtectedRoute.tsx          # Auth guard
```

---

## Prerequisites

- **Docker** >= 29.x and **Docker Compose** >= 5.x
- **Node.js** >= 18.x and **npm** >= 9.x (for frontend development)
- **Java** 21 and **Maven** 3.9+ (only if running backend without Docker)

---

## Getting Started

### Running with Docker

The easiest way to get the full backend stack running:

```bash
# Clone the repository
git clone <repository-url>
cd digital-app-configurations

# Start all services (PostgreSQL, Redis, Backend API)
docker compose up -d

# Check all containers are running
docker compose ps

# View backend logs
docker logs wingbank-backend -f
```

This will start:
| Service | Container | Port |
|---|---|---|
| PostgreSQL 16 | wingbank-postgres | 5432 |
| Redis 7 | wingbank-redis | 6379 |
| Spring Boot API | wingbank-backend | 9090 |

Flyway migrations run automatically on startup, creating all tables and seeding initial data.

### Running the Frontend

```bash
# Navigate to the React project
cd react-ui

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend dev server starts on **http://localhost:3000** with a proxy to the backend API at `http://localhost:9090`.

### Production Build (Frontend)

```bash
cd react-ui
npm run build     # Outputs to dist/
npm run preview   # Preview the production build
```

---

### Running Locally (Without Docker)

If you prefer to run the backend outside Docker:

1. Install Java 21 and Maven 3.9+
2. Start PostgreSQL on port 5432 with database `wingbank_config`
3. Start Redis on port 6379
4. Run the backend:

```bash
cd java-backend-api
mvn spring-boot:run
```

The backend will start on **http://localhost:8080**.

Update the Vite proxy in `react-ui/vite.config.ts` if needed:

```ts
proxy: {
  '/api': {
    target: 'http://localhost:8080',
    changeOrigin: true,
  },
},
```

---

## Demo Credentials

| Field | Value |
|---|---|
| Email | `admin@mail.com` |
| Password | `password` |
| Role | SUPER_ADMIN |
| Permissions | All (33 permissions) |

---

## API Endpoints

### Authentication (Public)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Login with email/password |
| POST | `/api/auth/refresh` | Refresh access token |

### Users (Protected)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users` | List users (paginated) |
| GET | `/api/users/{id}` | Get user by ID |
| POST | `/api/users` | Create user |
| PUT | `/api/users/{id}` | Update user |
| DELETE | `/api/users/{id}` | Soft delete user |
| PUT | `/api/users/{id}/roles` | Assign roles to user |

### Roles (Protected)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/roles` | List roles (paginated) |
| GET | `/api/roles/{id}` | Get role by ID |
| POST | `/api/roles` | Create role |
| PUT | `/api/roles/{id}` | Update role |
| DELETE | `/api/roles/{id}` | Soft delete role |

### Permissions (Protected)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/permissions` | List permissions (paginated) |
| GET | `/api/permissions/{id}` | Get permission by ID |
| POST | `/api/permissions` | Create permission |
| PUT | `/api/permissions/{id}` | Update permission |
| DELETE | `/api/permissions/{id}` | Soft delete permission |

### Countries (Protected)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/countries` | List countries (paginated) |
| GET | `/api/countries/{id}` | Get country by ID |
| POST | `/api/countries` | Create country |
| PUT | `/api/countries/{id}` | Update country |
| DELETE | `/api/countries/{id}` | Soft delete country |

### Translations (Protected)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/translations` | List translations (paginated) |
| GET | `/api/translations/{id}` | Get translation by ID |
| POST | `/api/translations` | Create translation |
| PUT | `/api/translations/{id}` | Update translation |
| DELETE | `/api/translations/{id}` | Soft delete translation |

### API Messages (Protected)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/messages` | List API messages (paginated) |
| GET | `/api/messages/{id}` | Get message by ID |
| POST | `/api/messages` | Create message |
| PUT | `/api/messages/{id}` | Update message |
| DELETE | `/api/messages/{id}` | Soft delete message |

### Notification Templates (Protected)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/notifications` | List templates (paginated) |
| GET | `/api/notifications/{id}` | Get template by ID |
| POST | `/api/notifications` | Create template |
| PUT | `/api/notifications/{id}` | Update template |
| DELETE | `/api/notifications/{id}` | Soft delete template |

### Global Configs (Protected)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/global-configs` | List configs (paginated) |
| GET | `/api/global-configs/{id}` | Get config by ID |
| POST | `/api/global-configs` | Create config |
| PUT | `/api/global-configs/{id}` | Update config |
| DELETE | `/api/global-configs/{id}` | Soft delete config |

### Audit Logs (Protected)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/audit-logs` | List audit logs (paginated, read-only) |

### Mobile API (Public)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/mobile/config` | Aggregated mobile config (cached via Redis) |
| GET | `/api/mobile/translations` | Mobile translations |

### API Documentation

| Method | Endpoint | Description |
|---|---|---|
| GET | `/swagger-ui.html` | Swagger UI |
| GET | `/v3/api-docs` | OpenAPI 3.0 JSON spec |

### Standard API Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Operation completed successfully",
  "data": { ... },
  "timestamp": "2026-02-16T05:21:01.399Z"
}
```

Paginated responses include:

```json
{
  "success": true,
  "data": {
    "content": [ ... ],
    "page": 0,
    "size": 20,
    "totalElements": 100,
    "totalPages": 5,
    "last": false
  }
}
```

---

## Frontend Pages

| Route | Page | Description |
|---|---|---|
| `/login` | Login Page | Authentication with email/password |
| `/dashboard` | Dashboard | Overview statistics and quick actions |
| `/users` | User Management | CRUD with role assignment |
| `/roles` | Role Management | CRUD with permission assignment |
| `/permissions` | Permission Management | CRUD operations |
| `/countries` | Country Management | CRUD with dial codes, currencies |
| `/translations` | Translation Management | English/Khmer translations |
| `/messages` | API Messages | Error/success message management |
| `/notifications` | Notification Templates | Push/SMS/Email templates |
| `/global-configs` | Global Configuration | App versions, feature flags |
| `/audit-logs` | Audit Logs | Read-only audit trail |

---

## Database Schema

### Tables (11)

| Table | Description | Soft Delete |
|---|---|---|
| `users` | Admin users with email, password, status | Yes |
| `roles` | Role definitions (SUPER_ADMIN, ADMIN, VIEWER) | Yes |
| `permissions` | Granular permissions per module | Yes |
| `user_roles` | Many-to-many: users to roles | No |
| `role_permissions` | Many-to-many: roles to permissions | No |
| `countries` | Country data with codes, currencies | Yes |
| `translations` | i18n key-value pairs (EN/KM) | Yes |
| `api_messages` | API error/success messages | Yes |
| `notification_templates` | Notification templates (Push/SMS/Email) | Yes |
| `global_configs` | App configuration key-value pairs | Yes |
| `audit_logs` | Immutable audit trail | No |

### Entity Relationship

```
users ──── user_roles ──── roles ──── role_permissions ──── permissions
  │                          │
  │                          └── name: SUPER_ADMIN, ADMIN, VIEWER
  │
  └── status: ACTIVE, INACTIVE, LOCKED
      failed_login_attempts, locked_until

countries ── code (KH, US, TH, VN, SG), dial_code, currency
translations ── key, en_value, km_value, module, platform
api_messages ── error_code, en_message, km_message, type, http_status
notification_templates ── code, title_en/km, body_en/km, type (PUSH/SMS/EMAIL)
global_configs ── config_key, config_value, platform (ALL/ANDROID/IOS)
audit_logs ── user_id, action, entity_type, old_value (JSONB), new_value (JSONB)
```

### Seed Data (V2 Migration)

- **1 Admin User** - admin@mail.com (SUPER_ADMIN)
- **3 Roles** - SUPER_ADMIN, ADMIN, VIEWER
- **33 Permissions** - CRUD for all 9 modules (e.g., USER_VIEW, USER_CREATE, etc.)
- **5 Countries** - Cambodia, United States, Thailand, Vietnam, Singapore
- **4 Translations** - Sample EN/KM translations
- **5 API Messages** - SUCCESS_001, ERROR_001 through ERROR_004
- **4 Global Configs** - app.min_version, app.maintenance_mode, app.force_update

---

## Modules

### 1. Authentication

- JWT-based stateless authentication (access + refresh tokens)
- Access token expiry: 30 minutes
- Refresh token expiry: 7 days
- Token rotation on refresh
- Account lockout after 5 failed login attempts (30-minute lock)

### 2. User Management

- CRUD operations with pagination and search
- Role assignment (many-to-many)
- Status management: ACTIVE, INACTIVE, LOCKED
- Soft delete pattern

### 3. Roles & Permissions

- Role-based access control (RBAC)
- Granular permissions per module (VIEW, CREATE, UPDATE, DELETE)
- Permission assignment to roles (many-to-many)
- `@PreAuthorize` annotations on all controller endpoints
- 9 modules x 3-4 permissions = 33 total permissions

### 4. Countries

- Country management with ISO codes, dial codes, currencies
- Status toggle (ACTIVE/INACTIVE)

### 5. Translations

- Multi-language support (English and Khmer)
- Key-value pairs organized by module and platform
- Versioned translations
- Mobile-specific endpoint for bulk translation fetching

### 6. API Messages

- Centralized error and success messages
- Bilingual (EN/KM) message content
- Mapped to HTTP status codes
- Types: SUCCESS, ERROR, WARNING, INFO

### 7. Notification Templates

- Push, SMS, and Email notification templates
- Bilingual title and body content
- Status management (ACTIVE/INACTIVE)

### 8. Global Configuration

- Key-value configuration pairs
- Platform-specific configs (ALL, ANDROID, IOS)
- Feature flags and app versioning
- Maintenance mode toggle

### 9. Audit Logs

- Immutable audit trail of all admin actions
- Stores old/new values as JSONB
- Tracks user, IP address, user agent
- Read-only (no update/delete operations)

### 10. Mobile API

- Aggregated config endpoint (`/api/mobile/config`)
- Combines translations, countries, global configs, API messages, feature flags
- Redis caching for performance
- Public endpoint (no authentication required)

---

## Security

### Authentication Flow

```
1. POST /api/auth/login (email + password)
      │
      ▼
2. Validate credentials (BCrypt comparison)
      │
      ├── Fail → Increment failed_login_attempts
      │          (Lock account after 5 attempts for 30 min)
      │
      └── Success → Generate JWT tokens
                     Reset failed_login_attempts
                     Return { accessToken, refreshToken, user }
      │
      ▼
3. Client stores tokens in localStorage
      │
      ▼
4. Subsequent requests include: Authorization: Bearer <accessToken>
      │
      ▼
5. JwtAuthenticationFilter validates token on each request
      │
      ▼
6. On 401 → Auto-refresh using refreshToken
             If refresh fails → Redirect to /login
```

### Public Endpoints (No Auth Required)

- `POST /api/auth/**` - Authentication
- `GET /api/mobile/**` - Mobile configuration
- `GET /swagger-ui/**` - API documentation
- `GET /v3/api-docs/**` - OpenAPI spec
- `GET /actuator/**` - Health checks

### Protected Endpoints

All other endpoints require a valid JWT token and specific permissions:

| Permission | Module | Actions |
|---|---|---|
| `USER_VIEW`, `USER_CREATE`, `USER_UPDATE`, `USER_DELETE` | Users | CRUD |
| `ROLE_VIEW`, `ROLE_CREATE`, `ROLE_UPDATE`, `ROLE_DELETE` | Roles | CRUD |
| `PERMISSION_VIEW`, `PERMISSION_CREATE`, `PERMISSION_UPDATE`, `PERMISSION_DELETE` | Permissions | CRUD |
| `COUNTRY_VIEW`, `COUNTRY_CREATE`, `COUNTRY_UPDATE`, `COUNTRY_DELETE` | Countries | CRUD |
| `TRANSLATION_VIEW`, `TRANSLATION_CREATE`, `TRANSLATION_UPDATE`, `TRANSLATION_DELETE` | Translations | CRUD |
| `MESSAGE_VIEW`, `MESSAGE_CREATE`, `MESSAGE_UPDATE`, `MESSAGE_DELETE` | Messages | CRUD |
| `NOTIFICATION_VIEW`, `NOTIFICATION_CREATE`, `NOTIFICATION_UPDATE`, `NOTIFICATION_DELETE` | Notifications | CRUD |
| `CONFIG_VIEW`, `CONFIG_CREATE`, `CONFIG_UPDATE`, `CONFIG_DELETE` | Global Config | CRUD |
| `AUDIT_VIEW` | Audit Logs | Read-only |

### Password Hashing

- Algorithm: BCrypt with cost factor 10
- Managed via Spring Security's `BCryptPasswordEncoder`

---

## Theme & Branding

Wing Bank theme colors defined in Tailwind CSS:

| Token | Color | Hex | Usage |
|---|---|---|---|
| `wing-primary` | Green | `#00A651` | Primary actions, success states |
| `wing-primary-dark` | Dark Green | `#008C44` | Hover states |
| `wing-primary-light` | Light Green | `#33B873` | Highlights |
| `wing-secondary` | Navy Blue | `#003A70` | Sidebar, headers, branding |
| `wing-secondary-dark` | Dark Navy | `#002D59` | Hover states |
| `wing-secondary-light` | Light Navy | `#004D94` | Highlights |
| `wing-accent` | Gold | `#FDB913` | Accent elements, warnings |
| `wing-accent-dark` | Dark Gold | `#E5A50F` | Hover states |
| `wing-bg` | Light Gray | `#F0F2F5` | Page background |
| `wing-card` | White | `#FFFFFF` | Card backgrounds |
| `wing-text` | Dark | `#1A1A2E` | Primary text |
| `wing-text-light` | Gray | `#6B7280` | Secondary text |
| `wing-border` | Border Gray | `#E5E7EB` | Borders |
| `wing-success` | Green | `#10B981` | Success indicators |
| `wing-danger` | Red | `#EF4444` | Error/delete actions |
| `wing-warning` | Amber | `#F59E0B` | Warning indicators |
| `wing-info` | Blue | `#3B82F6` | Info/links |

---

## Configuration

### Backend Configuration (`application.yml`)

```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/wingbank_config
    username: postgres
    password: postgres
  jpa:
    hibernate.ddl-auto: validate
  flyway:
    enabled: true
  data:
    redis:
      host: localhost
      port: 6379

app:
  jwt:
    secret: <256-bit-secret-key>
    access-token-expiration: 1800000    # 30 minutes
    refresh-token-expiration: 604800000 # 7 days
  security:
    max-login-attempts: 5
    lock-duration-minutes: 30
```

### Frontend Configuration (`vite.config.ts`)

```typescript
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:9090',
        changeOrigin: true,
      },
    },
  },
});
```

---

## Environment Variables

When running with Docker Compose, the following environment variables are configured:

### PostgreSQL

| Variable | Default | Description |
|---|---|---|
| `POSTGRES_DB` | `wingbank_config` | Database name |
| `POSTGRES_USER` | `postgres` | Database user |
| `POSTGRES_PASSWORD` | `postgres` | Database password |

### Backend (Spring Boot)

| Variable | Default | Description |
|---|---|---|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://postgres:5432/wingbank_config` | DB connection URL |
| `SPRING_DATASOURCE_USERNAME` | `postgres` | DB username |
| `SPRING_DATASOURCE_PASSWORD` | `postgres` | DB password |
| `SPRING_DATA_REDIS_HOST` | `redis` | Redis hostname |
| `SPRING_DATA_REDIS_PORT` | `6379` | Redis port |

---

## Docker Commands

```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# Rebuild backend after code changes
docker compose up -d --build backend

# View backend logs
docker logs wingbank-backend -f

# View PostgreSQL logs
docker logs wingbank-postgres -f

# Access PostgreSQL CLI
docker exec -it wingbank-postgres psql -U postgres -d wingbank_config

# Reset database (remove volume)
docker compose down -v
docker compose up -d

# Check service status
docker compose ps
```

---

## Ports Summary

| Service | Port | Description |
|---|---|---|
| React Dev Server | 3000 | Frontend (Vite) |
| Spring Boot API | 9090 | Backend (Docker mapped) |
| Spring Boot API | 8080 | Backend (internal/local) |
| PostgreSQL | 5432 | Database |
| Redis | 6379 | Cache |

---

## License

Copyright Wing Bank Technology. All rights reserved.
