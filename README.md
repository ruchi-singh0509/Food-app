# Food-app

A production-ready, containerized full-stack food ordering platform with a user storefront, admin panel, REST API backend, MongoDB persistence, Redis caching, monitoring, and CI/CD.

---

## Table of contents
- Project overview
- System architecture
- Folder structure
- Key technologies
- Features
- Authentication & security
- WebSockets
- Scalability & performance
- Optimization & best practices
- Observability & monitoring
- Local setup (Windows)
- Environment variables (example)
- Tests & CI/CD
- Deployment
- Next improvements
- Contributing
- License

---

## Project overview
Food-app provides user-facing ordering flows (browse menu, cart, checkout), order management for users, and an admin UI for menu and order administration. The system emphasizes production concerns: containerization, caching, rate-limiting, CSRF protection, structured logs, and automated CI.

---

## System architecture (high level)
- Client (React + Vite)
  - Public storefront and admin UI
  - Communicates with backend over REST
- API Server (Node.js + Express)
  - Controllers: users, food items, cart, orders
  - Middleware: auth (JWT), validation, helmet, rate-limit, csurf
- Data layer
  - MongoDB (primary persistence)
  - Redis (cache, rate counters, optional session store)
- Reverse proxy: Nginx (production)
- Containerization: Docker / Docker Compose
- Observability: Winston + Morgan, health/metrics endpoints
- CI/CD: GitHub Actions pipelines

Diagram (text):
Client (React) <--> Nginx <--> Express API <--> MongoDB
                                   \
                                    -> Redis (cache/session)

---

## Folder structure (key parts)
- backend/         — Express app, routes, controllers, middleware, config
- frontend/        — User React app (Vite)
- admin/           — Admin React app (Vite)
- nginx/           — Reverse-proxy configs
- .github/workflows/ — CI/CD pipelines
- docker-compose.*.yml, Dockerfile — container configs
- MONITORING.md, PERFORMANCE_OPTIMIZATION.md, ACCESSIBILITY.md — docs

---

## Key technologies
- Frontend: React, Vite, React Router
- Backend: Node.js, Express, Mongoose
- Database: MongoDB
- Cache & sessions: Redis
- Auth: JWT (stored in HTTP-only cookies)
- Security: helmet, csurf, input sanitizers, rate-limiter
- DevOps: Docker, Docker Compose, Nginx
- Observability: Winston, Morgan, health endpoints
- CI: GitHub Actions

---

## Features
- User: register, login, logout, profile
- Menu: browse, search, filter food items
- Cart: add/remove items, persistent per user
- Orders: checkout, payment verification (integrations or stubs), order history
- Admin: add/edit/delete menu items, manage orders
- Accessibility: ARIA, keyboard navigation considerations
- Performance: caching, client code-splitting, optimized builds

---

## Authentication & security
- JWT-based authentication. Tokens issued at login/registration and set as HTTP-only cookies to reduce XSS risk.
- Auth middleware validates token for protected routes.
- CSRF protection via csurf for state-changing endpoints.
- Helmet for secure headers, input validation/sanitization, and rate limiting applied.

---

## WebSockets
This repository does not include WebSocket/socket.io integration. All client-server communication is implemented via REST APIs. Real-time features (order status updates, live admin notifications) are not implemented with WebSockets in the current codebase.

---

## Scalability & performance
- Stateless API servers (JWT) allow horizontal scaling behind a load balancer.
- Redis used for caching frequently-read resources and shared counters (helps scale read-heavy endpoints).
- MongoDB supports replica sets and sharding for scale-out.
- Nginx for SSL termination, connection handling, and static asset caching.
- Recommended orchestration: Docker Swarm or Kubernetes for multi-node deployments and autoscaling.
- Client optimizations: code-splitting, lazy loading, compressed assets, long-term caching headers.

---

## Optimization & best practices implemented
- Caching layer with TTL for read-heavy endpoints.
- Structured logging (Winston) + request logging (Morgan).
- Security middleware (helmet, csurf) and input validation.
- Health-check endpoints for load balancer readiness/liveness probes.
- CI pipelines for linting, testing, and build verification.

---

## Observability & monitoring
- Health endpoints and structured logs.
- Metrics endpoints exist or can be added for integration with Prometheus/Grafana or cloud APM.
- Suggested production stack: Prometheus + Grafana for metrics, ELK (or hosted alternatives) for logs and alerts.

---

## Local setup (Windows)
1. Clone:
   - git clone <repo-url>
   - cd c:\Users\91834\Food-app
2. Install dependencies:
   - backend: cd backend && npm install
   - frontend: cd frontend && npm install
   - admin: cd admin && npm install
3. Start required services (local or Docker):
   - MongoDB and Redis (local install or docker run)
4. Start apps:
   - Backend:
     - cd backend
     - copy .env.example -> .env and set values
     - npm run dev
   - Frontend:
     - cd frontend && npm run dev
   - Admin:
     - cd admin && npm run dev
5. Optional: docker-compose -f docker-compose.dev.yml up --build

---

## Environment variables (backend example)
- NODE_ENV=development
- PORT=5000
- MONGO_URI=mongodb://localhost:27017/foodapp
- JWT_SECRET=your_jwt_secret
- REDIS_URL=redis://localhost:6379
- COOKIE_DOMAIN=localhost
- CSRF_SECRET=some_csrf_secret

Adjust frontend .env.* for API_BASE_URL and similar client settings.

---

## Tests & CI/CD
- Backend/unit tests alongside modules or in tests/ (Jest or preferred runner).
- Frontend tests with Jest + React Testing Library (if present).
- GitHub Actions configured to run lint, tests, and builds on push/PR.

---

## Deployment
- Build frontend and admin for production (npm run build).
- Containerize each service via provided Dockerfiles.
- Use docker-compose.prod.yml or deploy containers to an orchestration platform (K8s recommended for scale).
- Configure Nginx for reverse proxy and SSL termination (Let’s Encrypt or managed certs).
- Use a secrets manager or vault for production secrets.

---

## Next improvements (suggested)
- Real-time updates via WebSockets/socket.io for live order status and admin notifications.
- Harden RBAC for admin routes.
- Add end-to-end tests and payment provider integration tests.
- Implement full observability: Prometheus, Grafana, ELK or cloud APM.
- Add automated DB backups and migration strategy.

---

## Contributing
- Follow existing code style, run linters and tests before submitting PRs.
- Open PRs against main with descriptive titles and linked issues.

---

## License
- Add an appropriate LICENSE file (e.g., MIT) if not present.
