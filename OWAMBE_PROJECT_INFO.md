# Owambe Platform - Complete Project Information

**Export Date:** December 1, 2025  
**Version:** 1.0.0  
**Purpose:** GitHub consolidation in `mottainai-devops/owambe-platform`

---

## 1. Project Structure

```
owambe-platform/
├── client/                  # Frontend React application
│   ├── public/             # Static assets
│   └── src/
│       ├── _core/          # Core frontend utilities
│       ├── components/     # React components (shadcn/ui + custom)
│       ├── contexts/       # React contexts
│       ├── hooks/          # Custom React hooks
│       ├── lib/            # Libraries (tRPC client, utils)
│       ├── pages/          # Page components
│       ├── App.tsx         # Main app component with routing
│       ├── const.ts        # Frontend constants
│       ├── index.css       # Global styles (Tailwind)
│       └── main.tsx        # React entry point
├── server/                  # Backend Node.js/Express application
│   ├── _core/              # Core backend utilities
│   │   ├── types/          # TypeScript types
│   │   ├── context.ts      # tRPC context
│   │   ├── cookies.ts      # Cookie handling
│   │   ├── dataApi.ts      # Data API integration
│   │   ├── env.ts          # Environment variables
│   │   ├── imageGeneration.ts  # Image generation service
│   │   ├── index.ts        # Express server entry point
│   │   ├── llm.ts          # LLM integration
│   │   ├── notification.ts # Notification service
│   │   ├── oauth.ts        # OAuth authentication
│   │   ├── sdk.ts          # SDK utilities
│   │   ├── systemRouter.ts # System tRPC router
│   │   ├── trpc.ts         # tRPC setup
│   │   ├── vite.ts         # Vite middleware
│   │   └── voiceTranscription.ts  # Voice transcription
│   ├── db-admin.ts         # Admin database queries
│   ├── db-agent.ts         # Agent database queries
│   ├── db.ts               # Core database queries
│   ├── payment-service.ts  # Payment processing (Paystack)
│   ├── routers-admin.ts    # Admin tRPC routes
│   ├── routers-agent.ts    # Agent tRPC routes
│   ├── routers-features.ts # Feature tRPC routes
│   ├── routers-payment.ts  # Payment tRPC routes
│   ├── routers-reviews.ts  # Reviews tRPC routes
│   ├── routers.ts          # Main tRPC router
│   └── storage.ts          # S3 storage integration
├── shared/                  # Shared code between client and server
│   ├── _core/
│   │   └── errors.ts       # Error definitions
│   ├── const.ts            # Shared constants
│   └── types.ts            # Shared TypeScript types
├── drizzle/                 # Database schema and migrations
│   ├── meta/               # Migration metadata
│   ├── migrations/         # SQL migration files (8 migrations)
│   ├── relations.ts        # Database relations
│   └── schema.ts           # Database schema (53 tables)
├── scripts/                 # Utility scripts
│   ├── seed-vendors.ts     # Seed vendor data
│   └── seed.ts             # Seed database
├── docs/                    # Documentation
│   ├── DEPLOYMENT_GUIDE_FINAL.md
│   ├── FINAL_IMPLEMENTATION_STATUS.md
│   ├── MOBILE_APP_DESIGN_SYSTEM.md
│   ├── SRS.md              # Software Requirements Specification
│   ├── TECHNICAL_DESIGN.md
│   └── USER_WALKTHROUGH.md
├── patches/                 # pnpm patches
│   └── wouter@3.7.1.patch
├── package.json             # Root package.json
├── pnpm-lock.yaml          # pnpm lockfile
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
├── vitest.config.ts        # Vitest configuration
├── drizzle.config.ts       # Drizzle ORM configuration
├── components.json         # shadcn/ui configuration
├── ecosystem.config.js     # PM2 configuration
├── todo.md                 # Development TODO list
└── userGuide.md            # User guide
```

**Architecture Type:** Monorepo (single repository, shared dependencies)

---

## 2. Technology Stack

### Backend
- **Runtime:** Node.js v22.x
- **Framework:** Express 4.21.2
- **Language:** TypeScript 5.9.3
- **API Type:** tRPC 11.6.0 (type-safe RPC)
- **ORM:** Drizzle ORM 0.44.5
- **Database Client:** mysql2 3.15.0
- **Authentication:** JWT (jose 6.1.0) + OAuth 2.0
- **Build Tool:** esbuild 0.25.0
- **Dev Server:** tsx 4.19.1 (watch mode)

### Frontend
- **Framework:** React 19.1.1
- **Language:** TypeScript 5.9.3
- **Build Tool:** Vite 7.1.7
- **Routing:** Wouter 3.3.5 (patched)
- **UI Library:** shadcn/ui (Radix UI primitives)
- **Styling:** Tailwind CSS 4.1.14
- **State Management:** TanStack Query 5.90.2 + tRPC React Query
- **Forms:** React Hook Form 7.64.0
- **Validation:** Zod 4.1.12
- **Icons:** Lucide React 0.453.0
- **Animations:** Framer Motion 12.23.22

### Database
- **Type:** MySQL 8.0
- **Schema Management:** Drizzle Kit migrations
- **Tables:** 53 tables (users, events, venues, hotels, bookings, payments, reviews, notifications, messages, loyalty, etc.)
- **Seeding:** TypeScript seed scripts

### Third-Party Integrations
- **Payment:** Paystack (Nigerian payment gateway)
- **SMS/OTP:** Termii (SMS service)
- **Email:** AWS SES (Simple Email Service)
- **Storage:** AWS S3 + CloudFront CDN
- **Image Generation:** Manus built-in service
- **LLM:** Manus built-in service
- **Voice Transcription:** Manus built-in service
- **Geolocation:** Browser Geolocation API

### Package Manager
- **pnpm** 10.4.1 (with patches and overrides)

---

## 3. Database Schema

### Core Tables (53 total)

**User Management:**
- `users` - User accounts with roles (user, admin)

**Event Management:**
- `events` - Event listings
- `eventCategories` - Event categories
- `eventTickets` - Ticket types for events

**Venue Management:**
- `venues` - Venue listings
- `venueAmenities` - Venue amenities
- `venueAvailability` - Venue availability calendar

**Hotel Management:**
- `hotels` - Hotel listings
- `hotelRooms` - Hotel room types
- `hotelAmenities` - Hotel amenities
- `hotelAvailability` - Hotel room availability

**Booking System:**
- `bookings` - All bookings (events, venues, hotels)
- `bookingItems` - Booking line items
- `bookingCancellations` - Cancellation records

**Payment Processing:**
- `payments` - Payment transactions
- `paymentMethods` - Saved payment methods
- `refunds` - Refund records

**Reviews & Ratings:**
- `reviews` - User reviews for events/venues/hotels
- `reviewResponses` - Owner responses to reviews

**Notifications:**
- `notifications` - User notifications
- `notificationPreferences` - User notification settings

**Messaging:**
- `messages` - Direct messages between users
- `conversations` - Message threads

**Loyalty Program:**
- `loyaltyPoints` - User loyalty points
- `loyaltyTransactions` - Points transaction history
- `loyaltyTiers` - Loyalty tier definitions
- `loyaltyRewards` - Available rewards

**Search & Discovery:**
- `searches` - Saved searches
- `searchHistory` - User search history

**Admin & Analytics:**
- `adminLogs` - Admin action logs
- `analytics` - Platform analytics
- `reports` - Generated reports

### Migration Files
- 8 migration files in `drizzle/migrations/`
- Managed by Drizzle Kit
- Run with: `pnpm db:push`

---

## 4. Environment Variables

### Required Environment Variables

```bash
# Server Configuration
NODE_ENV=production
PORT=3000
API_BASE_URL=https://api.owambe.com

# Database (provided by AWS RDS)
DATABASE_URL=mysql://user:password@host:3306/database

# Redis Cache (provided by AWS ElastiCache)
REDIS_HOST=<redis-endpoint>
REDIS_PORT=6379
REDIS_AUTH_TOKEN=<secret>

# AWS Services
AWS_REGION=eu-west-1
S3_BUCKET=owambe-storage

# Paystack Integration (Nigerian payment gateway)
PAYSTACK_PUBLIC_KEY=pk_live_xxxxx
PAYSTACK_SECRET_KEY=sk_live_xxxxx

# Termii SMS Integration
TERMII_API_KEY=xxxxx
TERMII_SENDER_ID=Owambe

# Email Configuration (AWS SES)
SES_SENDER=noreply@owambe.com

# JWT Authentication
JWT_SECRET=<64-byte-random-string>

# Manus Built-in Services (provided by platform)
BUILT_IN_FORGE_API_KEY=<auto-injected>
BUILT_IN_FORGE_API_URL=<auto-injected>
VITE_FRONTEND_FORGE_API_KEY=<auto-injected>
VITE_FRONTEND_FORGE_API_URL=<auto-injected>

# OAuth Configuration (Manus OAuth)
OAUTH_SERVER_URL=<auto-injected>
VITE_OAUTH_PORTAL_URL=<auto-injected>
VITE_APP_ID=<auto-injected>
OWNER_OPEN_ID=<auto-injected>
OWNER_NAME=<auto-injected>

# Application Settings
VITE_APP_TITLE=Owambe
VITE_APP_LOGO=<logo-url>
VITE_ANALYTICS_ENDPOINT=<auto-injected>
VITE_ANALYTICS_WEBSITE_ID=<auto-injected>
```

### Secrets (AWS Secrets Manager)
- `owambe/paystack/public_key`
- `owambe/paystack/secret_key`
- `owambe/termii/api_key`
- `owambe/termii/sender_id`
- `owambe/jwt_secret`
- `owambe/email/ses_sender`
- `owambe/db/credentials` (auto-generated)
- `owambe/redis/credentials` (auto-generated)

---

## 5. API Endpoints

### Authentication
- `auth.me` - Get current user
- `auth.logout` - Logout user

### Events
- `events.list` - List all events
- `events.get` - Get event by ID
- `events.create` - Create new event (protected)
- `events.update` - Update event (protected)
- `events.delete` - Delete event (protected)
- `events.search` - Search events

### Venues
- `venues.list` - List all venues
- `venues.get` - Get venue by ID
- `venues.create` - Create new venue (protected)
- `venues.update` - Update venue (protected)
- `venues.delete` - Delete venue (protected)
- `venues.search` - Search venues
- `venues.availability` - Check availability

### Hotels
- `hotels.list` - List all hotels
- `hotels.get` - Get hotel by ID
- `hotels.create` - Create new hotel (protected)
- `hotels.update` - Update hotel (protected)
- `hotels.delete` - Delete hotel (protected)
- `hotels.search` - Search hotels
- `hotels.availability` - Check room availability

### Bookings
- `bookings.list` - List user bookings (protected)
- `bookings.get` - Get booking by ID (protected)
- `bookings.create` - Create new booking (protected)
- `bookings.cancel` - Cancel booking (protected)
- `bookings.confirm` - Confirm booking (protected)

### Payments
- `payments.initiate` - Initiate payment (protected)
- `payments.verify` - Verify payment (protected)
- `payments.webhook` - Paystack webhook (public)
- `payments.refund` - Request refund (protected)

### Reviews
- `reviews.list` - List reviews for entity
- `reviews.create` - Create review (protected)
- `reviews.update` - Update review (protected)
- `reviews.delete` - Delete review (protected)
- `reviews.respond` - Owner response (protected)

### Notifications
- `notifications.list` - List user notifications (protected)
- `notifications.markRead` - Mark as read (protected)
- `notifications.markAllRead` - Mark all as read (protected)
- `notifications.preferences` - Get/update preferences (protected)

### Messages
- `messages.conversations` - List conversations (protected)
- `messages.get` - Get conversation messages (protected)
- `messages.send` - Send message (protected)
- `messages.markRead` - Mark as read (protected)

### Loyalty
- `loyalty.points` - Get user points (protected)
- `loyalty.transactions` - Get transaction history (protected)
- `loyalty.rewards` - List available rewards (protected)
- `loyalty.redeem` - Redeem reward (protected)

### Admin
- `admin.users.list` - List all users (admin)
- `admin.users.update` - Update user (admin)
- `admin.bookings.list` - List all bookings (admin)
- `admin.analytics` - Get analytics (admin)
- `admin.reports` - Generate reports (admin)

### System
- `system.health` - Health check
- `system.notifyOwner` - Notify platform owner (protected)

**Total:** 70+ tRPC procedures

**Authentication:** JWT-based with OAuth 2.0 flow

---

## 6. Build and Deployment

### Development
```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Type checking
pnpm check

# Run tests
pnpm test

# Database migrations
pnpm db:push
```

### Production Build
```bash
# Build frontend and backend
pnpm build

# This runs:
# 1. vite build (frontend → client/dist)
# 2. esbuild server/_core/index.ts (backend → dist/index.js)

# Start production server
pnpm start
# or
NODE_ENV=production node dist/index.js
```

### Database Setup
```bash
# Generate and run migrations
pnpm db:push

# Seed database (optional)
tsx scripts/seed.ts
tsx scripts/seed-vendors.ts
```

### Docker Build (see Dockerfile section)

---

## 7. Dockerfile

```dockerfile
# Multi-stage build for Owambe Platform
FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.4.1

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN pnpm run build

# Production image
FROM node:22-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.4.1

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/client/dist ./client/dist

# Copy drizzle files for migrations
COPY drizzle ./drizzle

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "dist/index.js"]
```

### .dockerignore
```
node_modules
.git
.env
*.log
dist
build
.vscode
.idea
.DS_Store
Thumbs.db
*.backup
*.bak
*.old
```

---

## 8. Current Deployment

**Status:** Not yet deployed to AWS (infrastructure ready, awaiting application deployment)

**Deployment Plan:**
1. Build Docker image
2. Push to AWS ECR (004443564101.dkr.ecr.eu-west-1.amazonaws.com/owambe-app)
3. Deploy to ECS Fargate (owambe-cluster / owambe-service)
4. Run database migrations
5. Configure DNS and SSL

**Infrastructure:** AWS (eu-west-1)
- ECS Fargate (2-10 auto-scaling instances)
- RDS MySQL (db.t3.medium, Multi-AZ)
- ElastiCache Redis (cache.t3.medium, 2 nodes)
- Application Load Balancer with SSL
- S3 + CloudFront CDN
- CloudWatch monitoring

---

## 9. Testing

### Test Framework
- **Vitest** 2.1.4

### Test Commands
```bash
pnpm test              # Run all tests
pnpm test:watch        # Watch mode
```

### Code Quality
- **TypeScript:** Strict mode enabled
- **ESLint:** Not configured (can be added)
- **Prettier:** 3.6.2 (configured)
- **Format:** `pnpm format`

---

## 10. Additional Documentation

### Available Documentation Files
- `README.md` - Project overview (to be created)
- `docs/SRS.md` - Software Requirements Specification
- `docs/TECHNICAL_DESIGN.md` - Technical design document
- `docs/USER_WALKTHROUGH.md` - User guide
- `docs/DEPLOYMENT_GUIDE_FINAL.md` - Deployment guide
- `docs/MOBILE_APP_DESIGN_SYSTEM.md` - Mobile app design
- `todo.md` - Development TODO list
- `userGuide.md` - End-user guide

### Key Features Implemented
✅ Event booking system
✅ Venue booking system
✅ Hotel booking system
✅ Payment processing (Paystack)
✅ Reviews and ratings
✅ Notifications system
✅ Messaging system
✅ Loyalty program
✅ Real-time location detection
✅ Advanced search and filtering
✅ Admin dashboard
✅ Partner dashboard

---

## 11. File Size Information

```bash
# Total project size (excluding node_modules)
~5 MB

# Source code breakdown:
- client/src: ~2 MB (77 components)
- server: ~1 MB (10 routers, 3 db files)
- drizzle: ~500 KB (53 tables, 8 migrations)
- docs: ~500 KB (12 documentation files)
- shared: ~50 KB
```

---

## 12. Export Checklist

- [x] Application source code documented
- [x] `node_modules/` excluded
- [x] `.env` file excluded
- [x] Build artifacts excluded
- [x] Database schema documented (53 tables)
- [x] Migration files included (8 migrations)
- [x] Environment variables documented
- [x] Dockerfile created
- [x] Project structure documented
- [x] Technology stack documented
- [x] API endpoints documented (70+ procedures)
- [x] Build instructions provided
- [x] Deployment information provided
- [x] All configuration files included

---

## 13. Next Steps for GitHub Consolidation

1. Create `mottainai-devops/owambe-platform` repository
2. Add AWS infrastructure to `/terraform` subdirectory
3. Add application code to root
4. Create comprehensive README.md
5. Set up proper `.gitignore`
6. Add CI/CD workflows (GitHub Actions)
7. Document deployment process
8. Push to GitHub

---

**Export Completed:** December 1, 2025  
**Ready for GitHub Consolidation:** ✅ Yes  
**Contact:** Connector Agent
