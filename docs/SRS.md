# Software Requirements Specification (SRS)
## Owambe Platform - Complete Event, Venue & Hotel Booking with Social Commerce

**Version:** 2.0 (Updated)  
**Date:** October 23, 2025  
**Project:** Owambe Platform  
**Document Status:** Final - Complete System

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [System Features](#3-system-features)
4. [External Interface Requirements](#4-external-interface-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [Database Requirements](#6-database-requirements)
7. [Security Requirements](#7-security-requirements)

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) document provides a complete description of the Owambe Platform - a comprehensive event management, venue booking, hotel reservation, vendor marketplace, and social commerce platform with agent sales network and super admin management capabilities for the Nigerian market.

### 1.2 Scope
The Owambe Platform consists of:
- **B2C Platform** (owambe.com) - Customer-facing marketplace
- **B2B Partner Portal** (partner.owambe.com) - Business management dashboard
- **Agent Portal** - Sales agent network with commission tracking
- **Super Admin Portal** - Platform-wide management and oversight
- **Social Commerce Module** - Community engagement and marketplace
- **Vendor Marketplace** - Service provider directory
- **Payment Integration** - Paystack payment processing
- **Notification System** - Multi-channel user notifications
- **Messaging System** - Direct communication between users
- **Loyalty Program** - Points and rewards system
- **Referral Program** - User and agent referral tracking

### 1.3 Definitions, Acronyms, and Abbreviations
- **B2C**: Business to Consumer
- **B2B**: Business to Business
- **GDS**: Global Distribution System
- **tRPC**: TypeScript Remote Procedure Call
- **SPA**: Single Page Application
- **CRM**: Customer Relationship Management
- **KYC**: Know Your Customer
- **OAuth**: Open Authorization

### 1.4 References
- Technical Design Document (Updated)
- API Documentation (tRPC)
- Database Schema Documentation (54 tables)
- Deployment Guide
- URL Reference Guide

---

## 2. Overall Description

### 2.1 Product Perspective
The Owambe Platform is a standalone web application that integrates with external services for payment processing (Paystack), authentication (Manus OAuth), and cloud storage (S3). The system operates on a modern tech stack with React frontend, Express backend, and MySQL/TiDB database.

**System Architecture:**
- **Frontend**: React 19 + Tailwind CSS 4 + shadcn/ui
- **Backend**: Express 4 + tRPC 11
- **Database**: MySQL 8.0+ / TiDB Cloud
- **Authentication**: Manus OAuth + JWT
- **Payment**: Paystack
- **Storage**: S3-compatible object storage

### 2.2 Product Functions
The platform provides the following major functions:

#### 2.2.1 Customer Functions (B2C)
- Browse and search events, venues, hotels, and vendors
- View detailed information with images and amenities
- Book services with date/time selection
- Make secure payments via Paystack
- Track bookings and payment history
- Participate in social community
- Earn and redeem loyalty points
- Refer friends for rewards
- Manage personal dashboard
- Add items to cart and wishlist
- Receive notifications

#### 2.2.2 Partner Functions (B2B)
- Register and manage business profile
- List venues and hotels with details
- Manage availability calendar
- Accept/reject booking requests
- Create discount campaigns
- Distribute inventory via GDS channels
- View performance analytics
- Respond to customer reviews
- Track revenue and bookings

#### 2.2.3 Agent Functions
- Apply to become sales agent
- Generate unique referral links
- Showcase all platform products
- Track referrals and conversions
- Earn commissions on sales
- Manage commission wallet
- Request withdrawals
- Manage customer relationships
- View performance metrics
- Track sales targets

#### 2.2.4 Vendor Functions
- Register as service provider
- Create service packages
- Manage bookings
- Set pricing and availability
- Receive customer reviews
- Track business performance

#### 2.2.5 Super Admin Functions
- Manage all users (customers, partners, agents, vendors)
- Approve/reject partner applications
- Approve/reject agent applications
- Moderate content and reviews
- Handle support tickets
- Configure platform settings
- Set commission rates
- View platform-wide analytics
- Manage system notifications
- Monitor payment transactions
- Generate reports

### 2.3 User Classes and Characteristics

#### 2.3.1 Customers (End Users)
- **Technical Expertise**: Low to medium
- **Frequency of Use**: Occasional to frequent
- **Primary Goals**: Find and book events/venues/hotels easily
- **Access Level**: Public pages + authenticated user pages

#### 2.3.2 Partners (Business Owners)
- **Technical Expertise**: Medium
- **Frequency of Use**: Daily
- **Primary Goals**: Manage listings, maximize bookings, track revenue
- **Access Level**: Partner portal with business management tools

#### 2.3.3 Agents (Sales Representatives)
- **Technical Expertise**: Low to medium
- **Frequency of Use**: Daily
- **Primary Goals**: Generate sales, earn commissions, grow customer base
- **Access Level**: Agent portal with sales tools

#### 2.3.4 Vendors (Service Providers)
- **Technical Expertise**: Low to medium
- **Frequency of Use**: Regular
- **Primary Goals**: Receive bookings, provide services, build reputation
- **Access Level**: Vendor management interface

#### 2.3.5 Super Admins (Platform Managers)
- **Technical Expertise**: High
- **Frequency of Use**: Daily
- **Primary Goals**: Platform oversight, user management, system health
- **Access Level**: Full platform access with administrative privileges

### 2.4 Operating Environment
- **Client**: Modern web browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- **Server**: Ubuntu 22.04 LTS or compatible Linux distribution
- **Database**: MySQL 8.0+ or TiDB Cloud
- **Runtime**: Node.js 22.13.0
- **Minimum Server**: 2 CPU cores, 4GB RAM, 20GB SSD
- **Recommended Server**: 4 CPU cores, 8GB RAM, 50GB SSD

### 2.5 Design and Implementation Constraints
- Must use TypeScript for type safety
- Must use tRPC for API layer
- Must integrate with Paystack for payments
- Must use Manus OAuth for authentication
- Must support mobile responsive design
- Must comply with Nigerian data protection regulations
- Must handle Nigerian Naira (₦) currency
- Must support West Africa Time (WAT) timezone

### 2.6 Assumptions and Dependencies
- **Assumptions**:
  - Users have stable internet connection
  - Users have modern web browsers
  - Payment gateway (Paystack) is available
  - OAuth provider (Manus) is operational
  
- **Dependencies**:
  - Paystack API for payment processing
  - Manus OAuth for authentication
  - S3-compatible storage for file uploads
  - MySQL/TiDB for data persistence
  - SMTP server for email notifications (optional)

---

## 3. System Features

### 3.1 User Management

#### 3.1.1 User Registration and Authentication
**Priority**: High  
**Description**: Users can register and authenticate using Manus OAuth

**Functional Requirements**:
- FR-1.1.1: System shall redirect users to Manus OAuth portal for authentication
- FR-1.1.2: System shall create user profile upon first login
- FR-1.1.3: System shall maintain user session with JWT tokens
- FR-1.1.4: System shall support logout functionality
- FR-1.1.5: System shall automatically assign owner as admin based on OWNER_OPEN_ID

#### 3.1.2 User Profile Management
**Priority**: Medium  
**Description**: Users can view and manage their profile information

**Functional Requirements**:
- FR-1.2.1: System shall display user name, email, and login method
- FR-1.2.2: System shall track user creation date and last sign-in
- FR-1.2.3: System shall support user role assignment (user, admin)

### 3.2 Event Management

#### 3.2.1 Event Listing
**Priority**: High  
**Description**: Display all available events with filtering and search

**Functional Requirements**:
- FR-2.1.1: System shall display events with image, title, date, location, price
- FR-2.1.2: System shall support event category filtering
- FR-2.1.3: System shall support search by event name and description
- FR-2.1.4: System shall display event capacity and availability

#### 3.2.2 Event Detail View
**Priority**: High  
**Description**: Show complete event information with booking capability

**Functional Requirements**:
- FR-2.2.1: System shall display full event description and images
- FR-2.2.2: System shall show event date, time, location, capacity
- FR-2.2.3: System shall display ticket pricing
- FR-2.2.4: System shall allow ticket quantity selection
- FR-2.2.5: System shall calculate total price dynamically
- FR-2.2.6: System shall provide "Book Now" functionality

#### 3.2.3 Event Booking
**Priority**: High  
**Description**: Users can book event tickets

**Functional Requirements**:
- FR-2.3.1: System shall require authentication for booking
- FR-2.3.2: System shall create booking record with pending status
- FR-2.3.3: System shall redirect to checkout for payment
- FR-2.3.4: System shall update booking status after payment
- FR-2.3.5: System shall send booking confirmation notification

### 3.3 Venue Management

#### 3.3.1 Venue Listing
**Priority**: High  
**Description**: Display all available venues with details

**Functional Requirements**:
- FR-3.1.1: System shall display venues with images and key information
- FR-3.1.2: System shall show venue capacity and pricing
- FR-3.1.3: System shall display venue amenities
- FR-3.1.4: System shall support location-based filtering

#### 3.3.2 Venue Detail and Booking
**Priority**: High  
**Description**: Show venue details with booking form

**Functional Requirements**:
- FR-3.2.1: System shall display complete venue information
- FR-3.2.2: System shall provide date selection for booking
- FR-3.2.3: System shall allow guest count specification
- FR-3.2.4: System shall validate capacity limits
- FR-3.2.5: System shall create booking with venue-specific details

### 3.4 Hotel Management

#### 3.4.1 Hotel Listing
**Priority**: High  
**Description**: Display all available hotels with star ratings

**Functional Requirements**:
- FR-4.1.1: System shall display hotels with images and ratings
- FR-4.1.2: System shall show price per night
- FR-4.1.3: System shall display hotel amenities
- FR-4.1.4: System shall support star rating filtering

#### 3.4.2 Hotel Detail and Booking
**Priority**: High  
**Description**: Show hotel details with room booking

**Functional Requirements**:
- FR-4.2.1: System shall display hotel information and amenities
- FR-4.2.2: System shall provide check-in and check-out date selection
- FR-4.2.3: System shall allow room quantity selection
- FR-4.2.4: System shall calculate total for multiple nights
- FR-4.2.5: System shall validate date ranges

### 3.5 Vendor Marketplace

#### 3.5.1 Vendor Listing
**Priority**: High  
**Description**: Display event vendors by category

**Functional Requirements**:
- FR-5.1.1: System shall categorize vendors (catering, photography, entertainment, decoration, planning)
- FR-5.1.2: System shall display vendor portfolios
- FR-5.1.3: System shall show verification badges
- FR-5.1.4: System shall display vendor ratings

#### 3.5.2 Vendor Booking
**Priority**: High  
**Description**: Dynamic booking flow based on vendor type

**Functional Requirements**:
- FR-5.2.1: System shall display vendor service packages
- FR-5.2.2: System shall show package inclusions and pricing
- FR-5.2.3: System shall adapt booking form to vendor type
- FR-5.2.4: System shall calculate deposits (30%)
- FR-5.2.5: System shall display vendor perks

### 3.6 Payment Processing

#### 3.6.1 Paystack Integration
**Priority**: Critical  
**Description**: Secure payment processing via Paystack

**Functional Requirements**:
- FR-6.1.1: System shall initialize payment with Paystack
- FR-6.1.2: System shall redirect to Paystack payment page
- FR-6.1.3: System shall verify payment via Paystack API
- FR-6.1.4: System shall handle payment webhooks
- FR-6.1.5: System shall update booking status on successful payment
- FR-6.1.6: System shall process agent commissions automatically
- FR-6.1.7: System shall support payment refunds
- FR-6.1.8: System shall handle payment disputes

#### 3.6.2 Checkout Process
**Priority**: High  
**Description**: User-friendly checkout experience

**Functional Requirements**:
- FR-6.2.1: System shall display booking summary
- FR-6.2.2: System shall show total amount in Naira
- FR-6.2.3: System shall provide payment button
- FR-6.2.4: System shall handle payment success/failure
- FR-6.2.5: System shall redirect to verification page

### 3.7 Agent System

#### 3.7.1 Agent Application
**Priority**: High  
**Description**: Users can apply to become sales agents

**Functional Requirements**:
- FR-7.1.1: System shall provide agent application form
- FR-7.1.2: System shall collect agent business information
- FR-7.1.3: System shall submit application for admin approval
- FR-7.1.4: System shall notify applicant of status

#### 3.7.2 Agent Dashboard
**Priority**: High  
**Description**: Agent portal for sales management

**Functional Requirements**:
- FR-7.2.1: System shall display agent overview (wallet, earnings, referrals)
- FR-7.2.2: System shall show all bookable products
- FR-7.2.3: System shall generate unique referral links
- FR-7.2.4: System shall track referral conversions
- FR-7.2.5: System shall calculate commissions on sales
- FR-7.2.6: System shall display commission wallet balance
- FR-7.2.7: System shall allow withdrawal requests
- FR-7.2.8: System shall show customer list
- FR-7.2.9: System shall display performance analytics
- FR-7.2.10: System shall track sales targets

#### 3.7.3 Commission Management
**Priority**: High  
**Description**: Automated commission calculation and tracking

**Functional Requirements**:
- FR-7.3.1: System shall calculate commission on successful bookings
- FR-7.3.2: System shall credit agent wallet automatically
- FR-7.3.3: System shall maintain commission transaction history
- FR-7.3.4: System shall support commission rate configuration
- FR-7.3.5: System shall process withdrawal requests

### 3.8 Super Admin Portal

#### 3.8.1 User Management
**Priority**: High  
**Description**: Admin can manage all platform users

**Functional Requirements**:
- FR-8.1.1: System shall display all users with filters
- FR-8.1.2: System shall allow user role modification
- FR-8.1.3: System shall support user suspension/activation
- FR-8.1.4: System shall show user activity logs

#### 3.8.2 Partner Management
**Priority**: High  
**Description**: Admin can manage business partners

**Functional Requirements**:
- FR-8.2.1: System shall display partner applications
- FR-8.2.2: System shall allow partner approval/rejection
- FR-8.2.3: System shall manage partner listings
- FR-8.2.4: System shall view partner analytics

#### 3.8.3 Agent Management
**Priority**: High  
**Description**: Admin can oversee agent network

**Functional Requirements**:
- FR-8.3.1: System shall display agent applications
- FR-8.3.2: System shall approve/reject agent applications
- FR-8.3.3: System shall view agent performance
- FR-8.3.4: System shall process agent withdrawals
- FR-8.3.5: System shall configure commission rates

#### 3.8.4 Content Moderation
**Priority**: Medium  
**Description**: Admin can moderate platform content

**Functional Requirements**:
- FR-8.4.1: System shall display pending content for review
- FR-8.4.2: System shall allow content approval/rejection
- FR-8.4.3: System shall moderate user reviews
- FR-8.4.4: System shall manage social posts

#### 3.8.5 Support System
**Priority**: High  
**Description**: Admin can manage support tickets

**Functional Requirements**:
- FR-8.5.1: System shall display all support tickets
- FR-8.5.2: System shall allow ticket assignment
- FR-8.5.3: System shall support ticket messaging
- FR-8.5.4: System shall track ticket resolution

#### 3.8.6 Platform Configuration
**Priority**: Medium  
**Description**: Admin can configure system settings

**Functional Requirements**:
- FR-8.6.1: System shall allow commission rate configuration
- FR-8.6.2: System shall manage platform settings
- FR-8.6.3: System shall configure notification templates
- FR-8.6.4: System shall set business rules

#### 3.8.7 Analytics and Reporting
**Priority**: High  
**Description**: Admin can view platform analytics

**Functional Requirements**:
- FR-8.7.1: System shall display platform-wide metrics
- FR-8.7.2: System shall show revenue analytics
- FR-8.7.3: System shall track user growth
- FR-8.7.4: System shall generate reports

### 3.9 Partner Portal

#### 3.9.1 Business Dashboard
**Priority**: High  
**Description**: Partners can manage their business

**Functional Requirements**:
- FR-9.1.1: System shall display business overview
- FR-9.1.2: System shall show revenue and bookings
- FR-9.1.3: System shall display active listings
- FR-9.1.4: System shall show average ratings

#### 3.9.2 Listing Management
**Priority**: High  
**Description**: Partners can manage venues and hotels

**Functional Requirements**:
- FR-9.2.1: System shall allow adding new listings
- FR-9.2.2: System shall support listing editing
- FR-9.2.3: System shall manage listing images
- FR-9.2.4: System shall set pricing and capacity

#### 3.9.3 Booking Management
**Priority**: High  
**Description**: Partners can manage incoming bookings

**Functional Requirements**:
- FR-9.3.1: System shall display all bookings
- FR-9.3.2: System shall filter by status
- FR-9.3.3: System shall allow booking approval/rejection
- FR-9.3.4: System shall show booking details

#### 3.9.4 Calendar Management
**Priority**: High  
**Description**: Partners can manage availability

**Functional Requirements**:
- FR-9.4.1: System shall display calendar view
- FR-9.4.2: System shall show occupancy rates
- FR-9.4.3: System shall allow blocking dates
- FR-9.4.4: System shall manage pricing by date

#### 3.9.5 Discount Management
**Priority**: Medium  
**Description**: Partners can create promotions

**Functional Requirements**:
- FR-9.5.1: System shall allow discount code creation
- FR-9.5.2: System shall set discount percentages
- FR-9.5.3: System shall define usage limits
- FR-9.5.4: System shall track discount usage

#### 3.9.6 GDS Distribution
**Priority**: Medium  
**Description**: Partners can distribute via channels

**Functional Requirements**:
- FR-9.6.1: System shall connect to GDS channels
- FR-9.6.2: System shall track channel bookings
- FR-9.6.3: System shall show channel performance
- FR-9.6.4: System shall manage channel connections

### 3.10 Social Commerce

#### 3.10.1 Social Feed
**Priority**: Medium  
**Description**: Users can share and engage with content

**Functional Requirements**:
- FR-10.1.1: System shall display social feed
- FR-10.1.2: System shall allow post creation
- FR-10.1.3: System shall support likes and comments
- FR-10.1.4: System shall show partner posts
- FR-10.1.5: System shall filter by interest

#### 3.10.2 Cart and Wishlist
**Priority**: Medium  
**Description**: Users can save items for later

**Functional Requirements**:
- FR-10.2.1: System shall maintain shopping cart
- FR-10.2.2: System shall support wishlist
- FR-10.2.3: System shall allow cart checkout
- FR-10.2.4: System shall sync across sessions

### 3.11 Reviews and Ratings

#### 3.11.1 Review Submission
**Priority**: High  
**Description**: Users can review services

**Functional Requirements**:
- FR-11.1.1: System shall allow rating (1-5 stars)
- FR-11.1.2: System shall accept review text
- FR-11.1.3: System shall verify purchase before review
- FR-11.1.4: System shall support review images

#### 3.11.2 Review Display
**Priority**: High  
**Description**: Display reviews on detail pages

**Functional Requirements**:
- FR-11.2.1: System shall show average rating
- FR-11.2.2: System shall display review list
- FR-11.2.3: System shall show verified badges
- FR-11.2.4: System shall allow helpful votes

#### 3.11.3 Partner Response
**Priority**: Medium  
**Description**: Partners can respond to reviews

**Functional Requirements**:
- FR-11.3.1: System shall allow partner responses
- FR-11.3.2: System shall display responses with reviews
- FR-11.3.3: System shall notify users of responses

### 3.12 Notification System

#### 3.12.1 In-App Notifications
**Priority**: High  
**Description**: Users receive platform notifications

**Functional Requirements**:
- FR-12.1.1: System shall send booking notifications
- FR-12.1.2: System shall send payment notifications
- FR-12.1.3: System shall send review notifications
- FR-12.1.4: System shall send message notifications
- FR-12.1.5: System shall send system notifications
- FR-12.1.6: System shall send promotional notifications

#### 3.12.2 Notification Preferences
**Priority**: Medium  
**Description**: Users can manage notification settings

**Functional Requirements**:
- FR-12.2.1: System shall allow enabling/disabling by type
- FR-12.2.2: System shall save user preferences
- FR-12.2.3: System shall respect user choices

### 3.13 Messaging System

#### 3.13.1 Direct Messaging
**Priority**: Medium  
**Description**: Users can message each other

**Functional Requirements**:
- FR-13.1.1: System shall support user-to-user messaging
- FR-13.1.2: System shall maintain conversation threads
- FR-13.1.3: System shall show read status
- FR-13.1.4: System shall notify of new messages
- FR-13.1.5: System shall support multi-party messaging

### 3.14 Loyalty Program

#### 3.14.1 Points System
**Priority**: Medium  
**Description**: Users earn points on bookings

**Functional Requirements**:
- FR-14.1.1: System shall award points on bookings
- FR-14.1.2: System shall maintain points balance
- FR-14.1.3: System shall support point redemption
- FR-14.1.4: System shall track point transactions
- FR-14.1.5: System shall implement tier system

#### 3.14.2 Referral Program
**Priority**: Medium  
**Description**: Users can refer friends

**Functional Requirements**:
- FR-14.2.1: System shall generate unique referral codes
- FR-14.2.2: System shall track referred users
- FR-14.2.3: System shall reward successful referrals
- FR-14.2.4: System shall display referral statistics

### 3.15 Search and Discovery

#### 3.15.1 Global Search
**Priority**: High  
**Description**: Users can search across all content

**Functional Requirements**:
- FR-15.1.1: System shall search events, venues, hotels, vendors
- FR-15.1.2: System shall support fuzzy matching
- FR-15.1.3: System shall filter by content type
- FR-15.1.4: System shall rank results by relevance

---

## 4. External Interface Requirements

### 4.1 User Interfaces

#### 4.1.1 Web Application
- Responsive design for desktop, tablet, mobile
- Modern UI with Tailwind CSS and shadcn/ui components
- Consistent color scheme (purple/blue branding)
- Accessible navigation
- Loading states and error messages

#### 4.1.2 Admin Interfaces
- Data tables with sorting and filtering
- Charts and analytics visualizations
- Form-based configuration
- Bulk action support

### 4.2 Hardware Interfaces
- No specific hardware requirements
- Standard web server infrastructure
- Cloud-based deployment supported

### 4.3 Software Interfaces

#### 4.3.1 Paystack API
- **Purpose**: Payment processing
- **Version**: Latest stable
- **Protocol**: HTTPS REST API
- **Data Format**: JSON
- **Operations**: Initialize payment, verify transaction, process refund

#### 4.3.2 Manus OAuth API
- **Purpose**: User authentication
- **Protocol**: OAuth 2.0
- **Operations**: Authorize, token exchange, user info

#### 4.3.3 S3 Storage API
- **Purpose**: File storage
- **Protocol**: S3-compatible API
- **Operations**: Upload, download, delete files

#### 4.3.4 Database (MySQL/TiDB)
- **Purpose**: Data persistence
- **Version**: MySQL 8.0+ or TiDB Cloud
- **Protocol**: MySQL protocol
- **ORM**: Drizzle ORM

### 4.4 Communications Interfaces

#### 4.4.1 HTTP/HTTPS
- All client-server communication via HTTPS
- RESTful endpoints for webhooks
- tRPC for API calls

#### 4.4.2 WebSocket (Optional)
- Real-time notifications
- Live chat messaging

---

## 5. Non-Functional Requirements

### 5.1 Performance Requirements
- **Page Load Time**: < 2 seconds for initial load
- **API Response Time**: < 200ms for 95% of requests
- **Database Query Time**: < 100ms for indexed queries
- **Concurrent Users**: Support 10,000+ simultaneous users
- **Throughput**: Handle 1000+ transactions per minute

### 5.2 Safety Requirements
- **Data Backup**: Daily automated backups
- **Disaster Recovery**: RPO < 24 hours, RTO < 4 hours
- **Data Validation**: Server-side validation for all inputs
- **Error Handling**: Graceful degradation on failures

### 5.3 Security Requirements
- **Authentication**: OAuth 2.0 with JWT tokens
- **Authorization**: Role-based access control (RBAC)
- **Data Encryption**: HTTPS for all communications
- **Password Storage**: Handled by OAuth provider
- **SQL Injection Prevention**: Parameterized queries via ORM
- **XSS Prevention**: React automatic escaping
- **CSRF Protection**: SameSite cookies

### 5.4 Software Quality Attributes

#### 5.4.1 Availability
- **Target**: 99.9% uptime
- **Monitoring**: Health checks and alerts
- **Redundancy**: Database replication

#### 5.4.2 Maintainability
- **Code Quality**: TypeScript for type safety
- **Documentation**: Comprehensive inline comments
- **Testing**: Unit and integration tests
- **Version Control**: Git with semantic versioning

#### 5.4.3 Portability
- **Platform Independence**: Runs on any Node.js environment
- **Database Portability**: MySQL or TiDB compatible
- **Deployment**: Docker support for containerization

#### 5.4.4 Reliability
- **Error Rate**: < 0.1% of requests
- **Mean Time Between Failures**: > 720 hours
- **Mean Time To Repair**: < 1 hour

#### 5.4.5 Scalability
- **Horizontal Scaling**: Load balancer support
- **Vertical Scaling**: Efficient resource utilization
- **Database Scaling**: Read replicas and sharding support

#### 5.4.6 Usability
- **Learning Curve**: < 10 minutes for basic operations
- **Accessibility**: WCAG 2.1 Level AA compliance
- **Mobile Friendly**: Responsive design
- **Error Messages**: Clear and actionable

---

## 6. Database Requirements

### 6.1 Database Schema
The system uses 54 database tables organized into functional groups:

#### 6.1.1 Core Tables (7)
- users - User accounts and authentication
- events - Event listings
- venues - Venue listings
- hotels - Hotel listings
- bookings - All booking records
- payments - Payment transactions
- vendors - Vendor profiles

#### 6.1.2 Social Features (8)
- posts - User posts
- comments - Post comments
- likes - Post likes
- follows - User follows
- cart - Shopping cart items
- wishlist - Wishlist items
- userInterests - User interests
- partnerPosts - Partner promotional posts

#### 6.1.3 Partner System (5)
- b2bPartners - Partner accounts
- availability - Calendar availability
- discounts - Discount campaigns
- gdsChannels - Distribution channels
- propertyDistribution - Channel mapping

#### 6.1.4 Agent System (11)
- agents - Agent accounts
- agentReferrals - Referral tracking
- agentCommissions - Commission records
- agentWallets - Agent wallet balances
- agentWalletTransactions - Wallet transactions
- agentWithdrawals - Withdrawal requests
- agentCustomers - Customer relationships
- agentTargets - Sales targets
- vendorBookings - Vendor booking records
- vendorReviews - Vendor reviews

#### 6.1.5 Admin System (7)
- admins - Admin accounts
- adminRoles - Admin role definitions
- adminActivityLogs - Admin action logs
- supportTickets - Support tickets
- ticketMessages - Ticket messages
- platformSettings - System configuration
- commissionRates - Commission rate config

#### 6.1.6 Payment System (7)
- paymentMethods - Payment method records
- paymentGateways - Gateway configurations
- payouts - Payout records
- walletTransactions - Wallet transactions
- refunds - Refund records
- paymentDisputes - Dispute records

#### 6.1.7 Reviews System (3)
- reviews - User reviews
- reviewResponses - Partner responses
- reviewHelpful - Helpful votes

#### 6.1.8 Notifications & Messaging (4)
- notifications - User notifications
- notificationSettings - Notification preferences
- conversations - Message conversations
- messages - Individual messages

#### 6.1.9 Loyalty & Referrals (4)
- loyaltyPoints - User loyalty points
- pointTransactions - Point transactions
- userReferrals - User referral tracking

### 6.2 Data Integrity
- **Primary Keys**: All tables have unique primary keys
- **Foreign Keys**: Referential integrity enforced
- **Indexes**: Optimized for common queries
- **Constraints**: NOT NULL, UNIQUE, CHECK constraints

### 6.3 Data Retention
- **User Data**: Retained indefinitely unless deleted
- **Booking Records**: Retained for 7 years (compliance)
- **Payment Records**: Retained for 7 years (compliance)
- **Logs**: Retained for 90 days
- **Soft Deletes**: Implemented for critical data

### 6.4 Backup and Recovery
- **Backup Frequency**: Daily automated backups
- **Backup Retention**: 30 days
- **Point-in-Time Recovery**: Supported
- **Backup Testing**: Monthly restore tests

---

## 7. Security Requirements

### 7.1 Authentication and Authorization
- OAuth 2.0 via Manus for user authentication
- JWT tokens for session management
- Role-based access control (user, admin, partner, agent)
- Secure cookie storage with HttpOnly and SameSite flags

### 7.2 Data Protection
- All sensitive data encrypted in transit (HTTPS)
- Payment information handled by Paystack (PCI DSS compliant)
- Personal data protection per Nigerian regulations
- Regular security audits

### 7.3 Input Validation
- Server-side validation for all inputs
- Type checking via TypeScript
- SQL injection prevention via ORM
- XSS prevention via React escaping

### 7.4 Audit Logging
- Admin actions logged
- Payment transactions logged
- User authentication events logged
- Critical operations tracked

---

## Appendix A: Glossary

- **Agent**: Sales representative who earns commission on referrals
- **B2B**: Business-to-Business (partner portal)
- **B2C**: Business-to-Consumer (customer platform)
- **Commission**: Percentage earned by agents on sales
- **GDS**: Global Distribution System for multi-channel distribution
- **Partner**: Business owner listing venues/hotels
- **Super Admin**: Platform administrator with full access
- **tRPC**: TypeScript Remote Procedure Call for type-safe APIs
- **Vendor**: Service provider (catering, photography, etc.)

---

## Appendix B: Change Log

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | Oct 23, 2025 09:56 | Initial SRS | Manus AI |
| 2.0 | Oct 23, 2025 | Added Agent System, Super Admin, Payment Integration, Reviews, Notifications, Messaging, Loyalty, Search | Manus AI |

---

*End of Software Requirements Specification*

