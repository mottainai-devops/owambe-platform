# Software Requirements Specification (SRS)
## Owambe Platform - Event, Venue & Hotel Booking with Social Commerce

**Version:** 1.0  
**Date:** October 23, 2025  
**Project:** Owambe Platform  
**Document Status:** Final

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [System Features](#3-system-features)
4. [External Interface Requirements](#4-external-interface-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [Database Requirements](#6-database-requirements)

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) document provides a complete description of the Owambe Platform - a comprehensive event management, venue booking, hotel reservation, and social commerce platform for the Nigerian market.

### 1.2 Scope
The Owambe Platform consists of:
- **B2C Platform** (owambe.com) - Customer-facing marketplace
- **B2B Partner Portal** (partner.owambe.com) - Business management dashboard
- **Social Commerce Module** - Community engagement and marketplace
- **Vendor Marketplace** - Service provider directory

### 1.3 Definitions, Acronyms, and Abbreviations
- **B2C**: Business to Consumer
- **B2B**: Business to Business
- **GDS**: Global Distribution System
- **tRPC**: TypeScript Remote Procedure Call
- **SPA**: Single Page Application

### 1.4 References
- Technical Design Document
- API Documentation
- Database Schema Documentation

---

## 2. Overall Description

### 2.1 Product Perspective
Owambe Platform is a standalone web application that serves as a marketplace connecting:
- Event organizers with attendees
- Venue owners with event planners
- Hotel operators with travelers
- Service vendors with customers
- Community members for social engagement

### 2.2 Product Functions

#### 2.2.1 User Functions
- Browse and search events, venues, hotels, and vendors
- Book tickets and services
- Manage bookings, wishlist, and shopping cart
- Participate in community discussions
- Like, comment, and share content
- Track booking history and preferences

#### 2.2.2 Partner Functions
- List and manage properties (venues/hotels)
- Create and manage vendor profiles
- Post products/services to community
- Manage bookings and availability
- Set pricing and discounts
- Track analytics and performance
- Manage distribution channels (GDS)

### 2.3 User Classes and Characteristics

#### 2.3.1 End Users (Customers)
- **Characteristics**: Event attendees, travelers, service seekers
- **Technical Expertise**: Basic to intermediate
- **Primary Activities**: Browsing, booking, social engagement

#### 2.3.2 Partners (Business Owners)
- **Characteristics**: Venue owners, hotel operators, event vendors
- **Technical Expertise**: Intermediate
- **Primary Activities**: Listing management, booking management, analytics

#### 2.3.3 Administrators
- **Characteristics**: Platform operators
- **Technical Expertise**: Advanced
- **Primary Activities**: User management, content moderation, system monitoring

### 2.4 Operating Environment
- **Client**: Modern web browsers (Chrome, Firefox, Safari, Edge)
- **Server**: Node.js runtime environment
- **Database**: MySQL/TiDB
- **Storage**: AWS S3 or compatible object storage
- **Deployment**: Cloud infrastructure (AWS, Azure, GCP, or VPS)

### 2.5 Design and Implementation Constraints
- Must support mobile and desktop browsers
- Must comply with data protection regulations
- Must handle concurrent users efficiently
- Must integrate with payment gateways
- Must support real-time updates for bookings

---

## 3. System Features

### 3.1 Event Management

#### 3.1.1 Description
Complete event lifecycle management from creation to booking and attendance.

#### 3.1.2 Functional Requirements

**FR-EM-001**: Event Listing
- System shall display all active events with filtering options
- System shall show event details including date, location, price, capacity
- System shall support search by title, category, location, date range

**FR-EM-002**: Event Detail Page
- System shall display comprehensive event information
- System shall show available tickets and pricing tiers
- System shall provide booking interface with quantity selection
- System shall calculate total price dynamically

**FR-EM-003**: Event Booking
- System shall validate ticket availability before booking
- System shall create booking record with user information
- System shall send booking confirmation
- System shall update event capacity

**FR-EM-004**: Event Categories
- Weddings
- Corporate Events
- Birthdays
- Concerts
- Conferences
- Social Gatherings

### 3.2 Venue Management

#### 3.2.1 Description
Venue listing, search, and booking functionality.

#### 3.2.2 Functional Requirements

**FR-VM-001**: Venue Listing
- System shall display all available venues
- System shall show venue capacity, amenities, pricing
- System shall support filtering by location, capacity, price range

**FR-VM-002**: Venue Booking
- System shall allow date range selection
- System shall check availability for selected dates
- System shall calculate pricing based on duration
- System shall handle booking conflicts

### 3.3 Hotel Management

#### 3.3.1 Description
Hotel accommodation booking system.

#### 3.3.2 Functional Requirements

**FR-HM-001**: Hotel Listing
- System shall display available hotels
- System shall show room types, amenities, pricing
- System shall support search by location, dates, guest count

**FR-HM-002**: Room Booking
- System shall display available rooms for selected dates
- System shall handle check-in/check-out dates
- System shall calculate total cost including taxes
- System shall manage room inventory

### 3.4 Vendor Marketplace

#### 3.4.1 Description
Service provider directory with dynamic booking flows.

#### 3.4.2 Functional Requirements

**FR-VD-001**: Vendor Types
- Catering Services
- Photography & Videography
- Entertainment (DJs, Bands, MCs)
- Event Decoration
- Event Planning & Coordination

**FR-VD-002**: Vendor Profiles
- System shall display vendor business information
- System shall show portfolio images
- System shall display service packages with pricing
- System shall show ratings and reviews
- System shall highlight special perks and offers

**FR-VD-003**: Dynamic Booking Flow
- System shall adapt booking form based on vendor type
- System shall support package selection
- System shall collect event-specific information
- System shall calculate deposits (30% default)
- System shall send booking requests to vendors

### 3.5 Social Commerce Module

#### 3.5.1 Description
Community engagement platform with marketplace features.

#### 3.5.2 Functional Requirements

**FR-SC-001**: User Posts
- System shall allow users to create text posts
- System shall support liking and commenting
- System shall display post engagement metrics
- System shall show chronological feed

**FR-SC-002**: Partner Posts
- System shall allow partners to post products/services
- System shall support multiple images per post
- System shall include pricing information
- System shall link to actual listings
- System shall track views, likes, comments

**FR-SC-003**: Personalized Feed
- System shall track user interests based on interactions
- System shall recommend relevant content
- System shall mix user posts and partner offers
- System shall prioritize recent and engaging content

**FR-SC-004**: Engagement Features
- Like posts
- Comment on posts
- Add items to cart from posts
- Add items to wishlist from posts
- Share posts (future enhancement)

### 3.6 User Dashboard

#### 3.6.1 Description
Centralized hub for user activities and management.

#### 3.6.2 Functional Requirements

**FR-UD-001**: Dashboard Overview
- Display total bookings count
- Display wishlist items count
- Display cart items count
- Display user posts count

**FR-UD-002**: Bookings Tab
- List all user bookings (events, venues, hotels, vendors)
- Show booking status (pending, confirmed, completed, cancelled)
- Display booking details and dates
- Show payment information

**FR-UD-003**: Wishlist Tab
- Display saved items across all categories
- Allow removal from wishlist
- Provide quick access to item details
- Show date added

**FR-UD-004**: Cart Tab
- Display items ready for checkout
- Show quantity and options
- Allow item removal
- Calculate total cost
- Provide checkout button

**FR-UD-005**: My Posts Tab
- Display user's community posts
- Show engagement metrics (likes, comments)
- Allow post editing/deletion
- Show post date

**FR-UD-006**: Liked Tab
- Display posts user has liked
- Show post preview
- Provide quick navigation to full posts

### 3.7 Partner Dashboard

#### 3.7.1 Description
Business management interface for partners.

#### 3.7.2 Functional Requirements

**FR-PD-001**: Analytics Overview
- Display total revenue with growth percentage
- Show total bookings with trend
- Display active listings count
- Show average rating

**FR-PD-002**: Booking Management
- List all incoming bookings
- Show booking details and customer information
- Allow approval/rejection of bookings
- Update booking status
- View booking calendar

**FR-PD-003**: Calendar Management
- Visual calendar showing availability
- Block/unblock dates
- Set pricing for specific dates
- View occupancy rates
- Manage seasonal pricing

**FR-PD-004**: Discount Module
- Create promotional codes
- Set discount percentages
- Define validity periods
- Set usage limits
- Track redemptions

**FR-PD-005**: GDS Distribution
- Connect to distribution channels
- Manage channel-specific pricing
- Track bookings by channel
- Enable/disable channels
- View channel performance

**FR-PD-006**: Listing Management
- Create new listings
- Edit existing listings
- Upload images
- Set pricing and availability
- Manage amenities and features

### 3.8 Authentication & Authorization

#### 3.8.1 Functional Requirements

**FR-AA-001**: User Authentication
- OAuth-based login via Manus
- Session management with JWT
- Automatic session refresh
- Secure logout

**FR-AA-002**: Role-Based Access
- User role (default)
- Admin role (elevated privileges)
- Partner role (business features)
- Role-specific navigation and features

---

## 4. External Interface Requirements

### 4.1 User Interfaces

#### 4.1.1 General UI Requirements
- Responsive design for mobile, tablet, desktop
- Consistent color scheme (purple/blue primary)
- Accessible navigation
- Loading states for async operations
- Error messages and validation feedback

#### 4.1.2 Key Pages

**Homepage**
- Hero section with call-to-action
- Featured events showcase
- Statistics dashboard
- Why choose us section
- Footer with links

**Event Detail Page**
- Hero image with event title
- Event information (date, time, location, capacity)
- Ticket selection widget
- Booking button
- Event description

**Vendor Detail Page**
- Hero image with vendor name
- Business information and stats
- Portfolio gallery
- Service packages with pricing
- Special perks section
- Booking dialog

**User Dashboard**
- Stats overview cards
- Tabbed interface (Bookings, Wishlist, Cart, Posts, Likes)
- Action buttons for each tab
- Empty states with CTAs

**Partner Dashboard**
- Analytics cards with trends
- Tabbed interface (Bookings, Calendar, Discounts, Distribution)
- Data tables for bookings
- Interactive calendar
- Forms for creating discounts

**Social/Community Page**
- Create post button
- Feed tabs (All Posts, Partner Offers, Your Feed)
- Post cards with engagement
- Comment interface
- Like/Cart/Wishlist buttons

### 4.2 Hardware Interfaces
- No direct hardware interfaces required
- Standard web browser capabilities

### 4.3 Software Interfaces

#### 4.3.1 Database Interface
- MySQL/TiDB database
- Drizzle ORM for queries
- Connection pooling
- Transaction support

#### 4.3.2 Storage Interface
- S3-compatible object storage
- File upload/download via presigned URLs
- Image optimization

#### 4.3.3 Authentication Interface
- Manus OAuth server
- JWT token generation and validation
- Session cookie management

### 4.4 Communication Interfaces

#### 4.4.1 HTTP/HTTPS
- RESTful API endpoints
- tRPC for type-safe RPC calls
- JSON data format
- HTTPS for production

#### 4.4.2 WebSocket (Future)
- Real-time notifications
- Live booking updates
- Chat functionality

---

## 5. Non-Functional Requirements

### 5.1 Performance Requirements

**NFR-P-001**: Response Time
- Page load time < 3 seconds
- API response time < 500ms
- Search results < 1 second

**NFR-P-002**: Throughput
- Support 1000+ concurrent users
- Handle 100+ bookings per minute
- Process 1000+ API requests per second

**NFR-P-003**: Scalability
- Horizontal scaling capability
- Database read replicas
- CDN for static assets
- Load balancing

### 5.2 Security Requirements

**NFR-S-001**: Authentication
- Secure OAuth implementation
- JWT with expiration
- HTTPS only in production
- CSRF protection

**NFR-S-002**: Data Protection
- Encrypted database connections
- Secure password storage (if applicable)
- Input validation and sanitization
- SQL injection prevention

**NFR-S-003**: Authorization
- Role-based access control
- Protected API endpoints
- Resource ownership validation

### 5.3 Reliability Requirements

**NFR-R-001**: Availability
- 99.9% uptime target
- Graceful degradation
- Error recovery mechanisms

**NFR-R-002**: Data Integrity
- Transaction support for bookings
- Backup and recovery procedures
- Data validation at all layers

### 5.4 Maintainability Requirements

**NFR-M-001**: Code Quality
- TypeScript for type safety
- Consistent code style
- Comprehensive comments
- Modular architecture

**NFR-M-002**: Documentation
- API documentation
- Deployment guides
- User manuals
- Technical design docs

### 5.5 Usability Requirements

**NFR-U-001**: User Experience
- Intuitive navigation
- Clear call-to-actions
- Helpful error messages
- Consistent UI patterns

**NFR-U-002**: Accessibility
- WCAG 2.1 Level AA compliance
- Keyboard navigation
- Screen reader support
- High contrast mode

---

## 6. Database Requirements

### 6.1 Database Schema

#### 6.1.1 Core Tables

**users**
- User authentication and profile information
- Roles: user, admin
- OAuth integration

**events**
- Event listings with details
- Categories, pricing, capacity
- Location and date information

**venues**
- Venue listings
- Capacity, amenities, pricing
- Location and contact information

**hotels**
- Hotel listings
- Room types, amenities, pricing
- Location and contact information

**vendors**
- Service provider profiles
- Vendor types, offerings, portfolio
- Ratings and reviews

#### 6.1.2 Booking Tables

**bookings**
- Event, venue, and hotel bookings
- User information
- Payment status
- Booking dates

**vendorBookings**
- Vendor service bookings
- Event details
- Selected packages
- Custom requirements

#### 6.1.3 Social Commerce Tables

**posts**
- User-generated content
- Engagement metrics
- Timestamps

**partnerPosts**
- Partner product/service listings
- Images, pricing, categories
- Engagement metrics

**likes**
- Post likes tracking
- User and post references

**comments**
- Post comments
- User and post references

**cart**
- Shopping cart items
- Item type and quantity
- Selected options

**wishlist**
- Saved items
- Item type and references

**userInterests**
- User preference tracking
- Category-based interests

#### 6.1.4 Partner Management Tables

**b2bPartners**
- Partner business information
- Subscription and status

**availability**
- Calendar availability
- Date ranges and status

**discounts**
- Promotional codes
- Validity and usage tracking

**gdsChannels**
- Distribution channel definitions
- Channel configuration

**propertyDistribution**
- Property-channel mappings
- Channel-specific settings

#### 6.1.5 Supporting Tables

**payments**
- Payment transactions
- Amount, status, method

**vendorReviews**
- Vendor ratings and reviews
- User feedback

**follows**
- User follow relationships
- Social connections

### 6.2 Data Integrity

**Referential Integrity**
- Foreign key constraints where applicable
- Cascade deletes for dependent records
- Orphan record prevention

**Data Validation**
- Required field enforcement
- Data type validation
- Range and format checks

### 6.3 Data Retention

**Active Data**
- Current bookings: Indefinite
- User profiles: Until account deletion
- Posts and comments: Until deletion

**Archived Data**
- Completed bookings: 2 years
- Cancelled bookings: 1 year
- Analytics data: 5 years

---

## 7. Appendices

### 7.1 Assumptions and Dependencies

**Assumptions**
- Users have modern web browsers
- Internet connectivity is available
- Payment gateway integration will be added
- Email service will be configured

**Dependencies**
- Manus OAuth service
- MySQL/TiDB database
- S3-compatible storage
- Node.js runtime
- SMTP email service (future)

### 7.2 Future Enhancements

**Phase 2 Features**
- Payment gateway integration (Paystack, Flutterwave)
- Email notifications
- SMS notifications
- Advanced search with filters
- Map integration for locations
- Reviews and ratings system
- Chat/messaging between users and partners
- Mobile applications (iOS, Android)
- Multi-language support
- Currency conversion
- Advanced analytics and reporting
- Referral program
- Loyalty rewards
- Event check-in system
- QR code tickets

---

**Document Approval**

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Project Manager | | | |
| Technical Lead | | | |
| Product Owner | | | |

---

**Revision History**

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | Oct 23, 2025 | Development Team | Initial SRS document |

