# XClone

A serious, production-grade, real-time social media platform inspired by X (formerly Twitter), built with a **modular monolith architecture** using **Java 21**, **Spring Boot 3.4+**, **PostgreSQL**, **Redis**, and **React**.

---

## 📌 Main Objective

The primary objective of this project is to build an enterprise-quality social media backend from the ground up to deeply master:
- Modern Spring Boot backend engineering & clean code patterns.
- Relational database schema design, indexing, and transactional boundaries.
- Redis caching strategies and real-time STOMP/WebSocket communication.
- Strict API design principles with standard response envelopes and global error handling.
- Step-by-step feature development where every endpoint is rigorously tested in Postman before frontend integration.

---

## 🚦 Project Status

To ensure complete transparency and maintainability, feature progress is strictly tracked:

### ✅ Completed
- [x] Project architecture & repository initialization
- [x] Java 21 & Spring Boot 3.4.x Maven configuration
- [x] Modular package layout (`com.xclone.*`)
- [x] Application profile configurations (`dev`, `prod`, `test`)
- [x] PostgreSQL & Redis Docker Compose infrastructure
- [x] Global Exception Handling & standard response DTOs (`ApiResponse`, `ErrorResponse`, `ValidationError`)
- [x] Web CORS configuration for frontend clients
- [x] Redis template serializer configuration
- [x] Health check endpoints (`/api/v1/health` and `/actuator/health`)
- [x] Unit and slice test suite with MockMvc and H2 in-memory test database
- [x] Postman environment and collection setup

### 🚧 In Progress
- [ ] *None (Foundation Stage Complete — ready for Stage 2: Authentication & User Domain)*

### 📋 Planned (Step-by-Step Roadmap)
- [ ] **Stage 2**: User Domain & Authentication (Registration, Password Hashing with BCrypt, JWT Access/Refresh tokens)
- [ ] **Stage 3**: User Profiles & Account Management (Bio, Avatars, Handles, Profile updates)
- [ ] **Stage 4**: Post Creation & Media Engine (Tweets, Threads, Cloudinary/S3 image uploads)
- [ ] **Stage 5**: Social Graph & Interactions (Follow/Unfollow, Likes, Bookmarks, Retweets/Quotes)
- [ ] **Stage 6**: Comments & Nested Discussions (Reply trees, pagination)
- [ ] **Stage 7**: Feed Generation & Caching (Chronological 'Following' feed, Redis fan-out / timeline caching)
- [ ] **Stage 8**: Real-time Notifications & STOMP WebSockets (Likes, mentions, follows)
- [ ] **Stage 9**: Direct Messaging / Real-Time Chat (1-on-1 private messaging via WebSocket & Redis Pub/Sub)
- [ ] **Stage 10**: Search & Discovery (Hashtag indexing, user discovery)
- [ ] **Stage 11**: Frontend Single Page App (React + TypeScript + Vite + TanStack Query)

---

## 🛠 Technology Stack

### Backend
- **Language**: Java 21 (LTS)
- **Framework**: Spring Boot 3.4.x
- **Web Layer**: Spring Web (RESTful APIs)
- **Persistence**: Spring Data JPA & Hibernate
- **Validation**: Jakarta Bean Validation (`spring-boot-starter-validation`)
- **Security**: Spring Security & JWT (Planned)
- **Real-Time**: Spring WebSocket with STOMP protocol (Planned)
- **Observability**: Spring Boot Actuator

### Database & Caching
- **Primary Database**: PostgreSQL 16
- **Caching & Pub/Sub**: Redis 7

### Testing Suite
- **Unit & Slice Tests**: JUnit 5, Mockito, Spring Boot Test (`@WebMvcTest`)
- **In-Memory Testing DB**: H2 Database
- **Integration Tests**: Testcontainers (Planned)

### Frontend (Upcoming)
- React, TypeScript, Vite, React Router, Axios, TanStack Query

### DevOps & Tooling
- Git & GitHub
- Docker & Docker Compose
- Postman (API Testing & Verification)

### Media & Storage
- Cloudinary / S3-compatible Object Storage (Planned)

> **Note on Architecture Evolution**: Kafka, Kubernetes, Elasticsearch, and microservices decomposition are intentionally omitted at this stage. They will only be introduced when scaling requirements justify the engineering complexity.

---

## 🏗 Architecture & Package Structure

The backend follows a clean **Modular Monolith** architecture with clear separation of concerns:

```
twit/
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore definitions
├── docker-compose.yml               # PostgreSQL & Redis container stack
├── README.md                        # Project documentation
├── postman/                         # API testing collections
│   ├── XClone_API_Collection.json
│   └── XClone_Environment.json
└── backend/
    ├── pom.xml                      # Maven build descriptor
    └── src/
        ├── main/
        │   ├── java/com/xclone/
        │   │   ├── XCloneApplication.java
        │   │   ├── auth/            # Auth, JWT, Login, Register (Planned)
        │   │   ├── user/            # User entity & account management (Planned)
        │   │   ├── profile/         # User profile & avatar (Planned)
        │   │   ├── post/            # Posts, Tweets, Retweets (Planned)
        │   │   ├── comment/         # Comments & replies (Planned)
        │   │   ├── like/            # Likes on posts (Planned)
        │   │   ├── follow/          # Follower/Following graph (Planned)
        │   │   ├── bookmark/        # Saved tweets (Planned)
        │   │   ├── feed/            # Timeline & feed generation (Planned)
        │   │   ├── notification/    # Notifications & alerts (Planned)
        │   │   ├── chat/            # 1-on-1 Direct messages (Planned)
        │   │   ├── search/          # Search & discovery (Planned)
        │   │   ├── media/           # Cloudinary/S3 media uploads (Planned)
        │   │   ├── websocket/       # STOMP real-time handlers (Planned)
        │   │   ├── security/        # Security config & filters (Planned)
        │   │   ├── config/          # CORS, Redis, WebMvc configuration
        │   │   ├── common/          # Shared DTOs, Exceptions & Handlers
        │   │   │   ├── dto/         # ApiResponse, ErrorResponse, ValidationError
        │   │   │   └── exception/   # AppException, ResourceNotFoundException, GlobalExceptionHandler
        │   │   └── health/          # Health check endpoint controller
        │   └── resources/
        │       ├── application.yml
        │       ├── application-dev.yml
        │       └── application-prod.yml
        └── test/
            ├── java/com/xclone/
            │   ├── common/exception/GlobalExceptionHandlerTest.java
            │   └── health/HealthControllerTest.java
            └── resources/
                └── application-test.yml
```

---

## 🧪 API Verification via Postman

As part of our strict **Backend-First Philosophy**, every API endpoint must be designed, documented, implemented, and verified in **Postman** before any frontend UI integration begins.

### Postman Setup:
1. Import `postman/XClone_API_Collection.json` into Postman.
2. Import `postman/XClone_Environment.json` and select the **XClone - Local Dev** environment.
3. Test the initial endpoint:
   - `GET {{baseUrl}}/api/v1/health`
4. Expected 200 OK Response:
```json
{
  "success": true,
  "message": "XClone backend service is running",
  "data": {
    "status": "UP",
    "service": "xclone-backend",
    "version": "0.0.1-SNAPSHOT",
    "serverTime": "2026-09-23T07:18:01.000Z"
  },
  "timestamp": "2026-09-23T07:18:01.000Z"
}
```

---

## 🚀 Running the Project Locally

### Prerequisites
- **Java 21** installed (`java -version`)
- **Apache Maven 3.9+** installed (`mvn -version`)
- **Docker & Docker Compose** (for running PostgreSQL & Redis locally)

### 1. Configure Environment Variables
Copy the example environment file:
```bash
cp .env.example .env
```

### 2. Start PostgreSQL and Redis
```bash
docker compose up -d
```

### 3. Run Backend Tests
```bash
cd backend
mvn clean test
```

### 4. Start the Backend Application
```bash
cd backend
mvn spring-boot:run
```

The application will start on `http://localhost:8080`.

---

## 🔮 Future Enhancements & Scaling
- **Distributed Caching**: Redis cluster for global caching.
- **Message Queues**: Apache Kafka for asynchronous fan-out timeline workers.
- **Full-Text Search**: Elasticsearch / OpenSearch for high-throughput tweet & user search.
- **Container Orchestration**: Kubernetes deployment manifests.
