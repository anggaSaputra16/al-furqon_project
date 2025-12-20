# 🚀 Deployment Guide - Al-Furqon CMS

Panduan lengkap untuk deployment aplikasi Al-Furqon CMS ke production server.

---

## 📋 Table of Contents

1. [Arsitektur Aplikasi](#arsitektur-aplikasi)
2. [Prerequisites](#prerequisites)
3. [Konfigurasi Environment Variables](#konfigurasi-environment-variables)
4. [Deployment Backend](#deployment-backend)
5. [Deployment Frontend](#deployment-frontend)
6. [Konfigurasi Nginx](#konfigurasi-nginx)
7. [SSL Certificate](#ssl-certificate)
8. [Database Migration](#database-migration)
9. [Troubleshooting](#troubleshooting)

---

## 🏗️ Arsitektur Aplikasi

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│   Frontend      │────────▶│    Backend      │────────▶│   PostgreSQL    │
│   (Next.js)     │  HTTPS  │   (Express.js)  │         │   Database      │
│   Port: 3000    │         │   Port: 8080    │         │   Port: 5432    │
│                 │         │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
        │                           │
        │                           │
        └───────────────┬───────────┘
                        │
                        ▼
                ┌───────────────┐
                │     Nginx     │
                │  Reverse Proxy│
                │  Port: 80/443 │
                └───────────────┘
```

---

## ✅ Prerequisites

### Server Requirements:
- **OS**: Ubuntu 20.04 LTS atau lebih tinggi
- **RAM**: Minimum 2GB (Recommended 4GB)
- **Storage**: Minimum 20GB
- **CPU**: 2 vCPU atau lebih

### Software yang Dibutuhkan:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x atau lebih tinggi
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx
sudo apt install -y nginx

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install Git
sudo apt install -y git
```

---

## 🔐 Konfigurasi Environment Variables

### 1. Backend Environment Variables

Lokasi: `BE_Al-Furqon/.env`

```bash
# ==================== SERVER CONFIGURATION ====================
NODE_ENV=production
PORT=8080

# ==================== FRONTEND URL ====================
# URL frontend untuk CORS (WAJIB diisi dengan domain production)
FRONTEND_URL=https://alfurqon.com
# Atau jika menggunakan subdomain:
# FRONTEND_URL=https://www.alfurqon.com

# ==================== DATABASE CONFIGURATION ====================
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL=postgresql://alfurqon_user:STRONG_PASSWORD_HERE@localhost:5432/alfurqon_db

# ==================== JWT SECRETS ====================
# Generate menggunakan: openssl rand -base64 32
JWT_SECRET=GENERATE_RANDOM_SECRET_HERE_32_CHARS_MIN
JWT_REFRESH_SECRET=GENERATE_ANOTHER_RANDOM_SECRET_32_CHARS_MIN
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# ==================== ADMIN CREDENTIALS ====================
# Super admin default (gunakan untuk setup awal)
ADMIN_USERNAME=superadmin
ADMIN_PASSWORD=CHANGE_THIS_STRONG_PASSWORD
ADMIN_EMAIL=admin@alfurqon.com

# ==================== FILE UPLOAD ====================
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads

# ==================== RATE LIMITING ====================
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# ==================== LOGGING ====================
LOG_LEVEL=info
LOG_FILE=./logs/app.log
```

### 2. Frontend Environment Variables

Lokasi: `al-furqon_project/.env.production`

```bash
# ==================== API CONFIGURATION ====================
# URL Backend API (WAJIB diisi dengan domain production backend)
NEXT_PUBLIC_API_URL=https://api.alfurqon.com
# Atau jika backend di subdomain:
# NEXT_PUBLIC_API_URL=https://alfurqon.com/api
# Atau jika backend di port berbeda (tidak recommended untuk production):
# NEXT_PUBLIC_API_URL=https://alfurqon.com:8080

# ==================== API TIMEOUT ====================
NEXT_PUBLIC_API_TIMEOUT=15000

# ==================== APP ENVIRONMENT ====================
NEXT_PUBLIC_APP_ENV=production

# ==================== OPTIONAL: ANALYTICS ====================
# NEXT_PUBLIC_GA_ID=UA-XXXXXXXXX-X
# NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

### 3. Generate JWT Secret

```bash
# Generate JWT Secret
openssl rand -base64 32

# Generate JWT Refresh Secret
openssl rand -base64 32
```

Copy output dan masukkan ke `.env` backend sebagai `JWT_SECRET` dan `JWT_REFRESH_SECRET`

---

## 🔧 Deployment Backend

### 1. Clone Repository & Setup

```bash
# Login ke server
ssh user@your-server-ip

# Buat folder untuk aplikasi
sudo mkdir -p /var/www/alfurqon
sudo chown -R $USER:$USER /var/www/alfurqon

# Clone repository
cd /var/www/alfurqon
git clone https://github.com/anggaSaputra16/BE_Al-Furqon.git backend
cd backend

# Install dependencies
npm install --production

# Copy dan edit environment variables
cp .env.example .env
nano .env
# Edit sesuai konfigurasi production di atas
```

### 2. Setup Database

```bash
# Login ke PostgreSQL
sudo -u postgres psql

# Buat database dan user
CREATE DATABASE alfurqon_db;
CREATE USER alfurqon_user WITH ENCRYPTED PASSWORD 'STRONG_PASSWORD_HERE';
GRANT ALL PRIVILEGES ON DATABASE alfurqon_db TO alfurqon_user;
\q

# Jalankan migrations
cd /var/www/alfurqon/backend
npx prisma generate
npx prisma migrate deploy

# Seed data (optional)
npm run seed
```

### 3. Build & Start Backend

```bash
# Build TypeScript
npm run build

# Start dengan PM2
pm2 start dist/src/index.js --name "alfurqon-backend" -i max

# Setup PM2 startup
pm2 startup
pm2 save

# Monitoring
pm2 logs alfurqon-backend
pm2 status
```

### 4. PM2 Ecosystem File (Optional - Recommended)

Buat file `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'alfurqon-backend',
    script: './dist/src/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 8080
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '1G'
  }]
}
```

Start dengan:
```bash
pm2 start ecosystem.config.js
```

---

## 🎨 Deployment Frontend

### 1. Clone & Setup

```bash
# Clone repository frontend
cd /var/www/alfurqon
git clone https://github.com/anggaSaputra16/al-furqon_project.git frontend
cd frontend

# Install dependencies
npm install --production
```

### 2. Configure Environment

```bash
# Buat file .env.production
nano .env.production

# Paste konfigurasi environment production (lihat di atas)
```

### 3. Build & Start Frontend

```bash
# Build Next.js
npm run build

# Start dengan PM2
pm2 start npm --name "alfurqon-frontend" -- start

# Atau lebih baik dengan custom script
pm2 start npm --name "alfurqon-frontend" -- run start -- -p 3000

# Save PM2 config
pm2 save
```

### 4. PM2 Ecosystem File untuk Frontend

Tambahkan di `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: 'alfurqon-backend',
      script: './dist/src/index.js',
      cwd: '/var/www/alfurqon/backend',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 8080
      }
    },
    {
      name: 'alfurqon-frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      cwd: '/var/www/alfurqon/frontend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
}
```

---

## 🌐 Konfigurasi Nginx

### 1. Konfigurasi untuk Domain Utama

Buat file: `/etc/nginx/sites-available/alfurqon`

```nginx
# Backend API Server
upstream backend_api {
    server 127.0.0.1:8080;
    keepalive 64;
}

# Frontend Server
upstream frontend_app {
    server 127.0.0.1:3000;
    keepalive 64;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name alfurqon.com www.alfurqon.com;
    
    # Allow Let's Encrypt verification
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    # Redirect all other traffic to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS Frontend Server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name alfurqon.com www.alfurqon.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/alfurqon.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/alfurqon.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Logging
    access_log /var/log/nginx/alfurqon-access.log;
    error_log /var/log/nginx/alfurqon-error.log;

    # Client upload size
    client_max_body_size 10M;

    # Proxy Backend API
    location /api/ {
        proxy_pass http://backend_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Proxy uploaded files
    location /uploads/ {
        proxy_pass http://backend_api;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_cache_valid 200 1d;
        expires 1d;
        add_header Cache-Control "public, immutable";
    }

    # Proxy Frontend
    location / {
        proxy_pass http://frontend_app;
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
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://frontend_app;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Next.js specific
    location /_next/static/ {
        proxy_pass http://frontend_app;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 2. Konfigurasi dengan Backend di Subdomain Terpisah

Jika ingin backend di `api.alfurqon.com`:

```nginx
# Backend Server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.alfurqon.com;

    ssl_certificate /etc/letsencrypt/live/api.alfurqon.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.alfurqon.com/privkey.pem;

    location / {
        proxy_pass http://backend_api;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Frontend Server (same as above but without /api/ location)
```

### 3. Enable Site

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/alfurqon /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## 🔒 SSL Certificate

### Install Certbot

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL Certificate
sudo certbot --nginx -d alfurqon.com -d www.alfurqon.com

# Jika menggunakan subdomain terpisah untuk backend:
sudo certbot --nginx -d api.alfurqon.com

# Auto-renewal (crontab)
sudo crontab -e
# Tambahkan line:
0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 🗄️ Database Migration

### Backup Database

```bash
# Manual backup
sudo -u postgres pg_dump alfurqon_db > backup-$(date +%Y%m%d).sql

# Automated backup script
sudo nano /usr/local/bin/backup-db.sh
```

Script content:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/postgresql"
mkdir -p $BACKUP_DIR
sudo -u postgres pg_dump alfurqon_db | gzip > $BACKUP_DIR/alfurqon_db_$DATE.sql.gz
find $BACKUP_DIR -type f -mtime +7 -delete
```

```bash
# Make executable
sudo chmod +x /usr/local/bin/backup-db.sh

# Add to crontab
sudo crontab -e
# Tambahkan:
0 2 * * * /usr/local/bin/backup-db.sh
```

### Restore Database

```bash
# Restore from backup
gunzip -c backup.sql.gz | sudo -u postgres psql alfurqon_db
```

---

## 🔍 Troubleshooting

### 1. Backend Tidak Bisa Diakses

```bash
# Check PM2 status
pm2 status
pm2 logs alfurqon-backend

# Check port
sudo netstat -tulpn | grep 8080

# Check firewall
sudo ufw status
sudo ufw allow 8080/tcp
```

### 2. Frontend Tidak Bisa Mengakses Backend

**Periksa CORS di Backend:**

File: `BE_Al-Furqon/src/middleware/cors.ts`

```typescript
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'https://alfurqon.com',
  'https://www.alfurqon.com'
];
```

**Periksa Environment Variable Frontend:**

```bash
cd /var/www/alfurqon/frontend
cat .env.production
# Pastikan NEXT_PUBLIC_API_URL benar
```

### 3. SSL Certificate Error

```bash
# Check certificate
sudo certbot certificates

# Renew manually
sudo certbot renew

# Check Nginx config
sudo nginx -t
```

### 4. Database Connection Error

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connection
sudo -u postgres psql -c "SELECT version();"

# Test connection dari backend
cd /var/www/alfurqon/backend
npx prisma db pull
```

### 5. File Upload Error

```bash
# Check upload directory permissions
ls -la /var/www/alfurqon/backend/uploads

# Fix permissions
sudo chown -R www-data:www-data /var/www/alfurqon/backend/uploads
sudo chmod -R 755 /var/www/alfurqon/backend/uploads
```

---

## 📊 Monitoring & Maintenance

### PM2 Monitoring

```bash
# Real-time monitoring
pm2 monit

# Status
pm2 status

# Logs
pm2 logs

# Restart aplikasi
pm2 restart all

# Update aplikasi
cd /var/www/alfurqon/backend
git pull
npm install
npm run build
pm2 restart alfurqon-backend

cd /var/www/alfurqon/frontend
git pull
npm install
npm run build
pm2 restart alfurqon-frontend
```

### Health Check Script

Buat file `/usr/local/bin/health-check.sh`:

```bash
#!/bin/bash

# Check backend
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/health)
if [ $BACKEND_STATUS -ne 200 ]; then
    echo "Backend is down! Restarting..."
    pm2 restart alfurqon-backend
fi

# Check frontend
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ $FRONTEND_STATUS -ne 200 ]; then
    echo "Frontend is down! Restarting..."
    pm2 restart alfurqon-frontend
fi
```

```bash
# Make executable
sudo chmod +x /usr/local/bin/health-check.sh

# Add to crontab (every 5 minutes)
*/5 * * * * /usr/local/bin/health-check.sh >> /var/log/health-check.log 2>&1
```

---

## 📝 Checklist Deployment

### Pre-Deployment:
- [ ] Server setup complete (Node.js, PostgreSQL, Nginx)
- [ ] Domain DNS configured
- [ ] SSL certificate obtained
- [ ] Database created and user configured
- [ ] Environment variables prepared

### Backend Deployment:
- [ ] Code cloned to server
- [ ] `.env` configured correctly
- [ ] Dependencies installed
- [ ] Database migrations run
- [ ] Built successfully
- [ ] PM2 process running
- [ ] Health endpoint accessible

### Frontend Deployment:
- [ ] Code cloned to server
- [ ] `.env.production` configured correctly
- [ ] Dependencies installed
- [ ] Built successfully
- [ ] PM2 process running
- [ ] Can access homepage

### Post-Deployment:
- [ ] Nginx configured and running
- [ ] HTTPS working correctly
- [ ] Frontend can communicate with backend
- [ ] File uploads working
- [ ] Admin login working
- [ ] Database backup scheduled
- [ ] PM2 startup configured
- [ ] Monitoring setup

---

## 🚨 Emergency Contacts

- **DevOps Lead**: [Your Name] - [Email]
- **Backend Developer**: [Name] - [Email]
- **Frontend Developer**: [Name] - [Email]
- **Database Admin**: [Name] - [Email]

---

## 📚 Additional Resources

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Let's Encrypt](https://letsencrypt.org/getting-started/)

---

**Last Updated**: October 23, 2025
**Version**: 1.0.0
