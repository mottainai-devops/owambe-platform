# Owambe Platform - Developer Deployment Handoff

## 📋 Executive Summary

**Project**: Owambe - Event, Venue & Hotel Booking Platform  
**Version**: 29a2aca6  
**Status**: Production-Ready  
**Tech Stack**: React 19, Express 4, tRPC 11, MySQL, TypeScript  
**Deployment Target**: Web Application (B2C + B2B)

---

## 🏗️ Architecture Overview

### Application Structure
```
owambe-platform/
├── client/              # React frontend (SPA)
├── server/              # Express + tRPC backend
├── drizzle/             # Database schema & migrations
├── shared/              # Shared types & constants
└── scripts/             # Utility scripts (seed, etc.)
```

### Technology Stack

**Frontend**
- React 19 with TypeScript
- Vite (build tool)
- Tailwind CSS 4 + shadcn/ui
- Wouter (routing)
- tRPC React Query client

**Backend**
- Node.js 22+
- Express 4
- tRPC 11 (API layer)
- Drizzle ORM
- MySQL/TiDB database

**Authentication**
- Manus OAuth (can be replaced with your OAuth provider)
- JWT-based sessions
- Cookie-based authentication

---

## 🔧 Environment Variables

### Required Environment Variables

Create a `.env` file in the project root with the following variables:

```bash
# Database Configuration
DATABASE_URL="mysql://user:password@host:port/database"

# Authentication (Manus OAuth - Replace with your provider)
JWT_SECRET="your-secure-jwt-secret-min-32-chars"
OAUTH_SERVER_URL="https://your-oauth-server.com"
VITE_OAUTH_PORTAL_URL="https://your-oauth-portal.com"
VITE_APP_ID="your-app-id"
OWNER_OPEN_ID="owner-user-id"
OWNER_NAME="Owner Name"

# Application Configuration
VITE_APP_TITLE="Owambe - Event, Venue & Hotel Booking Platform"
VITE_APP_LOGO="/logo.svg"
NODE_ENV="production"
PORT="3000"

# Built-in Services (Optional - for Manus platform features)
BUILT_IN_FORGE_API_URL="https://api.manus.im"
BUILT_IN_FORGE_API_KEY="your-api-key"

# Analytics (Optional)
VITE_ANALYTICS_ENDPOINT="https://analytics.example.com"
VITE_ANALYTICS_WEBSITE_ID="your-website-id"
```

### Environment-Specific Configurations

**Development**
```bash
NODE_ENV="development"
DATABASE_URL="mysql://localhost:3306/owambe_dev"
```

**Staging**
```bash
NODE_ENV="staging"
DATABASE_URL="mysql://staging-db:3306/owambe_staging"
```

**Production**
```bash
NODE_ENV="production"
DATABASE_URL="mysql://production-db:3306/owambe_production"
```

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 22.x or higher
- pnpm 8.x or higher
- MySQL 8.x or TiDB compatible database
- Git

### Initial Setup

```bash
# 1. Clone the repository
git clone <repository-url>
cd owambe-platform

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# 4. Generate database schema
pnpm db:push

# 5. Seed sample data (optional for testing)
npx tsx scripts/seed.ts

# 6. Build the application
pnpm build

# 7. Start production server
pnpm start
```

---

## 🗄️ Database Setup

### Database Schema

The application uses **11 tables**:
- `users` - User accounts
- `events` - Event listings
- `venues` - Venue listings
- `hotels` - Hotel listings
- `bookings` - Booking records
- `payments` - Payment transactions
- `posts` - Social posts
- `comments` - Post comments
- `likes` - Post likes
- `follows` - User follows
- `b2bPartners` - Partner accounts

### Migration Commands

```bash
# Generate migration files
pnpm db:generate

# Apply migrations to database
pnpm db:push

# View current schema
pnpm db:studio
```

### Database Backup & Restore

```bash
# Backup
mysqldump -u username -p owambe_production > backup_$(date +%Y%m%d).sql

# Restore
mysql -u username -p owambe_production < backup_20250101.sql
```

---

## 🚀 Deployment Options

### Option 1: Traditional VPS/Server Deployment

**Recommended Stack**: Ubuntu 22.04 + Nginx + PM2

#### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Install pnpm
npm install -g pnpm

# Install PM2
npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

#### 2. Application Deployment

```bash
# Clone and setup
cd /var/www
sudo git clone <repository-url> owambe
cd owambe
sudo chown -R $USER:$USER .

# Install and build
pnpm install --prod
pnpm build

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### 3. Nginx Configuration

Create `/etc/nginx/sites-available/owambe`:

```nginx
server {
    listen 80;
    server_name owambe.com www.owambe.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name owambe.com www.owambe.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/owambe.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/owambe.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Proxy to Node.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/owambe /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 4. SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d owambe.com -d www.owambe.com
```

---

### Option 2: Docker Deployment

#### Dockerfile

Create `Dockerfile` in project root:

```dockerfile
FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN pnpm build

# Production image
FROM node:22-alpine

WORKDIR /app

RUN npm install -g pnpm

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3000

CMD ["node", "dist/server/_core/index.js"]
```

#### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=mysql://owambe:password@db:3306/owambe
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=rootpassword
      - MYSQL_DATABASE=owambe
      - MYSQL_USER=owambe
      - MYSQL_PASSWORD=password
    volumes:
      - mysql_data:/var/lib/mysql
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  mysql_data:
```

Deploy with Docker:
```bash
docker-compose up -d
```

---

### Option 3: Cloud Platform Deployment

#### Vercel (Frontend + Serverless Functions)

**Not Recommended** - This is a full-stack Express app, not suitable for Vercel's serverless model.

#### Railway / Render / Fly.io

1. Connect your Git repository
2. Set environment variables in dashboard
3. Configure build command: `pnpm build`
4. Configure start command: `pnpm start`
5. Add MySQL database addon
6. Deploy

#### AWS (EC2 + RDS)

1. **Launch EC2 Instance** (t3.medium or higher)
2. **Set up RDS MySQL** instance
3. Follow VPS deployment steps above
4. Configure security groups for ports 80, 443
5. Use Elastic IP for static IP address
6. Optional: Use CloudFront for CDN

---

## 🔐 Security Checklist

### Pre-Deployment Security

- [ ] Change all default passwords
- [ ] Generate strong JWT_SECRET (min 32 characters)
- [ ] Configure CORS properly
- [ ] Enable HTTPS/SSL certificates
- [ ] Set secure cookie flags
- [ ] Configure rate limiting
- [ ] Enable SQL injection protection (Drizzle ORM handles this)
- [ ] Sanitize user inputs
- [ ] Configure CSP headers
- [ ] Set up database backups
- [ ] Configure firewall rules
- [ ] Disable directory listing
- [ ] Remove development dependencies in production

### Security Headers

Add to Nginx or Express middleware:

```javascript
// Express middleware
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});
```

---

## 📊 Monitoring & Logging

### Application Monitoring

**Recommended Tools**:
- **PM2 Plus** - Process monitoring
- **New Relic** - APM
- **Sentry** - Error tracking
- **LogRocket** - Session replay

### Setup PM2 Monitoring

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Log Files

```bash
# View logs
pm2 logs owambe

# Log locations
~/.pm2/logs/owambe-out.log
~/.pm2/logs/owambe-error.log
```

---

## 🧪 Testing Before Deployment

### Pre-Deployment Checklist

```bash
# 1. Run type checking
pnpm typecheck

# 2. Build application
pnpm build

# 3. Test production build locally
NODE_ENV=production pnpm start

# 4. Test all routes
curl http://localhost:3000/
curl http://localhost:3000/events
curl http://localhost:3000/venues
curl http://localhost:3000/hotels
curl http://localhost:3000/social
curl http://localhost:3000/partner

# 5. Test API endpoints
curl http://localhost:3000/api/trpc/events.list

# 6. Check database connection
# Visit /api/health (if implemented)
```

### Load Testing

```bash
# Install Apache Bench
sudo apt install apache2-utils

# Test with 1000 requests, 10 concurrent
ab -n 1000 -c 10 http://localhost:3000/
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '22'
          
      - name: Install pnpm
        run: npm install -g pnpm
        
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        
      - name: Type check
        run: pnpm typecheck
        
      - name: Build
        run: pnpm build
        
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/owambe
            git pull origin main
            pnpm install --prod
            pnpm build
            pm2 reload owambe
```

---

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Errors
```bash
# Check database is running
sudo systemctl status mysql

# Test connection
mysql -u username -p -h host database

# Check DATABASE_URL format
# mysql://username:password@host:port/database
```

#### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

#### Build Failures
```bash
# Clear cache and rebuild
rm -rf node_modules dist
pnpm install
pnpm build
```

#### PM2 Not Starting
```bash
# Check logs
pm2 logs owambe --lines 100

# Restart
pm2 restart owambe

# Delete and recreate
pm2 delete owambe
pm2 start ecosystem.config.js
```

---

## 📞 Support & Maintenance

### Regular Maintenance Tasks

**Daily**
- Monitor error logs
- Check application uptime
- Review performance metrics

**Weekly**
- Database backup verification
- Security updates check
- Performance optimization review

**Monthly**
- Dependency updates
- Security audit
- Database optimization
- SSL certificate renewal check

### Update Procedure

```bash
# 1. Backup database
mysqldump -u user -p owambe > backup_$(date +%Y%m%d).sql

# 2. Pull latest code
git pull origin main

# 3. Install dependencies
pnpm install --prod

# 4. Run migrations
pnpm db:push

# 5. Build application
pnpm build

# 6. Reload PM2
pm2 reload owambe

# 7. Verify deployment
curl https://owambe.com/api/health
```

---

## 📝 Additional Notes

### Authentication Replacement

The current implementation uses **Manus OAuth**. To replace with your own OAuth provider:

1. Update `server/_core/auth.ts`
2. Modify OAuth callback handler
3. Update environment variables
4. Test authentication flow

### Payment Integration

The database schema includes a `payments` table ready for integration. Recommended providers:
- **Paystack** (Nigerian payments)
- **Flutterwave** (African payments)
- **Stripe** (International)

### Scaling Considerations

**Horizontal Scaling**
- Use load balancer (Nginx, HAProxy)
- Multiple application instances
- Shared session store (Redis)
- Database read replicas

**Vertical Scaling**
- Increase server resources
- Optimize database queries
- Enable caching (Redis)
- CDN for static assets

---

## 📄 Project Files Reference

### Key Configuration Files

- `package.json` - Dependencies and scripts
- `drizzle.config.ts` - Database configuration
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Build configuration
- `ecosystem.config.js` - PM2 configuration (create if needed)

### Important Directories

- `/client/src/pages/` - All page components
- `/server/routers.ts` - API endpoints
- `/drizzle/schema.ts` - Database schema
- `/scripts/` - Utility scripts

---

## ✅ Deployment Checklist

### Pre-Deployment
- [ ] Environment variables configured
- [ ] Database created and accessible
- [ ] SSL certificates obtained
- [ ] Domain DNS configured
- [ ] Firewall rules set
- [ ] Backup strategy implemented

### Deployment
- [ ] Code deployed to server
- [ ] Dependencies installed
- [ ] Database migrated
- [ ] Application built
- [ ] PM2/Docker started
- [ ] Nginx configured

### Post-Deployment
- [ ] Application accessible via domain
- [ ] HTTPS working correctly
- [ ] All routes functional
- [ ] Database queries working
- [ ] Authentication working
- [ ] Monitoring enabled
- [ ] Backups scheduled

---

## 🎯 Success Criteria

Your deployment is successful when:
- ✅ Application loads at https://owambe.com
- ✅ All pages render correctly
- ✅ User authentication works
- ✅ Database queries execute successfully
- ✅ API endpoints respond correctly
- ✅ SSL certificate is valid
- ✅ No console errors
- ✅ Performance is acceptable (< 3s page load)

---

## 📧 Contact & Support

For deployment issues or questions:
- Review this documentation
- Check application logs
- Test in staging environment first
- Document any custom changes

---

**Document Version**: 1.0  
**Last Updated**: October 21, 2025  
**Project Version**: 29a2aca6

