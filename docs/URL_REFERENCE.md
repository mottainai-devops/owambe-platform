# Owambe Platform - URL Reference Guide

**Version:** 1.0  
**Last Updated:** October 23, 2025

---

## Production URLs

Replace `owambe.com` with your actual domain name after deployment.

### Public Pages

| Page | URL | Description |
|------|-----|-------------|
| **Homepage** | `https://owambe.com/` | Main landing page with featured events |
| **Events Listing** | `https://owambe.com/events` | Browse all available events |
| **Event Details** | `https://owambe.com/events/{eventId}` | Individual event page with booking |
| **Venues Listing** | `https://owambe.com/venues` | Browse all venues |
| **Venue Details** | `https://owambe.com/venues/{venueId}` | Individual venue page with booking |
| **Hotels Listing** | `https://owambe.com/hotels` | Browse all hotels |
| **Hotel Details** | `https://owambe.com/hotels/{hotelId}` | Individual hotel page with booking |
| **Vendors Listing** | `https://owambe.com/vendors` | Browse all event vendors |
| **Vendor Details** | `https://owambe.com/vendors/{vendorId}` | Individual vendor page with booking |
| **Community/Social** | `https://owambe.com/social` | Social feed and community posts |

### User Pages (Authentication Required)

| Page | URL | Description |
|------|-----|-------------|
| **User Dashboard** | `https://owambe.com/dashboard` | Personal user hub |
| **My Bookings** | `https://owambe.com/bookings` | View all user bookings |
| **Checkout** | `https://owambe.com/checkout/{bookingId}` | Payment checkout page |
| **Payment Verification** | `https://owambe.com/payment/verify` | Payment confirmation page |

### Business Portals (Role-Based Access)

| Portal | URL | Access Level | Description |
|--------|-----|--------------|-------------|
| **Super Admin Portal** | `https://owambe.com/admin` | Admin Only | Platform management dashboard |
| **Partner Portal (B2B)** | `https://owambe.com/partner` | Partners Only | Business management dashboard |
| **Agent Portal** | `https://owambe.com/agent` | Agents Only | Sales agent dashboard |

---

## Development URLs (Current)

**Base URL:** `https://3000-ic2iugij0fdx41p6ki2hz-35591351.manusvm.computer`

### Public Pages

| Page | Development URL |
|------|-----------------|
| Homepage | https://3000-ic2iugij0fdx41p6ki2hz-35591351.manusvm.computer/ |
| Events | https://3000-ic2iugij0fdx41p6ki2hz-35591351.manusvm.computer/events |
| Venues | https://3000-ic2iugij0fdx41p6ki2hz-35591351.manusvm.computer/venues |
| Hotels | https://3000-ic2iugij0fdx41p6ki2hz-35591351.manusvm.computer/hotels |
| Vendors | https://3000-ic2iugij0fdx41p6ki2hz-35591351.manusvm.computer/vendors |
| Community | https://3000-ic2iugij0fdx41p6ki2hz-35591351.manusvm.computer/social |

### User Pages

| Page | Development URL |
|------|-----------------|
| Dashboard | https://3000-ic2iugij0fdx41p6ki2hz-35591351.manusvm.computer/dashboard |
| My Bookings | https://3000-ic2iugij0fdx41p6ki2hz-35591351.manusvm.computer/bookings |

### Business Portals

| Portal | Development URL |
|--------|-----------------|
| **Super Admin** | https://3000-ic2iugij0fdx41p6ki2hz-35591351.manusvm.computer/admin |
| **Partner Portal** | https://3000-ic2iugij0fdx41p6ki2hz-35591351.manusvm.computer/partner |
| **Agent Portal** | https://3000-ic2iugij0fdx41p6ki2hz-35591351.manusvm.computer/agent |

---

## API Endpoints

### Base API URL
- **Production:** `https://owambe.com/api`
- **Development:** `https://3000-ic2iugij0fdx41p6ki2hz-35591351.manusvm.computer/api`

### Authentication
- **OAuth Callback:** `/api/oauth/callback`
- **Logout:** Via tRPC `auth.logout` mutation

### tRPC Endpoints
All tRPC endpoints are accessed via `/api/trpc/{router}.{procedure}`

**Example:**
```
GET /api/trpc/events.list
GET /api/trpc/venues.getById?input={"id":"venue123"}
POST /api/trpc/bookings.create
```

### Payment Webhook
- **Paystack Webhook:** `/api/payment/webhook`

---

## Role-Based Access Control

### Super Admin Portal (`/admin`)
**Access Requirements:**
- User must be authenticated
- User role must be `admin`
- Configured via `OWNER_OPEN_ID` environment variable

**Features:**
- User management
- Partner approval and management
- Agent oversight
- Content moderation
- Support ticket system
- Platform settings
- Commission rate configuration
- System-wide analytics

### Partner Portal (`/partner`)
**Access Requirements:**
- User must be authenticated
- User must be registered as a partner (B2B account)

**Features:**
- Business dashboard
- Venue/hotel listing management
- Booking management
- Dynamic calendar
- Discount campaigns
- GDS distribution channels
- Performance analytics

### Agent Portal (`/agent`)
**Access Requirements:**
- User must be authenticated
- User must apply and be approved as an agent

**Features:**
- Agent application form (for new agents)
- Product showcase
- Referral link generation
- Commission tracking
- Wallet management
- Withdrawal requests
- Customer relationship management
- Performance analytics

---

## Deep Linking Examples

### Booking Flow
1. User browses events: `/events`
2. User clicks event: `/events/{eventId}`
3. User books event: `/checkout/{bookingId}`
4. Payment verification: `/payment/verify?reference={paymentRef}`
5. View booking: `/bookings`

### Partner Flow
1. Partner logs in and goes to: `/partner`
2. Manages venues: `/partner` (Venues tab)
3. Views bookings: `/partner` (Bookings tab)
4. Checks analytics: `/partner` (Analytics tab)

### Agent Flow
1. New user applies: `/agent` (Application form)
2. Approved agent logs in: `/agent` (Dashboard)
3. Generates referral link: `/agent` (Referrals tab)
4. Tracks commissions: `/agent` (Commissions tab)
5. Requests withdrawal: `/agent` (Wallet tab)

---

## URL Parameters

### Event Detail
- **Parameter:** `eventId` (string)
- **Example:** `/events/Pn1zrNs_xVTyaTY64PBWd`

### Venue Detail
- **Parameter:** `venueId` (string)
- **Example:** `/venues/75kp5LVaOC7UPpTRkky4q`

### Hotel Detail
- **Parameter:** `hotelId` (string)
- **Example:** `/hotels/4rABe4zCs-ogwOzLslmZM`

### Vendor Detail
- **Parameter:** `vendorId` (string)
- **Example:** `/vendors/vendor123`

### Checkout
- **Parameter:** `bookingId` (string)
- **Example:** `/checkout/booking123`

### Payment Verification
- **Query Parameters:**
  - `reference` - Paystack payment reference
  - `trxref` - Transaction reference
  - `status` - Payment status
- **Example:** `/payment/verify?reference=abc123&status=success`

---

## Redirects and Navigation

### After Login
Users are redirected based on the page they were trying to access:
- If accessing `/admin` → Super Admin Dashboard
- If accessing `/partner` → Partner Dashboard
- If accessing `/agent` → Agent Dashboard
- If accessing booking page → Complete booking
- Default → User Dashboard (`/dashboard`)

### After Successful Booking
1. Booking created → Redirect to `/checkout/{bookingId}`
2. Payment completed → Redirect to `/payment/verify`
3. Verification success → Redirect to `/bookings`

### After Logout
- Redirect to homepage (`/`)

---

## Custom Domain Setup

When deploying to production with your own domain:

1. **Update Environment Variables:**
```env
VITE_APP_URL=https://owambe.com
```

2. **Configure DNS:**
```
A Record: @ → Your Server IP
A Record: www → Your Server IP
```

3. **Update Paystack Webhook:**
```
https://owambe.com/api/payment/webhook
```

4. **Update OAuth Redirect:**
```
https://owambe.com/api/oauth/callback
```

---

## URL Best Practices

### For Marketing
- **Homepage:** Share `https://owambe.com/`
- **Events:** Share `https://owambe.com/events`
- **Specific Event:** Share direct event URL with ID

### For Partners
- **Partner Registration:** Direct to `https://owambe.com/partner`
- **Partner Resources:** Provide partner portal URL in onboarding emails

### For Agents
- **Agent Application:** Direct to `https://owambe.com/agent`
- **Agent Training:** Provide agent portal URL in approval emails

### For Support
- **Help Users:** Direct to relevant detail pages
- **Booking Issues:** Use booking ID to locate specific booking
- **Payment Issues:** Use payment reference for tracking

---

## URL Shortening (Optional)

For marketing campaigns, consider URL shortening:

**Examples:**
- `owambe.com/e/summer-fest` → `/events/{eventId}`
- `owambe.com/v/grand-ballroom` → `/venues/{venueId}`
- `owambe.com/h/luxury-hotel` → `/hotels/{hotelId}`

This requires implementing URL redirects in your server configuration.

---

## Security Considerations

### Protected Routes
The following routes require authentication:
- `/dashboard`
- `/bookings`
- `/checkout/*`
- `/admin`
- `/partner`
- `/agent`

### Role Verification
- Super Admin routes verify `user.role === 'admin'`
- Partner routes verify partner registration
- Agent routes verify agent approval status

### HTTPS Enforcement
All production URLs must use HTTPS for security:
- Protects user credentials
- Secures payment information
- Prevents man-in-the-middle attacks

---

## Monitoring and Analytics

### Track These URLs
- Most visited pages
- Conversion rates (detail page → booking)
- Bounce rates
- User flow through booking process

### Key Metrics by URL
- `/events` → Event discovery rate
- `/events/{id}` → Event conversion rate
- `/checkout/{id}` → Checkout completion rate
- `/payment/verify` → Payment success rate

---

## Support and Documentation

For questions about URLs or routing:
- See technical documentation in `/docs`
- Check `client/src/App.tsx` for route definitions
- Review `server/routers.ts` for API endpoints

---

*This document should be updated whenever new routes or portals are added to the platform.*

