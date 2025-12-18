# Owambe Mobile App - Screen Structure

**Version:** 1.0  
**Date:** October 24, 2025  
**Platform:** iOS & Android  
**Design Philosophy:** Dynamic, Compact, User-Centric

---

## Executive Summary

The Owambe mobile app requires **35 core screens** organized into 8 main sections with a bottom tab navigation. This structure balances functionality with simplicity, ensuring users can access all features within 2-3 taps.

---

## Screen Count Overview

| Category | Screen Count | Purpose |
|----------|--------------|---------|
| **Authentication** | 3 | Login, signup, onboarding |
| **Main Navigation** | 5 | Bottom tab screens |
| **Discovery & Browse** | 6 | Events, venues, hotels, vendors |
| **Detail Pages** | 4 | Individual item details |
| **Booking Flow** | 5 | Booking process and payment |
| **User Profile** | 6 | Account management |
| **Social Features** | 3 | Community and messaging |
| **Settings & Support** | 3 | Configuration and help |
| **TOTAL** | **35 screens** | Complete user experience |

---

## Detailed Screen Breakdown

### 1. Authentication & Onboarding (3 Screens)

#### 1.1 Splash Screen
**Purpose:** App launch and brand introduction  
**Components:**
- Owambe logo animation
- Loading indicator
- Auto-navigate to onboarding or home

#### 1.2 Onboarding Carousel (3 slides)
**Purpose:** Introduce app features to new users  
**Slides:**
1. "Discover Amazing Events" - Event discovery
2. "Book Venues & Hotels" - Booking capabilities
3. "Connect with Community" - Social features
**Components:**
- Skip button (top-right)
- Next/Get Started button
- Progress indicators

#### 1.3 Login/Signup Screen
**Purpose:** User authentication  
**Components:**
- OAuth login button (Manus)
- "Continue as Guest" option
- Terms and privacy links

---

### 2. Main Navigation (5 Screens - Bottom Tabs)

#### 2.1 Home Screen ⭐
**Tab Icon:** Home  
**Purpose:** Main dashboard and quick access  
**Components:**
- Search bar (global search)
- Category quick links (Events, Venues, Hotels, Vendors)
- Featured events carousel
- Recommended for you section
- Trending venues section
- Special offers banner
- Quick stats (bookings, points)

#### 2.2 Explore Screen 🔍
**Tab Icon:** Search/Compass  
**Purpose:** Discovery and browsing  
**Components:**
- Category tabs (Events, Venues, Hotels, Vendors)
- Filter chips (Date, Location, Price, Rating)
- Grid/List view toggle
- Sort options
- Map view toggle
- Results list with cards

#### 2.3 Bookings Screen 📅
**Tab Icon:** Calendar  
**Purpose:** Manage all bookings  
**Components:**
- Tab switcher (Upcoming, Past, Cancelled)
- Booking cards with status
- Quick actions (View details, Cancel, Review)
- Empty state for new users
- Total spent this month

#### 2.4 Community Screen 💬
**Tab Icon:** People/Heart  
**Purpose:** Social engagement  
**Components:**
- Feed tabs (All, Following, Partners)
- Create post button (floating)
- Post cards (like, comment, share)
- Stories row (top)
- Trending topics

#### 2.5 Profile Screen 👤
**Tab Icon:** Person  
**Purpose:** User account hub  
**Components:**
- Profile header (avatar, name, points)
- Loyalty tier badge
- Quick stats (bookings, reviews, referrals)
- Menu items:
  - My Bookings
  - Wishlist
  - Payment Methods
  - Loyalty & Rewards
  - Referrals
  - Settings
  - Help & Support
  - Become an Agent
  - Partner With Us

---

### 3. Discovery & Browse Screens (6 Screens)

#### 3.1 Events List Screen
**Navigation:** From Explore tab or Home  
**Components:**
- Filter bar (Category, Date, Location, Price)
- Sort dropdown
- Event cards (image, title, date, location, price)
- Load more pagination
- Map view option

#### 3.2 Venues List Screen
**Navigation:** From Explore tab or Home  
**Components:**
- Filter bar (Capacity, Location, Price, Amenities)
- Venue cards (image, name, capacity, rating, price)
- Featured venues section
- Load more pagination

#### 3.3 Hotels List Screen
**Navigation:** From Explore tab or Home  
**Components:**
- Filter bar (Star rating, Location, Price, Amenities)
- Hotel cards (image, name, stars, rating, price/night)
- Special deals section
- Load more pagination

#### 3.4 Vendors List Screen
**Navigation:** From Explore tab or Home  
**Components:**
- Category tabs (Catering, Photography, Entertainment, Decoration, Planning)
- Vendor cards (image, name, type, rating, verified badge)
- Featured vendors
- Load more pagination

#### 3.5 Search Results Screen
**Navigation:** From global search bar  
**Components:**
- Search query display
- Category filter (All, Events, Venues, Hotels, Vendors)
- Results grouped by type
- "No results" state with suggestions

#### 3.6 Map View Screen
**Navigation:** From any list screen  
**Components:**
- Full-screen map
- Location pins with price labels
- Bottom sheet with list
- Filter button
- Current location button

---

### 4. Detail Pages (4 Screens)

#### 4.1 Event Detail Screen
**Navigation:** From any event card  
**Components:**
- Hero image carousel
- Event title and category badge
- Date, time, location
- Organizer info
- Description (expandable)
- Ticket pricing
- Quantity selector
- Total price display
- "Book Now" button (sticky)
- Similar events section
- Reviews section

#### 4.2 Venue Detail Screen
**Navigation:** From any venue card  
**Components:**
- Image gallery carousel
- Venue name and rating
- Location with map preview
- Capacity and pricing
- Amenities grid
- Description (expandable)
- Availability calendar
- Date picker
- Guest count selector
- "Book Now" button (sticky)
- Reviews section

#### 4.3 Hotel Detail Screen
**Navigation:** From any hotel card  
**Components:**
- Image gallery carousel
- Hotel name and star rating
- Location with map preview
- Price per night
- Amenities grid
- Description (expandable)
- Check-in/Check-out date pickers
- Room count selector
- Total price (multi-night)
- "Book Now" button (sticky)
- Reviews section

#### 4.4 Vendor Detail Screen
**Navigation:** From any vendor card  
**Components:**
- Portfolio image gallery
- Vendor name and type
- Rating and verified badge
- Service packages (expandable cards)
- Package inclusions
- Pricing
- Special perks
- Booking form (dynamic based on vendor type)
- "Request Quote" button
- Reviews section

---

### 5. Booking Flow (5 Screens)

#### 5.1 Booking Summary Screen
**Navigation:** After clicking "Book Now"  
**Components:**
- Item details recap
- Date/time/guests summary
- Price breakdown
- Special requests text area
- Promo code input
- Total amount
- "Proceed to Payment" button

#### 5.2 Payment Method Screen
**Navigation:** From booking summary  
**Components:**
- Saved payment methods list
- "Add new payment method" option
- Paystack secure badge
- "Pay Now" button

#### 5.3 Payment Processing Screen
**Navigation:** After payment initiation  
**Components:**
- Paystack payment webview
- Loading indicator
- Cancel button

#### 5.4 Payment Success Screen
**Navigation:** After successful payment  
**Components:**
- Success animation (checkmark)
- Booking confirmation message
- Booking reference number
- Details summary
- "View Booking" button
- "Download Receipt" button
- "Share" button

#### 5.5 Payment Failed Screen
**Navigation:** After failed payment  
**Components:**
- Error icon
- Failure message
- Reason (if available)
- "Try Again" button
- "Contact Support" button
- "Cancel Booking" button

---

### 6. User Profile Screens (6 Screens)

#### 6.1 My Bookings Screen
**Navigation:** From Profile menu  
**Components:**
- Tab switcher (Upcoming, Past, Cancelled)
- Booking cards with details
- Status badges
- Quick actions (View, Cancel, Review, Rebook)
- Filter by type

#### 6.2 Wishlist Screen
**Navigation:** From Profile menu  
**Components:**
- Saved items grid
- Category tabs (All, Events, Venues, Hotels, Vendors)
- Remove button
- "Book Now" quick action
- Empty state

#### 6.3 Payment Methods Screen
**Navigation:** From Profile menu  
**Components:**
- Saved cards list
- Default card indicator
- "Add new card" button
- Edit/Delete options
- Security info

#### 6.4 Loyalty & Rewards Screen
**Navigation:** From Profile menu  
**Components:**
- Points balance (large display)
- Tier progress bar
- Tier benefits list
- Points history
- Redeem rewards section
- Referral stats

#### 6.5 Referral Screen
**Navigation:** From Profile menu  
**Components:**
- Unique referral code/link
- Share buttons (WhatsApp, SMS, Email, Social)
- Referral stats (sent, joined, earned)
- Referral rewards breakdown
- Terms and conditions

#### 6.6 Edit Profile Screen
**Navigation:** From Profile screen  
**Components:**
- Avatar upload
- Name input
- Email (read-only)
- Phone number input
- Date of birth picker
- Gender selector
- Location input
- Interests multi-select
- "Save Changes" button

---

### 7. Social Features (3 Screens)

#### 7.1 Community Feed Screen
**Navigation:** Community tab (main)  
**Components:**
- Feed tabs (All, Following, Partners)
- Create post button (floating)
- Post cards:
  - User avatar and name
  - Post content (text/images)
  - Like, comment, share buttons
  - Timestamp
- Pull to refresh
- Infinite scroll

#### 7.2 Post Detail Screen
**Navigation:** From any post card  
**Components:**
- Full post content
- Like button and count
- Comments list
- Comment input field
- Share button
- Report button (overflow menu)

#### 7.3 Messages Screen
**Navigation:** From notification or profile menu  
**Components:**
- Conversations list
- User avatar and name
- Last message preview
- Unread badge
- Timestamp
- Search conversations
- New message button

#### 7.4 Chat Screen
**Navigation:** From messages list  
**Components:**
- Message bubbles (sent/received)
- Text input field
- Send button
- Attachment button
- Timestamp
- Read receipts
- Typing indicator

---

### 8. Settings & Support (3 Screens)

#### 8.1 Settings Screen
**Navigation:** From Profile menu  
**Components:**
- **Account Section:**
  - Edit Profile
  - Change Password
  - Email Preferences
- **Notifications Section:**
  - Push Notifications toggle
  - Email Notifications toggle
  - SMS Notifications toggle
  - Notification types (Bookings, Payments, Social, Promotions)
- **Preferences Section:**
  - Language
  - Currency
  - Theme (Light/Dark/Auto)
- **Privacy Section:**
  - Privacy Policy
  - Terms of Service
  - Data & Privacy
- **App Section:**
  - App Version
  - Clear Cache
  - Rate App
- **Account Actions:**
  - Logout
  - Delete Account

#### 8.2 Help & Support Screen
**Navigation:** From Profile menu  
**Components:**
- Search FAQs
- FAQ categories (expandable)
- "Contact Support" button
- Live chat option
- Email support
- Phone support
- Support hours

#### 8.3 Support Ticket Screen
**Navigation:** From Help & Support  
**Components:**
- Ticket subject input
- Category dropdown
- Description text area
- Attach screenshot button
- Submit button
- My tickets list (below form)

---

## Special Screens (Not in main flow)

### 9.1 Agent Application Screen
**Navigation:** From Profile menu "Become an Agent"  
**Components:**
- Application form:
  - Full name
  - Phone number
  - Business name (optional)
  - Experience
  - Why you want to be an agent
- Submit button
- Application status (if already applied)

### 9.2 Agent Dashboard Screen (If approved)
**Navigation:** From Profile menu  
**Components:**
- Earnings overview
- Commission wallet balance
- Referral link
- Products showcase
- Customer list
- Performance stats
- Withdraw button

### 9.3 Partner Application Screen
**Navigation:** From Profile menu "Partner With Us"  
**Components:**
- Business information form
- Business type (Venue/Hotel)
- Contact details
- Submit button
- Application status

### 9.4 Notifications Screen
**Navigation:** From bell icon (header)  
**Components:**
- Notification list grouped by date
- Notification types (Booking, Payment, Social, System)
- Mark as read
- Clear all button
- Empty state

### 9.5 Reviews Screen (Write Review)
**Navigation:** From booking detail  
**Components:**
- Star rating selector (1-5)
- Review text area
- Photo upload (optional)
- Submit button

---

## Navigation Architecture

### Bottom Tab Navigation (5 tabs)
1. **Home** - Main dashboard
2. **Explore** - Discovery and search
3. **Bookings** - Booking management
4. **Community** - Social feed
5. **Profile** - User account

### Stack Navigation Patterns

**Home Stack:**
- Home → Event Detail → Booking Summary → Payment

**Explore Stack:**
- Explore → List View → Detail → Booking Summary → Payment
- Explore → Map View → Detail → Booking Summary → Payment

**Bookings Stack:**
- Bookings → Booking Detail → Write Review
- Bookings → Booking Detail → Cancel Booking

**Community Stack:**
- Community → Post Detail → User Profile
- Community → Messages → Chat

**Profile Stack:**
- Profile → Edit Profile
- Profile → My Bookings → Booking Detail
- Profile → Wishlist → Detail
- Profile → Settings → Sub-settings
- Profile → Help & Support → Support Ticket

---

## Screen Transition Guidelines

### Animation Types
- **Push/Pop**: Standard navigation (slide from right)
- **Modal**: Bottom sheet for filters, actions
- **Fade**: Tab switching
- **Slide Up**: Payment, booking confirmation

### Loading States
- Skeleton screens for lists
- Shimmer effect for cards
- Progress indicators for actions
- Pull-to-refresh for feeds

### Empty States
- Friendly illustrations
- Clear messaging
- Call-to-action button
- Suggestions for next steps

---

## Mobile-Specific Features

### Gestures
- Swipe to go back
- Pull to refresh
- Swipe to delete (bookings, messages)
- Pinch to zoom (images)
- Long press for context menu

### Offline Support
- Cache recent searches
- Save bookings for offline viewing
- Queue actions when offline
- Sync when back online

### Push Notifications
- Booking confirmations
- Payment receipts
- Event reminders
- New messages
- Special offers
- Social interactions

### Deep Linking
- Event detail: `owambe://events/{eventId}`
- Venue detail: `owambe://venues/{venueId}`
- Hotel detail: `owambe://hotels/{hotelId}`
- Booking detail: `owambe://bookings/{bookingId}`
- Agent referral: `owambe://ref/{agentCode}`

---

## Screen Size Optimization

### Compact Design Principles
1. **Single Column Layout**: Avoid horizontal scrolling
2. **Thumb-Friendly Zones**: Important actions in bottom 2/3
3. **Collapsible Sections**: Expandable cards for details
4. **Sticky Headers**: Keep context visible while scrolling
5. **Bottom Sheets**: For filters, actions, selections
6. **Floating Action Buttons**: Primary actions always accessible

### Responsive Breakpoints
- **Small phones** (< 375px): Single column, larger touch targets
- **Standard phones** (375-414px): Optimized default layout
- **Large phones** (> 414px): More content per screen
- **Tablets** (> 768px): Two-column layouts where appropriate

---

## Development Priority

### Phase 1 - MVP (Core Booking Flow)
**Screens: 20**
1. Splash & Onboarding (3)
2. Home Screen (1)
3. Explore Screen (1)
4. Event/Venue/Hotel Lists (3)
5. Event/Venue/Hotel Details (3)
6. Booking Flow (5)
7. My Bookings (1)
8. Profile (1)
9. Settings (1)
10. Login (1)

### Phase 2 - Social & Discovery
**Screens: 8**
1. Community Feed (1)
2. Post Detail (1)
3. Vendors List & Detail (2)
4. Search & Map View (2)
5. Wishlist (1)
6. Reviews (1)

### Phase 3 - Advanced Features
**Screens: 7**
1. Messages & Chat (2)
2. Agent Application & Dashboard (2)
3. Partner Application (1)
4. Loyalty & Rewards (1)
5. Referrals (1)

---

## Technical Considerations

### State Management
- Redux/MobX for global state
- React Query for server state
- AsyncStorage for persistence

### API Integration
- tRPC client for type-safe API calls
- Automatic retry on network failure
- Request caching and deduplication

### Performance
- Image lazy loading
- List virtualization
- Code splitting by screen
- Bundle size optimization

### Analytics
- Screen view tracking
- User action events
- Conversion funnel tracking
- Crash reporting

---

## Comparison: Web vs Mobile

| Feature | Web Screens | Mobile Screens | Optimization |
|---------|-------------|----------------|--------------|
| Navigation | Top nav + sidebar | Bottom tabs | Thumb-friendly |
| Detail Pages | Full width | Single column | Scrollable |
| Filters | Sidebar | Bottom sheet | Space-efficient |
| Search | Header | Dedicated screen | Focus mode |
| Booking | Multi-step | Bottom sheet flow | Quick actions |
| Profile | Dashboard | Tab-based | Organized |

---

## Conclusion

The Owambe mobile app requires **35 core screens** to deliver a complete, dynamic, and compact user experience. This structure:

✅ **Balances functionality with simplicity**  
✅ **Ensures 2-3 tap access to all features**  
✅ **Optimizes for mobile gestures and interactions**  
✅ **Supports offline capabilities**  
✅ **Provides clear navigation patterns**  
✅ **Scales for future features**

The phased development approach allows for MVP launch with 20 screens, with social and advanced features added incrementally based on user feedback.

---

*This document should guide the mobile app development team in creating a cohesive, user-friendly experience that complements the web platform.*

