# 🚀 Quick Deployment Reference

Panduan cepat untuk deployment tanpa error komunikasi Backend ↔️ Frontend

---

## 🎯 Skenario Deployment

### Skenario 1: Backend & Frontend di Domain yang Sama

**Domain**: `alfurqon.com`

```
Frontend: https://alfurqon.com
Backend:  https://alfurqon.com/api
```

#### Backend `.env`:
```bash
FRONTEND_URL=https://alfurqon.com
PORT=8080
```

#### Frontend `.env.production`:
```bash
NEXT_PUBLIC_API_URL=https://alfurqon.com
```

#### Nginx Config:
```nginx
location /api/ {
    proxy_pass http://localhost:8080/api/v1/;
}

location / {
    proxy_pass http://localhost:3000;
}
```

---

### Skenario 2: Backend di Subdomain Terpisah

**Domain**: 
- Frontend: `alfurqon.com`
- Backend: `api.alfurqon.com`

#### Backend `.env`:
```bash
FRONTEND_URL=https://alfurqon.com
PORT=8080
```

#### Frontend `.env.production`:
```bash
NEXT_PUBLIC_API_URL=https://api.alfurqon.com
```

#### Nginx Config:
```nginx
# File: /etc/nginx/sites-available/api.alfurqon
server {
    server_name api.alfurqon.com;
    location / {
        proxy_pass http://localhost:8080;
    }
}

# File: /etc/nginx/sites-available/alfurqon
server {
    server_name alfurqon.com;
    location / {
        proxy_pass http://localhost:3000;
    }
}
```

---

### Skenario 3: Backend & Frontend di Server Berbeda

**Server Setup**:
- Frontend Server: `frontend.example.com` (IP: 1.2.3.4)
- Backend Server: `backend.example.com` (IP: 5.6.7.8)

#### Backend `.env` (di server 5.6.7.8):
```bash
FRONTEND_URL=https://frontend.example.com
PORT=8080
```

#### Frontend `.env.production` (di server 1.2.3.4):
```bash
NEXT_PUBLIC_API_URL=https://backend.example.com
```

---

## ⚠️ Checklist Anti-Error

### ✅ Backend Checklist

1. **CORS Configuration**
   ```bash
   # File: src/middleware/cors.ts
   # Pastikan FRONTEND_URL sudah benar
   FRONTEND_URL=https://your-frontend-domain.com
   ```

2. **Port Configuration**
   ```bash
   PORT=8080
   # Pastikan tidak bentrok dengan aplikasi lain
   sudo netstat -tulpn | grep 8080
   ```

3. **Database Connection**
   ```bash
   DATABASE_URL=postgresql://user:password@localhost:5432/dbname
   # Test connection:
   npx prisma db pull
   ```

4. **JWT Secrets**
   ```bash
   # Generate baru untuk production:
   openssl rand -base64 32
   ```

5. **Build & Start**
   ```bash
   npm run build
   pm2 start dist/src/index.js --name backend
   pm2 save
   ```

### ✅ Frontend Checklist

1. **API URL Configuration**
   ```bash
   # .env.production
   NEXT_PUBLIC_API_URL=https://your-backend-domain.com
   # Jangan tambahkan /api/v1 di akhir!
   ```

2. **Build Time Variables**
   ```bash
   # Variables NEXT_PUBLIC_* harus tersedia saat build
   cat .env.production
   npm run build
   ```

3. **Start**
   ```bash
   pm2 start npm --name frontend -- start
   pm2 save
   ```

### ✅ Nginx Checklist

1. **Test Configuration**
   ```bash
   sudo nginx -t
   ```

2. **Reload**
   ```bash
   sudo systemctl reload nginx
   ```

3. **Check Logs**
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

---

## 🐛 Common Errors & Solutions

### Error 1: CORS Error

**Error**:
```
Access to fetch at 'https://api.example.com' from origin 'https://example.com' 
has been blocked by CORS policy
```

**Solution**:
```bash
# Backend .env - tambahkan frontend domain
FRONTEND_URL=https://example.com

# Restart backend
pm2 restart backend
```

---

### Error 2: Failed to Fetch

**Error**:
```
TypeError: Failed to fetch
```

**Causes & Solutions**:

1. **Backend tidak running**
   ```bash
   pm2 status backend
   pm2 logs backend
   pm2 restart backend
   ```

2. **URL salah di frontend**
   ```bash
   # Check .env.production
   cat .env.production
   # Rebuild jika salah
   npm run build
   pm2 restart frontend
   ```

3. **Firewall blocking**
   ```bash
   sudo ufw allow 8080/tcp
   sudo ufw status
   ```

---

### Error 3: 502 Bad Gateway

**Causes & Solutions**:

1. **Backend crashed**
   ```bash
   pm2 logs backend
   pm2 restart backend
   ```

2. **Port mismatch**
   ```bash
   # Check backend port
   cat .env | grep PORT
   
   # Check nginx config
   cat /etc/nginx/sites-available/your-site | grep proxy_pass
   ```

---

### Error 4: Environment Variables Not Working

**Problem**: `process.env.NEXT_PUBLIC_API_URL` is undefined

**Solution**:
```bash
# 1. Pastikan variable prefix NEXT_PUBLIC_*
# 2. Rebuild setelah mengubah .env
cd /var/www/alfurqon/frontend
npm run build
pm2 restart frontend

# 3. Clear cache jika perlu
rm -rf .next
npm run build
```

---

## 🔍 Testing Checklist

### 1. Test Backend
```bash
# Health check
curl http://localhost:8080/health

# Test endpoint
curl http://localhost:8080/api/v1/articles
```

### 2. Test Frontend
```bash
# Check if running
curl http://localhost:3000

# Check build
ls -la .next
```

### 3. Test CORS
```bash
curl -H "Origin: https://your-frontend.com" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     https://your-backend.com/api/v1/health -v
```

### 4. Test Full Flow
```bash
# From browser console:
fetch('https://your-backend.com/api/v1/health')
  .then(res => res.json())
  .then(console.log)
  .catch(console.error)
```

---

## 📊 Monitoring Commands

```bash
# PM2 Status
pm2 status

# Live Logs
pm2 logs

# Backend specific
pm2 logs backend --lines 100

# Frontend specific  
pm2 logs frontend --lines 100

# Nginx access log
sudo tail -f /var/log/nginx/access.log

# Nginx error log
sudo tail -f /var/log/nginx/error.log

# System resources
pm2 monit
```

---

## 🔄 Update Deployment

### Update Backend
```bash
cd /var/www/alfurqon/backend
git pull
npm install
npm run build
pm2 restart backend
```

### Update Frontend
```bash
cd /var/www/alfurqon/frontend
git pull
npm install
npm run build
pm2 restart frontend
```

### Update Both
```bash
cd /var/www/alfurqon/backend && git pull && npm install && npm run build && pm2 restart backend
cd /var/www/alfurqon/frontend && git pull && npm install && npm run build && pm2 restart frontend
```

---

## 🆘 Emergency Rollback

```bash
# Rollback backend
cd /var/www/alfurqon/backend
git log --oneline -n 5  # Find commit hash
git checkout COMMIT_HASH
npm install
npm run build
pm2 restart backend

# Rollback frontend
cd /var/www/alfurqon/frontend
git log --oneline -n 5
git checkout COMMIT_HASH
npm install
npm run build
pm2 restart frontend
```

---

## 📱 Contact untuk Error

Jika masih error setelah mengikuti panduan ini:

1. **Cek PM2 logs**: `pm2 logs`
2. **Cek Nginx logs**: `sudo tail -f /var/log/nginx/error.log`
3. **Cek browser console**: F12 → Console tab
4. **Screenshot error** dan kirim ke DevOps team

---

**Quick Links**:
- [Full Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Backend .env Example](../BE_Al-Furqon/.env.production.example)
- [Frontend .env Example](./.env.production.example)
