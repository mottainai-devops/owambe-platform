# Partner Dashboard - Advanced Features Documentation

## Overview

The enhanced Partner Dashboard provides comprehensive business management tools for venue and hotel owners on the Owambe platform, including real-time booking management, availability calendar, discount campaigns, and global distribution system integration.

---

## 🎯 Key Features

### 1. **Dynamic Booking Portal**

Real-time booking management system with complete visibility and control over all reservations.

**Features:**
- **Live Booking Table** - View all bookings across all properties
- **Status Filtering** - Filter by confirmed, pending, or cancelled bookings
- **Quick Actions** - Approve, reject, or view booking details
- **Customer Information** - Full customer details and contact information
- **Revenue Tracking** - Real-time booking amounts and payment status

**Booking Statuses:**
- `confirmed` - Booking approved and confirmed
- `pending` - Awaiting partner approval
- `cancelled` - Cancelled by customer or partner
- `completed` - Past booking completed successfully

**Actions Available:**
- View booking details
- Approve pending bookings (✓)
- Reject/cancel bookings (✗)
- Download booking reports

---

### 2. **Interactive Availability Calendar**

Visual calendar system for managing property availability and dynamic pricing.

**Features:**
- **Monthly Calendar View** - Interactive calendar showing availability status
- **Color-Coded Days**:
  - White - Available for booking
  - Green - Booked/Reserved
  - Red - Blocked by owner
- **Property Selector** - Filter calendar by specific venue or hotel
- **Quick Stats Panel**:
  - Occupancy Rate (%)
  - Average Daily Rate (ADR)
  - Revenue Per Available (RevPAR)
- **Block Dates** - Easily block dates for maintenance or personal use

**Calendar Management:**
- Click on any date to manage availability
- Set dynamic pricing for specific dates
- Block dates for maintenance
- View booking density
- Track occupancy trends

**Key Metrics:**
- **Occupancy Rate** - Percentage of booked vs available slots
- **ADR** - Average revenue per booked day
- **RevPAR** - Revenue efficiency metric

---

### 3. **Discount & Promotion Module**

Comprehensive promotional campaign management system.

**Features:**
- **Discount Code Creation** - Generate unique promotional codes
- **Flexible Discount Types**:
  - Percentage-based (e.g., 20% off)
  - Fixed amount (e.g., ₦5,000 off)
- **Usage Tracking** - Monitor discount code usage in real-time
- **Usage Limits** - Set maximum number of uses per code
- **Date Range Control** - Define valid start and end dates
- **Minimum Booking Amount** - Set minimum purchase requirements
- **Maximum Discount Cap** - Limit maximum discount amount

**Discount Configuration:**
```
Code: EARLY2025
Type: Percentage
Value: 20%
Usage: 45/100
Status: Active
Start Date: 2025-01-01
End Date: 2025-03-31
```

**Use Cases:**
- Early bird discounts
- Weekend specials
- Seasonal promotions
- Last-minute deals
- Loyalty rewards

**Management Actions:**
- Create new discount codes
- Edit existing campaigns
- Activate/deactivate codes
- View usage analytics
- Track revenue impact

---

### 4. **Global Distribution System (GDS)**

Multi-channel distribution management for wider market reach.

**Supported Channel Types:**
- **OTA** (Online Travel Agencies) - Booking.com, Expedia, Hotels.com
- **GDS** (Global Distribution Systems) - Amadeus, Sabre, Galileo
- **Metasearch** - TripAdvisor, Google Hotels, Kayak
- **Direct** - Your own website/platform

**Features:**
- **Channel Overview** - Visual cards for each distribution channel
- **Real-time Sync** - Synchronize inventory across all channels
- **Commission Tracking** - Monitor commission rates per channel
- **Booking Attribution** - Track which channel generated each booking
- **Performance Analytics** - Revenue breakdown by channel
- **Status Management** - Activate/deactivate channels as needed

**Channel Metrics:**
- Total bookings from channel
- Commission rate (%)
- Revenue generated
- Net revenue after commission
- Sync status

**Distribution Performance Table:**
```
Channel          | Bookings | Revenue    | Commission | Net Revenue
----------------|----------|------------|------------|-------------
Booking.com     | 45       | ₦675,000   | ₦101,250   | ₦573,750
Expedia         | 32       | ₦480,000   | ₦86,400    | ₦393,600
Direct Bookings | 79       | ₦1,185,000 | ₦0         | ₦1,185,000
```

**Benefits:**
- Increased visibility across multiple platforms
- Automated inventory synchronization
- Centralized booking management
- Commission optimization
- Revenue diversification

---

## 📊 Analytics Dashboard

The dashboard provides real-time business intelligence:

### Key Performance Indicators (KPIs)

1. **Total Revenue**
   - Current month revenue
   - Month-over-month growth
   - Revenue trends

2. **Total Bookings**
   - Booking count
   - Growth percentage
   - Booking trends

3. **Active Listings**
   - Number of venues
   - Number of hotels
   - Total properties

4. **Average Rating**
   - Overall rating score
   - Number of reviews
   - Rating trends

---

## 🗄️ Database Schema

### New Tables Added

#### `discounts`
```sql
- id: varchar(64) PRIMARY KEY
- code: varchar(50) NOT NULL
- description: text
- discountType: enum('percentage', 'fixed')
- discountValue: int NOT NULL
- minBookingAmount: int
- maxDiscountAmount: int
- applicableType: enum('event', 'venue', 'hotel', 'all')
- referenceId: varchar(64)
- startDate: timestamp NOT NULL
- endDate: timestamp NOT NULL
- usageLimit: int
- usageCount: int DEFAULT 0
- ownerId: varchar(64) NOT NULL
- status: enum('active', 'inactive', 'expired')
- createdAt: timestamp
```

#### `availability`
```sql
- id: varchar(64) PRIMARY KEY
- resourceType: enum('venue', 'hotel')
- resourceId: varchar(64) NOT NULL
- date: timestamp NOT NULL
- availableSlots: int NOT NULL
- bookedSlots: int DEFAULT 0
- price: int (dynamic pricing)
- status: enum('available', 'booked', 'blocked')
- createdAt: timestamp
```

#### `gdsChannels`
```sql
- id: varchar(64) PRIMARY KEY
- channelName: varchar(100) NOT NULL
- channelType: enum('ota', 'gds', 'metasearch', 'direct')
- apiEndpoint: varchar(500)
- apiKey: varchar(255)
- commissionRate: int (percentage * 100)
- status: enum('active', 'inactive')
- createdAt: timestamp
```

#### `propertyDistribution`
```sql
- id: varchar(64) PRIMARY KEY
- propertyType: enum('venue', 'hotel')
- propertyId: varchar(64) NOT NULL
- channelId: varchar(64) NOT NULL
- externalId: varchar(255)
- syncStatus: enum('pending', 'synced', 'failed')
- lastSyncAt: timestamp
- status: enum('active', 'inactive')
- createdAt: timestamp
```

---

## 🎨 User Interface

### Navigation Structure

The Partner Dashboard uses a tabbed interface for easy navigation:

1. **Bookings** - Booking management portal
2. **Calendar** - Availability and pricing calendar
3. **Discounts** - Promotional campaign management
4. **Distribution** - GDS channel management
5. **Venues** - Venue property management
6. **Hotels** - Hotel property management

### Design Principles

- **Clean & Modern** - Professional business interface
- **Responsive** - Works on desktop, tablet, and mobile
- **Intuitive** - Easy to navigate and understand
- **Real-time** - Live data updates
- **Action-oriented** - Quick access to common tasks

---

## 🚀 Future Enhancements

### Planned Features

1. **Advanced Analytics**
   - Revenue forecasting
   - Demand prediction
   - Competitor analysis
   - Market trends

2. **Automated Pricing**
   - Dynamic pricing algorithms
   - Seasonal adjustments
   - Demand-based pricing
   - Competitor price monitoring

3. **Reporting**
   - Custom report builder
   - Scheduled reports
   - Export to PDF/Excel
   - Email delivery

4. **Integration APIs**
   - Property Management Systems (PMS)
   - Channel Managers
   - Payment Gateways
   - Accounting Software

5. **Mobile App**
   - iOS and Android apps
   - Push notifications
   - Mobile booking management
   - On-the-go analytics

---

## 💡 Best Practices

### Booking Management
- Respond to pending bookings within 24 hours
- Keep availability calendar up-to-date
- Set clear cancellation policies
- Communicate proactively with customers

### Discount Strategy
- Use early bird discounts to drive advance bookings
- Create urgency with limited-time offers
- Set reasonable usage limits
- Monitor discount effectiveness

### Distribution Optimization
- Maintain rate parity across channels
- Monitor commission costs
- Prioritize direct bookings
- Regularly sync inventory
- Analyze channel performance

### Calendar Management
- Update availability daily
- Block dates well in advance
- Use dynamic pricing during peak periods
- Monitor occupancy trends
- Adjust pricing based on demand

---

## 📞 Support

For questions or assistance with the Partner Dashboard:
- Review this documentation
- Check the main project documentation
- Contact platform support

---

**Last Updated:** October 23, 2025  
**Version:** 2.0  
**Module:** Partner Dashboard

