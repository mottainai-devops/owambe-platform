# Owambe Platform - Complete Deployment Guide

**Version:** 2.0 Final  
**Date:** October 23, 2025  
**Status:** Production Ready

---

## Overview

This guide provides complete instructions for deploying the Owambe platform to production. The platform is a comprehensive event, venue, and hotel booking system with social commerce features, agent management, payment processing, and administrative controls.

---

## System Requirements

### Minimum Requirements
The Owambe platform requires a modern hosting environment with the following minimum specifications:

**Server Specifications:**
- CPU: 2 cores (4 cores recommended for production)
- RAM: 4GB minimum (8GB recommended)
- Storage: 20GB SSD (50GB recommended for growth)
- Operating System: Ubuntu 22.04 LTS or later

**Database Requirements:**
- MySQL 8.0+ or TiDB Cloud
- Minimum 2GB RAM allocated to database
- SSD storage for optimal performance

**Network Requirements:**
- Static IP address or domain name
- SSL certificate (Let's Encrypt recommended)
- Minimum 100Mbps bandwidth

### Software Dependencies
The platform requires Node.js 22.13.0 and pnpm package manager. All other dependencies are managed through the package.json file and will be installed during the deployment process.

---

## Pre-Deployment Preparation

### 1. Database Setup

The platform uses MySQL or TiDB as its database. You need to create a database instance and obtain the connection string before deployment.

**For MySQL:**
```sql
CREATE DATABASE owambe CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'owambe_user'@'%' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON owambe.* TO 'owambe_user'@'%';
FLUSH PRIVILEGES;
```

**Connection String Format:**
```
mysql://owambe_user:secure_password@hostname:3306/owambe
```

**For TiDB Cloud:**
Sign up at tidbcloud.com, create a serverless cluster, and copy the connection string provided in the dashboard.

### 2. Payment Gateway Setup

The platform integrates with Paystack for payment processing. You need to create a Paystack account and obtain API keys.

**Steps:**
1. Visit paystack.com and create an account
2. Complete business verification
3. Navigate to Settings → API Keys & Webhooks
4. Copy your Secret Key (sk_live_xxx) and Public Key (pk_live_xxx)
5. Set up webhook URL: `https://yourdomain.com/api/payment/webhook`

### 3. Domain and SSL

Purchase a domain name and configure DNS to point to your server IP address. SSL certificates can be obtained free from Let's Encrypt using Certbot.

**DNS Configuration:**
```
A Record: @ → Your Server IP
A Record: www → Your Server IP
```

### 4. Environment Variables

Create a `.env` file in the project root with all required variables. Never commit this file to version control.

**Required Variables:**
```env
# Database
DATABASE_URL=mysql://user:password@host:port/database

# Authentication (provided by Manus)
JWT_SECRET=your-jwt-secret-min-32-chars
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im

# Payment (from Paystack)
PAYSTACK_SECRET_KEY=sk_live_xxxxxxxxxxxxx
PAYSTACK_PUBLIC_KEY=pk_live_xxxxxxxxxxxxx

# Application
VITE_APP_ID=your-manus-app-id
VITE_APP_TITLE=Owambe - Event, Venue & Hotel Booking Platform
VITE_APP_LOGO=https://your-cdn.com/logo.png
VITE_APP_URL=https://owambe.com
NODE_ENV=production
PORT=3000

# Manus Built-in Services
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your-manus-api-key

# Owner Information
OWNER_OPEN_ID=your-owner-id
OWNER_NAME=Your Name
```

---

## Deployment Methods

### Method 1: Traditional VPS Deployment

This method is suitable for deploying on any VPS provider (DigitalOcean, Linode, AWS EC2, etc.).

**Step 1: Server Setup**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 22.x
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Install pnpm
npm install -g pnpm

# Install PM2 for process management
npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

**Step 2: Clone and Setup Project**
```bash
# Clone repository
cd /var/www
sudo git clone <your-repo-url> owambe
cd owambe
sudo chown -R $USER:$USER /var/www/owambe

# Install dependencies
pnpm install

# Create .env file
nano .env
# (Paste your environment variables)

# Run database migrations
pnpm db:push

# Build frontend
pnpm build
```

**Step 3: Configure Nginx**
```bash
sudo nano /etc/nginx/sites-available/owambe
```

```nginx
server {
    listen 80;
    server_name owambe.com www.owambe.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    client_max_body_size 50M;
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/owambe /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL
sudo certbot --nginx -d owambe.com -d www.owambe.com
```

**Step 4: Start Application with PM2**
```bash
cd /var/www/owambe
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

**Step 5: Setup Monitoring**
```bash
# Monitor application
pm2 monit

# View logs
pm2 logs owambe-platform

# Restart if needed
pm2 restart owambe-platform
```

### Method 2: Docker Deployment

This method provides containerized deployment for easier management and scaling.

**Step 1: Create Dockerfile**
```dockerfile
FROM node:22-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy application code
COPY . .

# Build frontend
RUN pnpm build

# Expose port
EXPOSE 3000

# Start application
CMD ["pnpm", "start"]
```

**Step 2: Create docker-compose.yml**
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: owambe
      MYSQL_USER: owambe_user
      MYSQL_PASSWORD: ${DB_PASSWORD}
    volumes:
      - db_data:/var/lib/mysql
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - /etc/letsencrypt:/etc/letsencrypt
    depends_on:
      - app
    restart: unless-stopped

volumes:
  db_data:
```

**Step 3: Deploy**
```bash
# Build and start containers
docker-compose up -d

# View logs
docker-compose logs -f

# Run migrations
docker-compose exec app pnpm db:push

# Restart services
docker-compose restart
```

### Method 3: Cloud Platform Deployment

The platform can be deployed to various cloud platforms with minimal configuration.

**Vercel Deployment:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
```

**Railway Deployment:**
1. Connect GitHub repository to Railway
2. Add environment variables in Railway dashboard
3. Railway will automatically detect and deploy

**Render Deployment:**
1. Create new Web Service in Render
2. Connect GitHub repository
3. Set build command: `pnpm install && pnpm build`
4. Set start command: `pnpm start`
5. Add environment variables

---

## Post-Deployment Configuration

### 1. Database Seeding (Optional)

If you want to populate the database with sample data for testing:

```bash
cd /var/www/owambe
npx tsx scripts/seed.ts
npx tsx scripts/seed-vendors.ts
```

### 2. Create First Admin User

The first user to register will automatically become an admin if their ID matches the `OWNER_OPEN_ID` environment variable. Alternatively, you can manually update the user role in the database:

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@owambe.com';
```

### 3. Configure Payment Webhook

In your Paystack dashboard, set the webhook URL to:
```
https://yourdomain.com/api/payment/webhook
```

### 4. Test Payment Flow

Before going live, test the complete payment flow:
1. Create a test booking
2. Proceed to checkout
3. Use Paystack test card: 4084084084084081
4. Verify payment confirmation
5. Check booking status updated to "confirmed"

### 5. Setup Monitoring

Configure application monitoring to track errors and performance:

**Sentry Integration (Recommended):**
```bash
pnpm add @sentry/node @sentry/react
```

Add to `server/_core/index.ts`:
```typescript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

**PM2 Monitoring:**
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### 6. Setup Backups

Configure automated database backups:

**MySQL Backup Script:**
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/owambe"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

mysqldump -u owambe_user -p$DB_PASSWORD owambe | gzip > $BACKUP_DIR/owambe_$DATE.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -name "owambe_*.sql.gz" -mtime +30 -delete
```

**Setup Cron Job:**
```bash
crontab -e
# Add: 0 2 * * * /path/to/backup-script.sh
```

---

## Maintenance & Updates

### Regular Maintenance Tasks

**Daily:**
- Monitor application logs for errors
- Check payment transaction status
- Review support tickets

**Weekly:**
- Review database performance
- Analyze user feedback
- Update content and promotions

**Monthly:**
- Apply security updates
- Optimize database queries
- Review and update documentation

### Updating the Application

When updates are available:

```bash
# Backup database first
mysqldump -u owambe_user -p owambe > backup_$(date +%Y%m%d).sql

# Pull latest code
cd /var/www/owambe
git pull origin main

# Install new dependencies
pnpm install

# Run migrations
pnpm db:push

# Rebuild frontend
pnpm build

# Restart application
pm2 restart owambe-platform

# Verify deployment
curl https://owambe.com
```

### Rollback Procedure

If an update causes issues:

```bash
# Restore database
mysql -u owambe_user -p owambe < backup_YYYYMMDD.sql

# Revert code
git reset --hard <previous-commit-hash>

# Rebuild
pnpm install
pnpm build

# Restart
pm2 restart owambe-platform
```

---

## Troubleshooting

### Common Issues and Solutions

**Issue: Application won't start**
- Check environment variables are set correctly
- Verify database connection string
- Check Node.js version (must be 22.x)
- Review logs: `pm2 logs owambe-platform`

**Issue: Payment not working**
- Verify Paystack keys are correct (live keys for production)
- Check webhook URL is configured in Paystack dashboard
- Ensure HTTPS is enabled
- Review payment logs in database

**Issue: Database connection errors**
- Verify DATABASE_URL format
- Check database server is running
- Ensure firewall allows connection
- Test connection: `mysql -h host -u user -p`

**Issue: High memory usage**
- Restart PM2: `pm2 restart owambe-platform`
- Check for memory leaks in logs
- Consider upgrading server RAM
- Enable database query caching

**Issue: Slow page load**
- Enable Nginx gzip compression
- Configure browser caching
- Optimize database queries
- Use CDN for static assets

---

## Security Checklist

Before going live, ensure all security measures are in place:

- ✅ SSL certificate installed and auto-renewal configured
- ✅ Environment variables secured (not in version control)
- ✅ Database user has minimum required privileges
- ✅ Firewall configured (allow only 80, 443, 22)
- ✅ SSH key authentication enabled (password auth disabled)
- ✅ Regular backups configured and tested
- ✅ Monitoring and alerting setup
- ✅ Rate limiting enabled for APIs
- ✅ CORS configured properly
- ✅ Security headers configured in Nginx
- ✅ Dependencies updated to latest secure versions

---

## Performance Optimization

### Nginx Caching

Add to Nginx configuration:

```nginx
# Cache static assets
location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# Enable gzip
gzip on;
gzip_vary on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
```

### Database Optimization

```sql
# Add indexes for common queries
CREATE INDEX idx_events_date ON events(eventDate);
CREATE INDEX idx_bookings_user ON bookings(userId);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_payments_reference ON payments(paymentReference);
```

### Application Optimization

```typescript
// Enable production optimizations in vite.config.ts
export default defineConfig({
  build: {
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          trpc: ['@trpc/client', '@trpc/react-query'],
        },
      },
    },
  },
});
```

---

## Scaling Considerations

### Phase 1: Single Server (0-10K users)
Current deployment is sufficient. Monitor performance and optimize as needed.

### Phase 2: Horizontal Scaling (10K-100K users)

**Add Load Balancer:**
```nginx
upstream owambe_backend {
    server 10.0.0.1:3000;
    server 10.0.0.2:3000;
    server 10.0.0.3:3000;
}

server {
    location / {
        proxy_pass http://owambe_backend;
    }
}
```

**Add Redis Caching:**
```bash
# Install Redis
sudo apt install redis-server

# Configure in application
pnpm add ioredis
```

**Database Read Replicas:**
Configure MySQL replication for read-heavy queries.

### Phase 3: Microservices (100K+ users)

Consider breaking into separate services:
- User Service
- Booking Service
- Payment Service
- Notification Service
- Search Service

---

## Support & Resources

### Documentation
- **SRS:** `/docs/SRS.md`
- **Technical Design:** `/docs/TECHNICAL_DESIGN.md`
- **User Guide:** `/docs/USER_WALKTHROUGH.md`
- **Implementation Status:** `/docs/FINAL_IMPLEMENTATION_STATUS.md`

### Getting Help
- Check logs: `pm2 logs owambe-platform`
- Review documentation in `/docs` folder
- Contact development team
- Check GitHub issues (if applicable)

### Useful Commands

```bash
# Application Management
pm2 start owambe-platform
pm2 stop owambe-platform
pm2 restart owambe-platform
pm2 logs owambe-platform
pm2 monit

# Database
pnpm db:push          # Run migrations
pnpm db:studio        # Open database GUI

# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server

# Maintenance
pm2 flush             # Clear logs
pm2 save              # Save PM2 config
pm2 resurrect         # Restore PM2 processes
```

---

## Conclusion

The Owambe platform is production-ready and can be deployed using any of the methods described in this guide. The recommended approach for most deployments is the Traditional VPS method with PM2 and Nginx, as it provides the best balance of control, performance, and cost-effectiveness.

After deployment, monitor the application closely for the first few days to ensure everything is working as expected. Set up proper monitoring and alerting to catch issues before they affect users.

For questions or support, refer to the documentation in the `/docs` folder or contact the development team.

**Good luck with your deployment!**

---

*Last Updated: October 23, 2025*

