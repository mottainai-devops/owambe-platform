# Complete Deployment Handoff
## Owambe Platform - Production Deployment Guide

**Version:** 1.0  
**Date:** October 23, 2025  
**Status:** Production Ready  
**Target Audience:** DevOps Engineers, System Administrators, Developers

---

## Executive Summary

The Owambe Platform is a comprehensive event management, venue booking, hotel reservation, and social commerce platform built with modern web technologies. This document provides complete instructions for deploying the application to production environments.

**Key Highlights**:
- **Technology Stack**: React 19, Node.js 22, Express 4, tRPC 11, MySQL/TiDB
- **Architecture**: Three-tier web application with RESTful API
- **Deployment Options**: VPS, Docker, Cloud Platforms (AWS/Azure/GCP)
- **Database**: 18 tables with complete schema
- **Features**: Events, Venues, Hotels, Vendors, Social Commerce, Partner Portal
- **Status**: Fully functional, tested, production-ready

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Prerequisites](#2-prerequisites)
3. [Environment Setup](#3-environment-setup)
4. [Deployment Methods](#4-deployment-methods)
5. [Database Setup](#5-database-setup)
6. [Configuration](#6-configuration)
7. [Testing Deployment](#7-testing-deployment)
8. [Monitoring & Maintenance](#8-monitoring--maintenance)
9. [Troubleshooting](#9-troubleshooting)
10. [Complete Page Inventory](#10-complete-page-inventory)

---

## 1. Project Overview

### 1.1 Application Architecture

```
Owambe Platform
├── Frontend (React SPA)
│   ├── Public Pages (Events, Venues, Hotels, Vendors)
│   ├── User Dashboard (Bookings, Wishlist, Cart, Posts)
│   ├── Partner Dashboard (Analytics, Bookings, Calendar, Discounts)
│   └── Social Commerce (Community Feed, Partner Posts)
│
├── Backend (Node.js + Express + tRPC)
│   ├── Authentication (OAuth via Manus)
│   ├── API Endpoints (tRPC procedures)
│   ├── Business Logic
│   └── Database Access (Drizzle ORM)
│
└── Database (MySQL/TiDB)
    ├── Core Tables (users, events, venues, hotels, vendors)
    ├── Booking Tables (bookings, vendorBookings)
    ├── Social Tables (posts, comments, likes, partnerPosts)
    └── Partner Tables (b2bPartners, availability, discounts, gdsChannels)
```

### 1.2 Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Frontend | React | 19.x |
| Frontend Build | Vite | 5.x |
| Styling | Tailwind CSS | 4.x |
| UI Components | shadcn/ui | Latest |
| Backend Runtime | Node.js | 22.x |
| Backend Framework | Express | 4.x |
| API Layer | tRPC | 11.x |
| Database ORM | Drizzle | Latest |
| Database | MySQL/TiDB | 8.0+ |
| Language | TypeScript | 5.x |
| Package Manager | pnpm | Latest |

### 1.3 System Requirements

**Minimum Requirements**:
- CPU: 2 cores
- RAM: 4 GB
- Storage: 20 GB SSD
- OS: Ubuntu 22.04 LTS or compatible Linux

**Recommended for Production**:
- CPU: 4+ cores
- RAM: 8+ GB
- Storage: 50+ GB SSD
- OS: Ubuntu 22.04 LTS
- Load Balancer: Nginx or HAProxy
- Database: Managed MySQL service (RDS, Azure Database, etc.)

---

## 2. Prerequisites

### 2.1 Required Software

Install the following on your deployment server:

**Node.js 22.x**
```bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v22.x.x
npm --version
```

**pnpm Package Manager**
```bash
# Install pnpm globally
npm install -g pnpm

# Verify installation
pnpm --version
```

**MySQL 8.0+** (if hosting database locally)
```bash
# Install MySQL
sudo apt update
sudo apt install mysql-server

# Secure installation
sudo mysql_secure_installation

# Verify installation
mysql --version
```

**Nginx** (for reverse proxy)
```bash
# Install Nginx
sudo apt update
sudo apt install nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Verify installation
nginx -v
```

**PM2** (for process management)
```bash
# Install PM2 globally
npm install -g pm2

# Verify installation
pm2 --version
```

**Git** (for code deployment)
```bash
# Install Git
sudo apt install git

# Verify installation
git --version
```

### 2.2 Required Accounts & Services

**Manus OAuth**
- OAuth Client ID and Secret
- Callback URL configured
- Contact: Manus support for credentials

**Database**
- MySQL/TiDB instance (local or managed)
- Database created (e.g., `owambe_prod`)
- User with full privileges

**S3-Compatible Storage** (Optional but recommended)
- AWS S3, DigitalOcean Spaces, or compatible
- Access Key ID and Secret Access Key
- Bucket created

**Domain & SSL**
- Domain name (e.g., owambe.com)
- SSL certificate (Let's Encrypt recommended)
- DNS configured

---

## 3. Environment Setup

### 3.1 Clone Repository

```bash
# Create application directory
sudo mkdir -p /var/www
cd /var/www

# Clone repository (replace with your repo URL)
sudo git clone https://github.com/your-org/owambe-platform.git
cd owambe-platform

# Set ownership
sudo chown -R $USER:$USER /var/www/owambe-platform
```

### 3.2 Install Dependencies

```bash
# Install all dependencies
pnpm install

# This installs both frontend and backend dependencies
```

### 3.3 Environment Variables

Create a `.env` file in the project root:

```bash
# Copy example environment file
cp .env.example .env

# Edit with your values
nano .env
```

**Required Environment Variables**:

```bash
# ============================================
# DATABASE CONFIGURATION
# ============================================
DATABASE_URL="mysql://username:password@localhost:3306/owambe_prod"

# ============================================
# AUTHENTICATION
# ============================================
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
OAUTH_SERVER_URL="https://api.manus.im"
VITE_OAUTH_PORTAL_URL="https://auth.manus.im"

# ============================================
# APPLICATION
# ============================================
NODE_ENV="production"
PORT=3000
VITE_APP_ID="your-manus-app-id"
VITE_APP_TITLE="Owambe"
VITE_APP_LOGO="/logo.png"

# ============================================
# OWNER CONFIGURATION
# ============================================
OWNER_OPEN_ID="your-owner-open-id"
OWNER_NAME="Admin Name"

# ============================================
# MANUS BUILT-IN SERVICES
# ============================================
BUILT_IN_FORGE_API_URL="https://forge-api.manus.im"
BUILT_IN_FORGE_API_KEY="your-forge-api-key"

# ============================================
# STORAGE (S3)
# ============================================
S3_ENDPOINT="https://s3.amazonaws.com"
S3_REGION="us-east-1"
S3_BUCKET="owambe-uploads"
S3_ACCESS_KEY_ID="your-access-key"
S3_SECRET_ACCESS_KEY="your-secret-key"

# ============================================
# ANALYTICS (Optional)
# ============================================
VITE_ANALYTICS_ENDPOINT="https://analytics.example.com"
VITE_ANALYTICS_WEBSITE_ID="your-website-id"

# ============================================
# EMAIL (Future - Optional)
# ============================================
SMTP_HOST="smtp.example.com"
SMTP_PORT=587
SMTP_USER="noreply@owambe.com"
SMTP_PASSWORD="your-smtp-password"
SMTP_FROM="Owambe <noreply@owambe.com>"
```

**Security Notes**:
- **NEVER** commit `.env` file to version control
- Use strong, unique values for `JWT_SECRET`
- Rotate secrets regularly
- Use environment-specific values for each deployment

---

## 4. Deployment Methods

### 4.1 Method 1: Traditional VPS Deployment

This method uses PM2 for process management and Nginx as reverse proxy.

#### Step 1: Build Application

```bash
# Navigate to project directory
cd /var/www/owambe-platform

# Build frontend
pnpm build

# This creates optimized production build in dist/
```

#### Step 2: Configure PM2

The project includes `ecosystem.config.js` for PM2:

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'owambe-platform',
    script: 'server/index.ts',
    interpreter: 'node',
    interpreter_args: '--loader tsx',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
};
```

Start the application:

```bash
# Create logs directory
mkdir -p logs

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions provided by the command

# Check status
pm2 status
pm2 logs owambe-platform
```

#### Step 3: Configure Nginx

Create Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/owambe
```

Add the following configuration:

```nginx
# HTTP - Redirect to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name owambe.com www.owambe.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

# HTTPS - Main Application
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name owambe.com www.owambe.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/owambe.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/owambe.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Root directory
    root /var/www/owambe-platform/dist/client;
    index index.html;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/javascript application/json;

    # API Proxy
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 90;
    }

    # Static Files
    location / {
        try_files $uri $uri/ /index.html;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Assets with cache busting
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Deny access to hidden files
    location ~ /\. {
        deny all;
    }

    # File upload size limit
    client_max_body_size 10M;
}
```

Enable the site:

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/owambe /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

#### Step 4: Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d owambe.com -d www.owambe.com

# Follow the prompts
# Certificate will be automatically configured in Nginx

# Test auto-renewal
sudo certbot renew --dry-run
```

#### Step 5: Configure Firewall

```bash
# Allow SSH
sudo ufw allow ssh

# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

### 4.2 Method 2: Docker Deployment

#### Step 1: Create Dockerfile

Create `Dockerfile` in project root:

```dockerfile
# Build stage
FROM node:22-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN pnpm build

# Production stage
FROM node:22-alpine

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Copy built application from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/shared ./shared

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production

# Start application
CMD ["node", "--loader", "tsx", "server/index.ts"]
```

#### Step 2: Create docker-compose.yml

```yaml
version: '3.8'

services:
  # Application
  app:
    build: .
    container_name: owambe-app
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=mysql://owambe:password@db:3306/owambe_prod
      - JWT_SECRET=${JWT_SECRET}
      - OAUTH_SERVER_URL=${OAUTH_SERVER_URL}
      - VITE_OAUTH_PORTAL_URL=${VITE_OAUTH_PORTAL_URL}
      - VITE_APP_ID=${VITE_APP_ID}
    depends_on:
      - db
    networks:
      - owambe-network

  # Database
  db:
    image: mysql:8.0
    container_name: owambe-db
    restart: unless-stopped
    environment:
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
      - MYSQL_DATABASE=owambe_prod
      - MYSQL_USER=owambe
      - MYSQL_PASSWORD=${MYSQL_PASSWORD}
    volumes:
      - db-data:/var/lib/mysql
    networks:
      - owambe-network
    ports:
      - "3306:3306"

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: owambe-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - app
    networks:
      - owambe-network

volumes:
  db-data:

networks:
  owambe-network:
    driver: bridge
```

#### Step 3: Deploy with Docker

```bash
# Build and start containers
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f app

# Stop containers
docker-compose down

# Rebuild after changes
docker-compose up -d --build
```

### 4.3 Method 3: Cloud Platform Deployment (AWS Example)

#### AWS Deployment Architecture

```
Route 53 (DNS)
    ↓
CloudFront (CDN)
    ↓
Application Load Balancer
    ↓
ECS/Fargate (Application)
    ↓
RDS MySQL (Database)
    ↓
S3 (File Storage)
```

#### Step 1: Setup RDS Database

```bash
# Using AWS CLI
aws rds create-db-instance \
    --db-instance-identifier owambe-prod-db \
    --db-instance-class db.t3.medium \
    --engine mysql \
    --engine-version 8.0 \
    --master-username admin \
    --master-user-password YourSecurePassword \
    --allocated-storage 20 \
    --vpc-security-group-ids sg-xxxxx \
    --db-subnet-group-name your-subnet-group \
    --backup-retention-period 7 \
    --preferred-backup-window "03:00-04:00" \
    --preferred-maintenance-window "mon:04:00-mon:05:00"
```

#### Step 2: Setup S3 Bucket

```bash
# Create S3 bucket
aws s3 mb s3://owambe-uploads --region us-east-1

# Configure bucket policy
aws s3api put-bucket-policy \
    --bucket owambe-uploads \
    --policy file://bucket-policy.json
```

#### Step 3: Deploy to ECS

1. Build and push Docker image to ECR
2. Create ECS task definition
3. Create ECS service
4. Configure Application Load Balancer
5. Setup auto-scaling

(Detailed AWS deployment guide available separately)

---

## 5. Database Setup

### 5.1 Create Database

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE owambe_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Create user
CREATE USER 'owambe'@'localhost' IDENTIFIED BY 'secure_password_here';

# Grant privileges
GRANT ALL PRIVILEGES ON owambe_prod.* TO 'owambe'@'localhost';

# Flush privileges
FLUSH PRIVILEGES;

# Exit
EXIT;
```

### 5.2 Run Migrations

The project uses Drizzle ORM for database migrations.

```bash
# Generate migration files (if schema changed)
pnpm drizzle-kit generate

# Push schema to database
pnpm db:push

# This creates all 18 tables:
# - users
# - events
# - venues
# - hotels
# - vendors
# - bookings
# - vendorBookings
# - posts
# - partnerPosts
# - likes
# - comments
# - follows
# - cart
# - wishlist
# - userInterests
# - b2bPartners
# - availability
# - discounts
# - gdsChannels
# - propertyDistribution
# - payments
# - vendorReviews
```

### 5.3 Seed Sample Data (Optional)

```bash
# Run seed script
npx tsx scripts/seed.ts

# This creates:
# - 3 sample venues
# - 3 sample hotels
# - 6 sample events
# - 3 sample social posts

# Run vendor seed script
npx tsx scripts/seed-vendors.ts

# This creates:
# - 5 sample vendors (one of each type)
```

### 5.4 Database Backup

```bash
# Create backup script
sudo nano /usr/local/bin/backup-owambe-db.sh
```

Add the following:

```bash
#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/var/backups/owambe"
DB_NAME="owambe_prod"
DB_USER="owambe"
DB_PASS="your_password"

# Create backup directory if not exists
mkdir -p $BACKUP_DIR

# Backup database
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME | gzip > $BACKUP_DIR/owambe_${TIMESTAMP}.sql.gz

# Keep only last 30 days of backups
find $BACKUP_DIR -name "owambe_*.sql.gz" -mtime +30 -delete

echo "Backup completed: owambe_${TIMESTAMP}.sql.gz"
```

Make executable and schedule:

```bash
# Make executable
sudo chmod +x /usr/local/bin/backup-owambe-db.sh

# Add to crontab (daily at 2 AM)
sudo crontab -e

# Add this line:
0 2 * * * /usr/local/bin/backup-owambe-db.sh
```

---

## 6. Configuration

### 6.1 Application Configuration

**Port Configuration**:
- Default port: 3000
- Change in `.env`: `PORT=3000`
- Update Nginx proxy_pass if changed

**Session Configuration**:
- JWT expiration: Configurable in `server/_core/cookies.ts`
- Default: 7 days
- Adjust based on security requirements

**File Upload Limits**:
- Default: 10MB
- Change in Nginx: `client_max_body_size 10M;`
- Change in application if needed

### 6.2 Performance Tuning

**Node.js**:
```bash
# Increase memory limit if needed
NODE_OPTIONS="--max-old-space-size=4096" pm2 start ecosystem.config.js
```

**MySQL**:
```sql
# Edit MySQL configuration
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf

# Add/modify:
[mysqld]
max_connections = 500
innodb_buffer_pool_size = 2G
innodb_log_file_size = 512M
query_cache_size = 64M
```

**Nginx**:
```nginx
# Edit Nginx configuration
sudo nano /etc/nginx/nginx.conf

# Add/modify:
worker_processes auto;
worker_connections 1024;
keepalive_timeout 65;
```

### 6.3 Security Hardening

**Disable Root Login**:
```bash
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
sudo systemctl restart sshd
```

**Setup Fail2Ban**:
```bash
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

**Regular Updates**:
```bash
# Setup unattended upgrades
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## 7. Testing Deployment

### 7.1 Health Checks

**Application Health**:
```bash
# Check if application is running
curl http://localhost:3000/api/health

# Expected response: {"status":"ok"}
```

**Database Connection**:
```bash
# Test database connection
mysql -u owambe -p -e "SELECT 1;"
```

**Nginx Status**:
```bash
# Check Nginx status
sudo systemctl status nginx

# Test configuration
sudo nginx -t
```

### 7.2 Functional Testing

**Test User Flow**:
1. Visit homepage
2. Browse events
3. Click on an event
4. Sign in
5. Book an event
6. Check dashboard
7. View booking

**Test Partner Flow**:
1. Visit partner dashboard
2. View analytics
3. Check bookings
4. Manage calendar
5. Create discount
6. Post to community

### 7.3 Performance Testing

```bash
# Install Apache Bench
sudo apt install apache2-utils

# Test homepage
ab -n 1000 -c 10 https://owambe.com/

# Test API endpoint
ab -n 1000 -c 10 https://owambe.com/api/trpc/events.list
```

---

## 8. Monitoring & Maintenance

### 8.1 Application Monitoring

**PM2 Monitoring**:
```bash
# View application status
pm2 status

# View logs
pm2 logs owambe-platform

# Monitor resources
pm2 monit

# View detailed info
pm2 info owambe-platform
```

**Setup PM2 Plus** (Optional):
```bash
# Link to PM2 Plus for advanced monitoring
pm2 link <secret> <public>
```

### 8.2 Log Management

**Application Logs**:
```bash
# View logs
pm2 logs owambe-platform

# Clear logs
pm2 flush

# Rotate logs
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

**Nginx Logs**:
```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log

# Setup log rotation
sudo nano /etc/logrotate.d/nginx
```

### 8.3 Database Maintenance

**Optimize Tables**:
```sql
# Run monthly
OPTIMIZE TABLE events, venues, hotels, bookings;
```

**Check Database Size**:
```sql
SELECT 
    table_schema AS 'Database',
    SUM(data_length + index_length) / 1024 / 1024 AS 'Size (MB)'
FROM information_schema.TABLES
WHERE table_schema = 'owambe_prod'
GROUP BY table_schema;
```

### 8.4 Update Procedures

**Application Updates**:
```bash
# Pull latest code
cd /var/www/owambe-platform
git pull origin main

# Install dependencies
pnpm install

# Build application
pnpm build

# Restart application
pm2 restart owambe-platform

# Check status
pm2 status
```

**Database Migrations**:
```bash
# Run new migrations
pnpm db:push

# Verify changes
mysql -u owambe -p owambe_prod -e "SHOW TABLES;"
```

---

## 9. Troubleshooting

### 9.1 Common Issues

**Application Won't Start**:
```bash
# Check logs
pm2 logs owambe-platform --lines 100

# Common causes:
# - Database connection failed
# - Port already in use
# - Missing environment variables
# - Node version mismatch

# Solutions:
# - Verify DATABASE_URL in .env
# - Check if port 3000 is available: lsof -i :3000
# - Review .env file
# - Verify Node version: node --version
```

**Database Connection Errors**:
```bash
# Test database connection
mysql -u owambe -p -h localhost owambe_prod

# Check MySQL status
sudo systemctl status mysql

# Review MySQL logs
sudo tail -f /var/log/mysql/error.log

# Common fixes:
# - Restart MySQL: sudo systemctl restart mysql
# - Check credentials in .env
# - Verify database exists
# - Check firewall rules
```

**Nginx 502 Bad Gateway**:
```bash
# Check if application is running
pm2 status

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Test application directly
curl http://localhost:3000

# Common fixes:
# - Restart application: pm2 restart owambe-platform
# - Check proxy_pass in Nginx config
# - Verify port 3000 is accessible
```

**SSL Certificate Issues**:
```bash
# Renew certificate
sudo certbot renew

# Check certificate status
sudo certbot certificates

# Test SSL configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 9.2 Performance Issues

**High CPU Usage**:
```bash
# Check process resources
pm2 monit

# Check system resources
htop

# Solutions:
# - Scale to more instances
# - Optimize database queries
# - Add caching layer
# - Upgrade server resources
```

**High Memory Usage**:
```bash
# Check memory usage
free -h
pm2 info owambe-platform

# Solutions:
# - Restart application: pm2 restart owambe-platform
# - Increase max_memory_restart in ecosystem.config.js
# - Check for memory leaks
# - Upgrade RAM
```

**Slow Database Queries**:
```sql
# Enable slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;

# Review slow queries
sudo tail -f /var/log/mysql/slow-query.log

# Solutions:
# - Add indexes to frequently queried columns
# - Optimize queries
# - Increase innodb_buffer_pool_size
# - Use read replicas
```

---

## 10. Complete Page Inventory

### 10.1 Public Pages (No Authentication Required)

| Page | Route | Description | Status |
|------|-------|-------------|--------|
| Homepage | `/` | Landing page with featured events | ✅ Complete |
| Events Listing | `/events` | Browse all events | ✅ Complete |
| Event Detail | `/events/:id` | View event details and book | ✅ Complete |
| Venues Listing | `/venues` | Browse all venues | ✅ Complete |
| Venue Detail | `/venues/:id` | View venue details (Future) | 🔄 Planned |
| Hotels Listing | `/hotels` | Browse all hotels | ✅ Complete |
| Hotel Detail | `/hotels/:id` | View hotel details (Future) | 🔄 Planned |
| Vendors Listing | `/vendors` | Browse all vendors | ✅ Complete |
| Vendor Detail | `/vendors/:id` | View vendor profile and book | ✅ Complete |
| Community Feed | `/social` | Social commerce feed | ✅ Complete |
| 404 Page | `/404` | Not found page | ✅ Complete |

### 10.2 Authenticated User Pages

| Page | Route | Description | Status |
|------|-------|-------------|--------|
| User Dashboard | `/dashboard` | User activity hub | ✅ Complete |
| My Bookings | `/bookings` | View all bookings | ✅ Complete |

**Dashboard Tabs**:
- Bookings Tab - All user bookings ✅
- Wishlist Tab - Saved items ✅
- Cart Tab - Items ready for checkout ✅
- My Posts Tab - User's community posts ✅
- Liked Tab - Posts user has liked ✅

### 10.3 Partner Pages (Business Owners)

| Page | Route | Description | Status |
|------|-------|-------------|--------|
| Partner Dashboard | `/partner` | Business management hub | ✅ Complete |

**Partner Dashboard Tabs**:
- Bookings Tab - Manage incoming bookings ✅
- Venues Tab - Manage venue listings ✅
- Hotels Tab - Manage hotel listings ✅
- Calendar Tab - Availability management ✅
- Discounts Tab - Promotional codes ✅
- Distribution Tab - GDS channel management ✅

### 10.4 API Endpoints

**Authentication**:
- `auth.me` - Get current user ✅
- `auth.logout` - Logout user ✅

**Events**:
- `events.list` - List all events ✅
- `events.getById` - Get event by ID ✅
- `events.create` - Create event (protected) ✅

**Venues**:
- `venues.list` - List all venues ✅
- `venues.getById` - Get venue by ID ✅
- `venues.create` - Create venue (protected) ✅

**Hotels**:
- `hotels.list` - List all hotels ✅
- `hotels.getById` - Get hotel by ID ✅
- `hotels.create` - Create hotel (protected) ✅

**Vendors**:
- `vendors.list` - List all vendors ✅
- `vendors.getById` - Get vendor by ID ✅
- `vendors.create` - Create vendor (protected) ✅

**Bookings**:
- `bookings.myBookings` - User's bookings (protected) ✅
- `bookings.create` - Create booking (protected) ✅

**Vendor Bookings**:
- `vendorBookings.myBookings` - User's vendor bookings (protected) ✅
- `vendorBookings.create` - Create vendor booking (protected) ✅

**Dashboard**:
- `dashboard.getWishlist` - Get wishlist (protected) ✅
- `dashboard.addToWishlist` - Add to wishlist (protected) ✅
- `dashboard.removeFromWishlist` - Remove from wishlist (protected) ✅
- `dashboard.getCart` - Get cart (protected) ✅
- `dashboard.addToCart` - Add to cart (protected) ✅
- `dashboard.removeFromCart` - Remove from cart (protected) ✅
- `dashboard.getMyPosts` - Get user posts (protected) ✅
- `dashboard.getMyLikes` - Get liked posts (protected) ✅

**Social**:
- `social.posts` - Get posts ✅
- `social.getAllPosts` - Get all posts ✅
- `social.getPartnerPosts` - Get partner posts ✅
- `social.getPersonalizedFeed` - Get personalized feed (protected) ✅
- `social.createPost` - Create post (protected) ✅
- `social.likePost` - Like post (protected) ✅
- `social.addComment` - Add comment (protected) ✅

### 10.5 Database Tables

| Table | Purpose | Rows (Sample) | Status |
|-------|---------|---------------|--------|
| users | User accounts | Variable | ✅ |
| events | Event listings | 6 | ✅ |
| venues | Venue listings | 3 | ✅ |
| hotels | Hotel listings | 3 | ✅ |
| vendors | Vendor profiles | 5 | ✅ |
| bookings | Event/venue/hotel bookings | Variable | ✅ |
| vendorBookings | Vendor service bookings | Variable | ✅ |
| posts | User posts | 3 | ✅ |
| partnerPosts | Partner promotional posts | Variable | ✅ |
| likes | Post likes | Variable | ✅ |
| comments | Post comments | Variable | ✅ |
| follows | User follows | Variable | ✅ |
| cart | Shopping cart items | Variable | ✅ |
| wishlist | Saved items | Variable | ✅ |
| userInterests | User preferences | Variable | ✅ |
| b2bPartners | Partner accounts | Variable | ✅ |
| availability | Calendar availability | Variable | ✅ |
| discounts | Promotional codes | Variable | ✅ |
| gdsChannels | Distribution channels | Variable | ✅ |
| propertyDistribution | Channel mappings | Variable | ✅ |
| payments | Payment records | Variable | 🔄 Future |
| vendorReviews | Vendor ratings | Variable | 🔄 Future |

---

## 11. Support & Resources

### 11.1 Documentation

- **SRS Document**: `docs/SRS.md`
- **Technical Design**: `docs/TECHNICAL_DESIGN.md`
- **User Walkthrough**: `docs/USER_WALKTHROUGH.md`
- **API Documentation**: `docs/API.md` (Future)
- **Database Schema**: `drizzle/schema.ts`

### 11.2 Useful Commands

```bash
# Application Management
pm2 start ecosystem.config.js    # Start application
pm2 stop owambe-platform         # Stop application
pm2 restart owambe-platform      # Restart application
pm2 reload owambe-platform       # Zero-downtime reload
pm2 logs owambe-platform         # View logs
pm2 monit                        # Monitor resources

# Database Management
pnpm db:push                     # Push schema changes
mysql -u owambe -p owambe_prod   # Connect to database
mysqldump -u owambe -p owambe_prod > backup.sql  # Backup database

# Nginx Management
sudo nginx -t                    # Test configuration
sudo systemctl reload nginx      # Reload Nginx
sudo systemctl restart nginx     # Restart Nginx
sudo tail -f /var/log/nginx/error.log  # View error logs

# System Management
sudo systemctl status mysql      # Check MySQL status
sudo systemctl status nginx      # Check Nginx status
htop                            # Monitor system resources
df -h                           # Check disk space
free -h                         # Check memory usage
```

### 11.3 Emergency Contacts

**Technical Support**:
- Email: devops@owambe.com
- Phone: +234 XXX XXX XXXX
- Slack: #owambe-support

**Escalation**:
- Technical Lead: lead@owambe.com
- CTO: cto@owambe.com

---

## 12. Deployment Checklist

### Pre-Deployment

- [ ] Code reviewed and tested
- [ ] Environment variables configured
- [ ] Database backup created
- [ ] SSL certificate obtained
- [ ] Domain DNS configured
- [ ] Firewall rules configured
- [ ] Monitoring setup
- [ ] Backup strategy in place

### Deployment

- [ ] Application built successfully
- [ ] Database migrations run
- [ ] PM2 started and saved
- [ ] Nginx configured and tested
- [ ] SSL working correctly
- [ ] Health checks passing
- [ ] Logs accessible

### Post-Deployment

- [ ] Functional testing completed
- [ ] Performance testing passed
- [ ] Monitoring active
- [ ] Backups verified
- [ ] Documentation updated
- [ ] Team notified
- [ ] Rollback plan ready

---

## 13. Rollback Procedure

If deployment fails:

```bash
# 1. Stop current application
pm2 stop owambe-platform

# 2. Restore previous version
cd /var/www/owambe-platform
git reset --hard <previous-commit-hash>

# 3. Restore database (if needed)
mysql -u owambe -p owambe_prod < /var/backups/owambe/backup.sql

# 4. Rebuild application
pnpm install
pnpm build

# 5. Restart application
pm2 restart owambe-platform

# 6. Verify
curl http://localhost:3000/api/health
```

---

**Deployment Handoff Complete**

This document provides comprehensive instructions for deploying the Owambe Platform to production. For questions or issues, contact the development team.

**Document Version**: 1.0  
**Last Updated**: October 23, 2025  
**Next Review**: January 2026

---

**Prepared by**: Development Team  
**Approved by**: Technical Lead  
**Date**: October 23, 2025

