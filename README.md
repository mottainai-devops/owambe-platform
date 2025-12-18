# Owambe Platform

**A comprehensive event, venue, and hotel booking platform for the Nigerian market**

Owambe is a full-stack TypeScript application built with React 19, Express, tRPC, and MySQL, designed to streamline event management, venue bookings, and hotel reservations across Nigeria. The platform integrates with Paystack for payments, Termii for SMS notifications, and AWS services for scalable cloud infrastructure.

---

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Database](#database)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Core Functionality
- **Event Management**: Create, browse, and book tickets for concerts, conferences, weddings, parties, sports events, and festivals
- **Venue Booking**: Search and reserve venues with real-time availability calendars
- **Hotel Reservations**: Browse hotels, check room availability, and make bookings
- **Payment Processing**: Secure payments via Paystack with support for multiple payment methods
- **Reviews & Ratings**: User-generated reviews with owner responses
- **Loyalty Program**: Points-based rewards system with tiered benefits (Bronze, Silver, Gold, Platinum)

### User Experience
- **Real-time Location Detection**: Browser geolocation API for nearby suggestions
- **Advanced Search**: Filter by category, location, price range, ratings, and dates
- **Interactive Maps**: SVG-based maps showing 40+ Nigerian locations
- **Notifications**: In-app and email notifications for bookings, payments, and updates
- **Messaging System**: Direct messaging between users, organizers, and venue owners

### Admin & Partner Features
- **Admin Dashboard**: User management, analytics, and platform oversight
- **Partner Dashboard**: Venue/hotel owners can manage listings, bookings, and availability
- **Analytics**: Comprehensive reporting on bookings, revenue, and user engagement

---

## Technology Stack

### Backend
- **Runtime**: Node.js 22.x
- **Framework**: Express 4.21.2
- **API**: tRPC 11.6.0 (type-safe RPC)
- **Database ORM**: Drizzle ORM 0.44.5
- **Database**: MySQL 8.0 (via mysql2 3.15.0)
- **Authentication**: JWT (jose 6.1.0) + OAuth 2.0
- **Language**: TypeScript 5.9.3

### Frontend
- **Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.7
- **Routing**: Wouter 3.3.5
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS 4.1.14
- **State Management**: TanStack Query 5.90.2 + tRPC React Query
- **Forms**: React Hook Form 7.64.0
- **Validation**: Zod 4.1.12
- **Animations**: Framer Motion 12.23.22

### Third-Party Integrations
- **Payment**: Paystack (Nigerian payment gateway)
- **SMS**: Termii (SMS/OTP service)
- **Email**: AWS SES (Simple Email Service)
- **Storage**: AWS S3 + CloudFront CDN
- **Image Generation**: Manus built-in service
- **LLM**: Manus built-in service
- **Voice Transcription**: Manus built-in service

### Package Manager
- **pnpm** 10.4.1

---

## Project Structure

```
owambe-platform/
├── client/                  # Frontend React application
│   ├── public/             # Static assets
│   └── src/
│       ├── _core/          # Core frontend utilities
│       ├── components/     # React components (77 total)
│       ├── contexts/       # React contexts
│       ├── hooks/          # Custom React hooks
│       ├── lib/            # Libraries (tRPC client, utils)
│       ├── pages/          # Page components
│       ├── App.tsx         # Main app with routing
│       ├── const.ts        # Frontend constants
│       ├── index.css       # Global Tailwind styles
│       └── main.tsx        # React entry point
├── server/                  # Backend Node.js/Express application
│   ├── _core/              # Core backend utilities
│   ├── db.ts               # Core database queries
│   ├── db-admin.ts         # Admin database queries
│   ├── db-agent.ts         # Agent database queries
│   ├── payment-service.ts  # Paystack integration
│   ├── routers.ts          # Main tRPC router
│   ├── routers-admin.ts    # Admin routes
│   ├── routers-agent.ts    # Agent routes
│   ├── routers-features.ts # Feature routes
│   ├── routers-payment.ts  # Payment routes
│   ├── routers-reviews.ts  # Review routes
│   └── storage.ts          # S3 storage integration
├── shared/                  # Shared code (types, constants)
├── drizzle/                 # Database schema and migrations
│   ├── schema.ts           # Database schema (53 tables)
│   └── migrations/         # SQL migration files (8 migrations)
├── scripts/                 # Utility scripts
│   ├── seed.ts             # Database seeding
│   └── seed-vendors.ts     # Vendor data seeding
├── docs/                    # Documentation
├── Dockerfile              # Production Docker configuration
├── .dockerignore           # Docker ignore patterns
├── package.json            # Dependencies and scripts
├── pnpm-lock.yaml          # pnpm lockfile
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
├── vitest.config.ts        # Vitest configuration
├── drizzle.config.ts       # Drizzle ORM configuration
└── components.json         # shadcn/ui configuration
```

---

## Getting Started

### Prerequisites
- **Node.js** 22.x or higher
- **pnpm** 10.4.1 or higher
- **MySQL** 8.0 or higher
- **Redis** (optional, for caching)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mottainai-devops/owambe-platform.git
   cd owambe-platform
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database**
   ```bash
   # Create MySQL database
   mysql -u root -p -e "CREATE DATABASE owambe;"
   
   # Run migrations
   pnpm db:push
   
   # Seed database (optional)
   tsx scripts/seed.ts
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

6. **Open browser**
   ```
   http://localhost:3000
   ```

---

## Development

### Available Scripts

```bash
# Development
pnpm dev              # Start development server with hot reload
pnpm check            # Type check without emitting files
pnpm format           # Format code with Prettier

# Testing
pnpm test             # Run all tests with Vitest

# Database
pnpm db:push          # Generate and run migrations

# Production
pnpm build            # Build frontend and backend
pnpm start            # Start production server
```

### Development Workflow

1. **Frontend development**: Edit files in `client/src/`, Vite provides hot module replacement
2. **Backend development**: Edit files in `server/`, tsx watch mode auto-restarts server
3. **Database changes**: Update `drizzle/schema.ts`, run `pnpm db:push`
4. **Add components**: Use shadcn/ui CLI or create custom components in `client/src/components/`
5. **Add API endpoints**: Create tRPC procedures in `server/routers-*.ts`

### Code Style

- **TypeScript**: Strict mode enabled
- **Formatting**: Prettier with default configuration
- **Naming**: camelCase for variables/functions, PascalCase for components/types
- **Imports**: Absolute imports with `@/` prefix for client code

---

## Database

### Schema Overview

The platform uses **53 database tables** organized into the following domains:

**User Management**
- `users` - User accounts with roles (user, admin)

**Event Management**
- `events`, `eventCategories`, `eventTickets`

**Venue Management**
- `venues`, `venueAmenities`, `venueAvailability`

**Hotel Management**
- `hotels`, `hotelRooms`, `hotelAmenities`, `hotelAvailability`

**Booking System**
- `bookings`, `bookingItems`, `bookingCancellations`

**Payment Processing**
- `payments`, `paymentMethods`, `refunds`

**Reviews & Ratings**
- `reviews`, `reviewResponses`

**Notifications**
- `notifications`, `notificationPreferences`

**Messaging**
- `messages`, `conversations`

**Loyalty Program**
- `loyaltyPoints`, `loyaltyTransactions`, `loyaltyTiers`, `loyaltyRewards`

**Search & Discovery**
- `searches`, `searchHistory`

**Admin & Analytics**
- `adminLogs`, `analytics`, `reports`

### Migrations

Migrations are managed by Drizzle Kit and stored in `drizzle/migrations/`. To create a new migration:

```bash
# 1. Update drizzle/schema.ts
# 2. Generate and apply migration
pnpm db:push
```

### Seeding

Seed the database with sample data:

```bash
tsx scripts/seed.ts           # General seed data
tsx scripts/seed-vendors.ts   # Vendor-specific data
```

---

## API Documentation

### tRPC Procedures

The API uses tRPC for type-safe, end-to-end typed procedures. All procedures are defined in `server/routers-*.ts`.

### Authentication

Authentication is handled via JWT tokens with OAuth 2.0 flow:

1. User initiates login via OAuth provider
2. Backend receives OAuth callback and generates JWT
3. JWT is stored in HTTP-only cookie
4. Protected procedures verify JWT from cookie

### Key Procedure Groups

**Authentication** (`auth.*`)
- `auth.me` - Get current user
- `auth.logout` - Logout user

**Events** (`events.*`)
- `events.list` - List all events
- `events.get` - Get event by ID
- `events.create` - Create event (protected)
- `events.update` - Update event (protected)
- `events.delete` - Delete event (protected)
- `events.search` - Search events

**Venues** (`venues.*`)
- `venues.list`, `venues.get`, `venues.create`, `venues.update`, `venues.delete`
- `venues.search` - Search venues
- `venues.availability` - Check availability

**Hotels** (`hotels.*`)
- `hotels.list`, `hotels.get`, `hotels.create`, `hotels.update`, `hotels.delete`
- `hotels.search` - Search hotels
- `hotels.availability` - Check room availability

**Bookings** (`bookings.*`)
- `bookings.list` - List user bookings (protected)
- `bookings.get` - Get booking details (protected)
- `bookings.create` - Create booking (protected)
- `bookings.cancel` - Cancel booking (protected)

**Payments** (`payments.*`)
- `payments.initiate` - Initiate Paystack payment (protected)
- `payments.verify` - Verify payment (protected)
- `payments.webhook` - Paystack webhook handler (public)

**Reviews** (`reviews.*`)
- `reviews.list`, `reviews.create`, `reviews.update`, `reviews.delete`
- `reviews.respond` - Owner response (protected)

**Notifications** (`notifications.*`)
- `notifications.list`, `notifications.markRead`, `notifications.preferences`

**Messages** (`messages.*`)
- `messages.conversations`, `messages.get`, `messages.send`, `messages.markRead`

**Loyalty** (`loyalty.*`)
- `loyalty.points`, `loyalty.transactions`, `loyalty.rewards`, `loyalty.redeem`

**Admin** (`admin.*`)
- `admin.users.list`, `admin.users.update`
- `admin.bookings.list`
- `admin.analytics`, `admin.reports`

**Total**: 70+ tRPC procedures

---

## Deployment

### Docker Deployment

1. **Build Docker image**
   ```bash
   docker build -t owambe-platform .
   ```

2. **Run container**
   ```bash
   docker run -d \
     -p 3000:3000 \
     --env-file .env \
     --name owambe \
     owambe-platform
   ```

### AWS Deployment

The platform is designed for deployment on AWS with the following architecture:

- **Compute**: ECS Fargate (2-10 auto-scaling instances)
- **Database**: RDS MySQL (db.t3.medium, Multi-AZ)
- **Cache**: ElastiCache Redis (cache.t3.medium, 2 nodes)
- **Load Balancer**: Application Load Balancer with SSL
- **Storage**: S3 + CloudFront CDN
- **Monitoring**: CloudWatch dashboards and alarms

Complete AWS infrastructure as code is available in the `/terraform` directory.

### Environment Variables

See `.env.example` for all required environment variables. Key variables include:

- `DATABASE_URL` - MySQL connection string
- `REDIS_HOST`, `REDIS_PORT` - Redis connection
- `PAYSTACK_PUBLIC_KEY`, `PAYSTACK_SECRET_KEY` - Paystack credentials
- `TERMII_API_KEY`, `TERMII_SENDER_ID` - Termii credentials
- `SES_SENDER` - AWS SES sender email
- `JWT_SECRET` - JWT signing secret

All secrets should be stored in AWS Secrets Manager in production.

---

## Testing

### Unit Tests

Run unit tests with Vitest:

```bash
pnpm test              # Run all tests
pnpm test:watch        # Watch mode
```

### Integration Tests

Integration tests cover:
- tRPC procedure execution
- Database operations
- Payment processing flows
- Authentication flows

### End-to-End Tests

E2E tests can be added using Playwright or Cypress (not currently configured).

---

## Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature`
3. **Commit changes**: `git commit -m 'Add your feature'`
4. **Push to branch**: `git push origin feature/your-feature`
5. **Open a Pull Request**

### Code Standards

- Write TypeScript with strict mode
- Follow existing code style (use Prettier)
- Add tests for new features
- Update documentation as needed

---

## License

MIT License - see LICENSE file for details

---

## Support

For questions, issues, or feature requests:

- **GitHub Issues**: https://github.com/mottainai-devops/owambe-platform/issues
- **Documentation**: See `/docs` directory
- **Email**: devops@owambe.com

---

## Acknowledgments

Built with:
- [React](https://react.dev/)
- [tRPC](https://trpc.io/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Paystack](https://paystack.com/)
- [Termii](https://www.termii.com/)
- [AWS](https://aws.amazon.com/)

---

**Version**: 1.0.0  
**Last Updated**: December 2025  
**Maintainer**: Mottainai DevOps Team
