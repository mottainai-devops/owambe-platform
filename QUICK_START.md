# Owambe Platform - Quick Start Deployment Guide

## 🚀 5-Minute Deployment

### Prerequisites
- Ubuntu 22.04 server with root access
- Domain name pointed to your server IP
- MySQL database credentials

---

## Step 1: Server Setup (2 minutes)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Install pnpm and PM2
npm install -g pnpm pm2

# Install Nginx
sudo apt install -y nginx

# Install MySQL (if not already installed)
sudo apt install -y mysql-server
```

---

## Step 2: Deploy Application (2 minutes)

```bash
# Clone repository
cd /var/www
sudo git clone <your-repo-url> owambe
cd owambe
sudo chown -R $USER:$USER .

# Install dependencies
pnpm install --prod

# Configure environment variables
# Edit the .env file with your settings via the web interface
# Or set them in your deployment platform

# Setup database
pnpm db:push

# Optional: Add sample data
npx tsx scripts/seed.ts

# Build application
pnpm build

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## Step 3: Configure Nginx (1 minute)

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/owambe
```

Paste this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

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
}
```

Enable site and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/owambe /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## Step 4: Enable HTTPS (Optional but Recommended)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal is configured automatically
```

---

## ✅ Verification

Visit your domain: `https://your-domain.com`

You should see the Owambe platform running!

---

## 🔧 Common Commands

```bash
# View logs
pm2 logs owambe

# Restart application
pm2 restart owambe

# Stop application
pm2 stop owambe

# Check status
pm2 status

# Update application
cd /var/www/owambe
git pull
pnpm install --prod
pnpm build
pm2 reload owambe
```

---

## 🆘 Troubleshooting

**Application not starting?**
```bash
pm2 logs owambe --lines 50
```

**Database connection error?**
- Check DATABASE_URL in environment variables
- Verify MySQL is running: `sudo systemctl status mysql`
- Test connection: `mysql -u username -p`

**Port 3000 already in use?**
```bash
lsof -i :3000
kill -9 <PID>
pm2 restart owambe
```

**Nginx errors?**
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

---

## 📚 Next Steps

1. Configure your OAuth provider (replace Manus OAuth)
2. Set up payment gateway integration
3. Configure email service
4. Set up monitoring and alerts
5. Schedule database backups

See `DEPLOYMENT_HANDOFF.md` for detailed documentation.

---

## 🎯 Production Checklist

- [ ] SSL certificate installed
- [ ] Environment variables configured
- [ ] Database backups scheduled
- [ ] Monitoring enabled
- [ ] Firewall configured
- [ ] PM2 startup script enabled
- [ ] Domain DNS configured
- [ ] Application tested and verified

---

**Need help?** Refer to the complete `DEPLOYMENT_HANDOFF.md` documentation.

