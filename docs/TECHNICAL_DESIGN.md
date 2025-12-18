# Technical Design Document
## Owambe Platform

**Version:** 1.0  
**Date:** October 23, 2025  
**Status:** Final

---

## Table of Contents

1. [System Architecture](#1-system-architecture)
2. [Technology Stack](#2-technology-stack)
3. [Component Design](#3-component-design)
4. [Database Design](#4-database-design)
5. [API Design](#5-api-design)
6. [Security Architecture](#6-security-architecture)
7. [Deployment Architecture](#7-deployment-architecture)

---

## 1. System Architecture

### 1.1 High-Level Architecture

The Owambe Platform follows a modern **three-tier architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                         │
│  (React 19 + TypeScript + Tailwind CSS + shadcn/ui)    │
│                                                          │
│  - Single Page Application (SPA)                        │
│  - Responsive UI Components                             │
│  - Client-side Routing (Wouter)                         │
│  - State Management (tRPC + React Query)                │
└────────────────┬────────────────────────────────────────┘
                 │
                 │ HTTPS / tRPC
                 │
┌────────────────▼────────────────────────────────────────┐
│                  Application Layer                       │
│         (Node.js + Express + tRPC + TypeScript)         │
│                                                          │
│  - API Gateway & Routing                                │
│  - Business Logic                                       │
│  - Authentication & Authorization                       │
│  - Data Validation                                      │
└────────────────┬────────────────────────────────────────┘
                 │
                 │ Drizzle ORM
                 │
┌────────────────▼────────────────────────────────────────┐
│                     Data Layer                           │
│                  (MySQL / TiDB)                          │
│                                                          │
│  - Relational Database                                  │
│  - Data Persistence                                     │
│  - Transaction Management                               │
└──────────────────────────────────────────────────────────┘

External Services:
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Manus OAuth  │  │  S3 Storage  │  │  Email/SMS   │
│   Service    │  │   (Future)   │  │   (Future)   │
└──────────────┘  └──────────────┘  └──────────────┘
```

### 1.2 Architectural Patterns

**Model-View-Controller (MVC)**
- **Model**: Database schemas (Drizzle ORM)
- **View**: React components
- **Controller**: tRPC routers and procedures

**Repository Pattern**
- Database access abstracted in `server/db.ts`
- Reusable query functions
- Separation of data access from business logic

**API Gateway Pattern**
- Single entry point for all API calls (`/api/trpc`)
- Centralized authentication and authorization
- Request/response transformation

---

## 2. Technology Stack

### 2.1 Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.x | UI framework |
| TypeScript | 5.x | Type safety |
| Vite | 5.x | Build tool and dev server |
| Tailwind CSS | 4.x | Utility-first CSS framework |
| shadcn/ui | Latest | Component library |
| tRPC Client | 11.x | Type-safe API client |
| React Query | 5.x | Data fetching and caching |
| Wouter | 3.x | Client-side routing |
| Lucide React | Latest | Icon library |

### 2.2 Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 22.x | Runtime environment |
| Express | 4.x | Web framework |
| TypeScript | 5.x | Type safety |
| tRPC | 11.x | Type-safe RPC framework |
| Drizzle ORM | Latest | Database ORM |
| Zod | Latest | Schema validation |
| JWT | Latest | Authentication tokens |
| Nanoid | Latest | ID generation |

### 2.3 Database & Storage

| Technology | Purpose |
|------------|---------|
| MySQL / TiDB | Primary database |
| S3-compatible storage | File and image storage |

### 2.4 Development Tools

| Tool | Purpose |
|------|---------|
| pnpm | Package manager |
| ESLint | Code linting |
| Prettier | Code formatting |
| tsx | TypeScript execution |
| Git | Version control |

---

## 3. Component Design

### 3.1 Frontend Component Architecture

```
client/src/
├── pages/              # Page-level components
│   ├── Home.tsx       # Landing page
│   ├── Events.tsx     # Event listing
│   ├── EventDetail.tsx # Event details
│   ├── Venues.tsx     # Venue listing
│   ├── Hotels.tsx     # Hotel listing
│   ├── Vendors.tsx    # Vendor listing
│   ├── VendorDetail.tsx # Vendor details
│   ├── Dashboard.tsx  # User dashboard
│   ├── SocialEnhanced.tsx # Community feed
│   ├── PartnerDashboard.tsx # Partner portal
│   ├── MyBookings.tsx # Booking history
│   └── NotFound.tsx   # 404 page
│
├── components/         # Reusable components
│   ├── ui/            # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── tabs.tsx
│   │   └── ...
│   ├── ErrorBoundary.tsx
│   └── ...
│
├── contexts/          # React contexts
│   └── ThemeContext.tsx
│
├── hooks/             # Custom hooks
│   └── useAuth.ts
│
├── lib/               # Utilities
│   └── trpc.ts       # tRPC client setup
│
├── App.tsx            # Root component with routing
├── main.tsx           # Application entry point
└── index.css          # Global styles
```

### 3.2 Backend Component Architecture

```
server/
├── _core/             # Framework core (do not modify)
│   ├── context.ts    # tRPC context creation
│   ├── trpc.ts       # tRPC setup
│   ├── env.ts        # Environment variables
│   ├── cookies.ts    # Cookie management
│   ├── oauth.ts      # OAuth integration
│   └── ...
│
├── routers.ts         # Main tRPC router
├── db.ts              # Database queries
└── storage.ts         # S3 storage helpers

drizzle/
└── schema.ts          # Database schema definitions

shared/
└── const.ts           # Shared constants
```

### 3.3 Key Design Patterns

**Component Composition**
- Small, focused components
- Reusable UI primitives from shadcn/ui
- Composition over inheritance

**Custom Hooks**
- `useAuth()` - Authentication state
- tRPC hooks - Data fetching (`useQuery`, `useMutation`)
- React Query hooks - Caching and synchronization

**Error Boundaries**
- Graceful error handling
- User-friendly error messages
- Error logging for debugging

---

## 4. Database Design

### 4.1 Entity Relationship Diagram

```
┌─────────────┐
│    users    │
└──────┬──────┘
       │
       │ 1:N
       │
       ├──────────┬──────────┬──────────┬──────────┐
       │          │          │          │          │
       ▼          ▼          ▼          ▼          ▼
┌──────────┐ ┌────────┐ ┌─────────┐ ┌──────┐ ┌──────────┐
│ bookings │ │ posts  │ │  likes  │ │ cart │ │ wishlist │
└──────────┘ └────────┘ └─────────┘ └──────┘ └──────────┘
       │
       │ N:1
       │
       ├──────────┬──────────┬──────────┐
       │          │          │          │
       ▼          ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌─────────┐
│ events │ │ venues │ │ hotels │ │ vendors │
└────────┘ └────────┘ └────────┘ └─────────┘
                                       │
                                       │ 1:N
                                       ▼
                                 ┌──────────────┐
                                 │vendorBookings│
                                 └──────────────┘

Partner Management:
┌──────────────┐
│ b2bPartners  │
└──────┬───────┘
       │ 1:N
       ├──────────┬──────────┬──────────┐
       │          │          │          │
       ▼          ▼          ▼          ▼
┌────────────┐ ┌──────────┐ ┌─────────┐ ┌──────────────┐
│availability│ │discounts │ │gdsChannels│propertyDist. │
└────────────┘ └──────────┘ └─────────┘ └──────────────┘
```

### 4.2 Core Tables

**users**
```typescript
{
  id: string (PK)
  name: string
  email: string
  loginMethod: string
  role: enum('user', 'admin')
  createdAt: timestamp
  lastSignedIn: timestamp
}
```

**events**
```typescript
{
  id: string (PK)
  title: string
  description: text
  category: string
  date: timestamp
  location: string
  price: int (in kobo)
  capacity: int
  imageUrl: string
  createdAt: timestamp
}
```

**venues**
```typescript
{
  id: string (PK)
  name: string
  description: text
  location: string
  capacity: int
  pricePerDay: int
  amenities: text (JSON)
  imageUrl: string
  createdAt: timestamp
}
```

**bookings**
```typescript
{
  id: string (PK)
  userId: string (FK -> users.id)
  itemType: enum('event', 'venue', 'hotel')
  itemId: string
  quantity: int
  totalPrice: int
  status: enum('pending', 'confirmed', 'cancelled')
  bookingDate: timestamp
  eventDate: timestamp (nullable)
  createdAt: timestamp
}
```

### 4.3 Indexing Strategy

**Primary Indexes**
- All tables have primary key indexes on `id`

**Foreign Key Indexes**
- `bookings.userId` - Fast lookup of user bookings
- `vendorBookings.userId` - Fast lookup of vendor bookings
- `likes.postId` - Fast lookup of post likes
- `comments.postId` - Fast lookup of post comments

**Composite Indexes**
- `(userId, createdAt)` on bookings - User booking history
- `(itemType, itemId)` on bookings - Item booking lookup
- `(status, createdAt)` on bookings - Status filtering

**Full-Text Indexes** (Future)
- `events.title, events.description` - Event search
- `venues.name, venues.description` - Venue search

---

## 5. API Design

### 5.1 tRPC Router Structure

```typescript
appRouter
├── auth
│   ├── me (query)
│   └── logout (mutation)
├── events
│   ├── list (query)
│   ├── getById (query)
│   └── create (mutation) [protected]
├── venues
│   ├── list (query)
│   ├── getById (query)
│   └── create (mutation) [protected]
├── hotels
│   ├── list (query)
│   ├── getById (query)
│   └── create (mutation) [protected]
├── vendors
│   ├── list (query)
│   ├── getById (query)
│   └── create (mutation) [protected]
├── bookings
│   ├── myBookings (query) [protected]
│   └── create (mutation) [protected]
├── vendorBookings
│   ├── myBookings (query) [protected]
│   └── create (mutation) [protected]
├── dashboard
│   ├── getWishlist (query) [protected]
│   ├── addToWishlist (mutation) [protected]
│   ├── removeFromWishlist (mutation) [protected]
│   ├── getCart (query) [protected]
│   ├── addToCart (mutation) [protected]
│   ├── removeFromCart (mutation) [protected]
│   ├── getMyPosts (query) [protected]
│   └── getMyLikes (query) [protected]
└── social
    ├── posts (query)
    ├── getAllPosts (query)
    ├── getPartnerPosts (query)
    ├── getPersonalizedFeed (query) [protected]
    ├── createPost (mutation) [protected]
    ├── likePost (mutation) [protected]
    └── addComment (mutation) [protected]
```

### 5.2 API Conventions

**Naming Conventions**
- Queries: Noun-based (`list`, `getById`, `myBookings`)
- Mutations: Verb-based (`create`, `update`, `delete`)
- Protected endpoints: Require authentication

**Response Formats**
- List queries: Return arrays
- Single item queries: Return object or undefined
- Mutations: Return created/updated object or success indicator

**Error Handling**
- Use tRPC error codes (UNAUTHORIZED, NOT_FOUND, BAD_REQUEST)
- Include descriptive error messages
- Client receives typed errors

### 5.3 Authentication Flow

```
1. User clicks "Sign In"
2. Redirect to Manus OAuth portal
3. User authenticates with Manus
4. OAuth callback receives authorization code
5. Exchange code for access token
6. Create JWT session token
7. Set secure HTTP-only cookie
8. Redirect to application
9. Client reads auth state via trpc.auth.me.useQuery()
```

---

## 6. Security Architecture

### 6.1 Authentication Security

**OAuth 2.0 Integration**
- Delegated authentication via Manus
- No password storage required
- Secure token exchange

**JWT Session Management**
- HTTP-only cookies prevent XSS attacks
- Secure flag ensures HTTPS-only transmission
- SameSite attribute prevents CSRF
- Short expiration times (configurable)

### 6.2 Authorization Security

**Role-Based Access Control (RBAC)**
- User role stored in database
- Middleware checks role for protected routes
- `protectedProcedure` enforces authentication
- Resource ownership validation

**API Security**
- All mutations require authentication
- Input validation with Zod schemas
- SQL injection prevention via ORM
- XSS prevention via React escaping

### 6.3 Data Security

**Database Security**
- Encrypted connections (SSL/TLS)
- Parameterized queries via Drizzle ORM
- No raw SQL from user input
- Database user with minimal privileges

**Storage Security**
- Presigned URLs for S3 access
- Time-limited access tokens
- Private bucket with controlled access
- Content-Type validation

---

## 7. Deployment Architecture

### 7.1 Production Environment

```
┌─────────────────────────────────────────────────────────┐
│                    Load Balancer                         │
│                   (Nginx / ALB)                          │
└────────────────┬────────────────────────────────────────┘
                 │
                 │ HTTPS
                 │
      ┌──────────┴──────────┐
      │                     │
      ▼                     ▼
┌──────────┐          ┌──────────┐
│  Node.js │          │  Node.js │
│ Instance │          │ Instance │
│    #1    │          │    #2    │
└────┬─────┘          └────┬─────┘
     │                     │
     └──────────┬──────────┘
                │
                ▼
         ┌─────────────┐
         │   MySQL     │
         │  (Primary)  │
         └──────┬──────┘
                │
                │ Replication
                │
         ┌──────▼──────┐
         │   MySQL     │
         │  (Replica)  │
         └─────────────┘

External Services:
┌──────────┐  ┌──────────┐  ┌──────────┐
│   CDN    │  │    S3    │  │  Email   │
└──────────┘  └──────────┘  └──────────┘
```

### 7.2 Deployment Options

**Option 1: VPS Deployment**
- Single server or multiple servers
- PM2 for process management
- Nginx as reverse proxy
- Suitable for small to medium scale

**Option 2: Docker Deployment**
- Containerized application
- Docker Compose for orchestration
- Easy scaling and updates
- Portable across environments

**Option 3: Cloud Platform (AWS/Azure/GCP)**
- Managed services (RDS, S3, ECS/EKS)
- Auto-scaling capabilities
- High availability
- Suitable for large scale

### 7.3 Environment Configuration

**Development**
```bash
NODE_ENV=development
DATABASE_URL=mysql://localhost:3306/owambe_dev
VITE_APP_TITLE=Owambe (Dev)
```

**Staging**
```bash
NODE_ENV=staging
DATABASE_URL=mysql://staging-db:3306/owambe_staging
VITE_APP_TITLE=Owambe (Staging)
```

**Production**
```bash
NODE_ENV=production
DATABASE_URL=mysql://prod-db:3306/owambe_prod
VITE_APP_TITLE=Owambe
```

### 7.4 Monitoring & Logging

**Application Monitoring**
- Error tracking (Sentry, LogRocket)
- Performance monitoring (New Relic, DataDog)
- Uptime monitoring (Pingdom, UptimeRobot)

**Logging Strategy**
- Structured logging (JSON format)
- Log levels (error, warn, info, debug)
- Centralized log aggregation (ELK stack, CloudWatch)
- Log rotation and retention

### 7.5 Backup Strategy

**Database Backups**
- Daily full backups
- Hourly incremental backups
- 30-day retention period
- Automated backup verification

**File Storage Backups**
- S3 versioning enabled
- Cross-region replication
- Lifecycle policies for old versions

---

## 8. Performance Optimization

### 8.1 Frontend Optimization

**Code Splitting**
- Route-based code splitting
- Lazy loading of components
- Dynamic imports for large libraries

**Asset Optimization**
- Image optimization and compression
- WebP format with fallbacks
- CDN for static assets
- Gzip/Brotli compression

**Caching Strategy**
- React Query caching
- Browser caching headers
- Service Worker (future)

### 8.2 Backend Optimization

**Database Optimization**
- Connection pooling
- Query optimization
- Proper indexing
- Read replicas for scaling

**API Optimization**
- Response compression
- Pagination for large datasets
- Efficient query patterns
- Caching layer (Redis - future)

---

## 9. Testing Strategy

### 9.1 Testing Pyramid

```
        ┌─────────────┐
        │   E2E Tests │  (10%)
        └─────────────┘
      ┌─────────────────┐
      │Integration Tests│  (30%)
      └─────────────────┘
    ┌───────────────────────┐
    │     Unit Tests        │  (60%)
    └───────────────────────┘
```

### 9.2 Testing Tools

| Type | Tool | Purpose |
|------|------|---------|
| Unit | Vitest | Component and function testing |
| Integration | Vitest | API endpoint testing |
| E2E | Playwright | Full user flow testing |
| Type Checking | TypeScript | Compile-time type safety |

---

## 10. Future Enhancements

### 10.1 Technical Improvements

**Performance**
- Implement Redis caching layer
- Add service worker for offline support
- Optimize bundle size further
- Implement GraphQL subscriptions for real-time updates

**Scalability**
- Microservices architecture
- Message queue (RabbitMQ, Kafka)
- Event-driven architecture
- Database sharding

**Security**
- Two-factor authentication
- Rate limiting
- DDoS protection
- Security audit and penetration testing

### 10.2 Feature Enhancements

**Payment Integration**
- Paystack integration
- Flutterwave integration
- Wallet system
- Refund management

**Communication**
- Real-time chat
- Video calls
- Push notifications
- Email campaigns

**Analytics**
- Advanced reporting
- Business intelligence dashboard
- Predictive analytics
- A/B testing framework

---

**Document Approval**

| Role | Name | Date |
|------|------|------|
| Technical Architect | | |
| Lead Developer | | |
| DevOps Engineer | | |

---

**Revision History**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Oct 23, 2025 | Development Team | Initial technical design |

