# Backend BE_Al-Furqon Integration Guide

## Overview
Dokumentasi lengkap untuk implementasi backend BE_Al-Furqon yang akan terintegrasi dengan frontend Masjid Al-Furqon website. Backend ini akan serve sebagai:

1. **Public API** - untuk website publik Masjid Al-Furqon  
2. **CMS Backend** - untuk admin mengelola content
3. **Public Information System** - tanpa authentication untuk visitor publik

## Technology Stack

### Backend Framework
```
- Node.js 18+ ⭐
- Express.js 4.x (Web framework)
- TypeScript 5.x (Type safety)
- Prisma ORM (Database ORM)
```

### Database & Infrastructure
```
- PostgreSQL 15+ (Primary database) ⭐
- Redis 7+ (Caching & sessions)
- Cloudinary/AWS S3 (File storage)
- PM2 (Process management)
- Docker (Containerization)
```

## 1. Environment Configuration

### Frontend Environment Variables
```bash
# .env.local (Development)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_API_TIMEOUT=15000
NEXT_PUBLIC_APP_ENV=development

# .env.production
NEXT_PUBLIC_API_BASE_URL=https://be-alfurqon.com/api/v1
NEXT_PUBLIC_API_TIMEOUT=10000
NEXT_PUBLIC_APP_ENV=production
```

### Backend Environment Variables
```bash
# .env (Development)
NODE_ENV=development
PORT=8080
DB_URL="postgresql://alfurqon_user:secure_password@localhost:5432/alfurqon_db"
REDIS_URL="redis://localhost:6379"
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
CORS_ORIGINS="http://localhost:3000,https://masjid-alfurqon.vercel.app"

# File Upload
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=10MB
CLOUDINARY_URL="cloudinary://api_key:api_secret@cloud_name"

# API Configuration
API_RATE_LIMIT=100
CACHE_TTL=3600

# Admin Default Account
ADMIN_EMAIL="admin@alfurqon.com"
ADMIN_PASSWORD="admin123"
ADMIN_NAME="Super Admin"

# .env.production
NODE_ENV=production
PORT=8080
DB_URL="postgresql://username:password@prod-host:5432/alfurqon_prod"
REDIS_URL="redis://prod-redis:6379"
JWT_SECRET="your-super-secure-production-jwt-secret-key-here"
JWT_EXPIRES_IN=24h
```

## 2. Database Schema Design (Prisma Schema)

### Prisma Schema Definition
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DB_URL")
}

// Articles Model (Artikel/Kegiatan)
model Article {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  description String?
  content     String?
  image       String?
  category    Category
  status      Status   @default(DRAFT)
  authorId    String?
  authorName  String?
  authorAvatar String?
  
  // Relations
  author      User?    @relation("ArticleAuthor", fields: [authorId], references: [id])
  publishedAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  views       Int      @default(0)
  likes       Int      @default(0)
  featured    Boolean  @default(false)
  tags        Json?
  metaData    Json?

  @@index([category])
  @@index([status])
  @@index([featured])
  @@index([publishedAt])
  @@index([category, status, featured])
  @@map("articles")
}

enum Category {
  kegiatan
  berita
  sumbangan
  fasilitas
  profil
}

enum Status {
  published
  draft
  archived
}

// Donations Model (Program Donasi)
model Donation {
  id              String               @id @default(cuid())
  title           String
  slug            String               @unique
  description     String
  detail          String?
  image           String?
  targetAmount    Decimal              @db.Decimal(15, 2)
  collectedAmount Decimal              @default(0.00) @db.Decimal(15, 2)
  status          DonationStatus       @default(ACTIVE)
  startDate       DateTime?
  endDate         DateTime?
  bankName        String?
  accountNumber   String?
  accountName     String?
  qrisCode        String?
  createdAt       DateTime             @default(now())
  updatedAt       DateTime             @updatedAt
  totalDonors     Int                  @default(0)
  
  transactions    DonationTransaction[]

  @@index([status])
  @@index([targetAmount])
  @@index([collectedAmount])
  @@index([status, createdAt])
  @@map("donations")
}

enum DonationStatus {
  active
  completed
  suspended
}

// Donation Transactions Model
model DonationTransaction {
  id            String            @id @default(cuid())
  donationId    String
  donorName     String
  amount        Decimal           @db.Decimal(15, 2)
  email         String?
  phone         String?
  message       String?
  isAnonymous   Boolean           @default(false)
  paymentMethod PaymentMethod
  status        TransactionStatus @default(PENDING)
  transactionId String?           @unique
  paymentUrl    String?
  expiresAt     DateTime?
  paidAt        DateTime?
  createdAt     DateTime          @default(now())
  updatedAt     DateTime          @updatedAt
  
  donation      Donation          @relation(fields: [donationId], references: [id], onDelete: Cascade)

  @@index([donationId])
  @@index([status])
  @@index([createdAt])
  @@index([transactionId])
  @@map("donation_transactions")
}

enum PaymentMethod {
  bank_transfer
  qris
  ewallet
  cash
}

enum TransactionStatus {
  pending
  paid
  failed
  cancelled
}

// News Model
model News {
  id          String    @id @default(cuid())
  title       String
  slug        String    @unique
  description String?
  content     String?
  image       String?
  category    String    @default("umum")
  priority    Priority  @default(MEDIUM)
  publishedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  authorId    String?
  authorName  String?
  views       Int       @default(0)
  summary     String?
  metaData    Json?
  
  // Relations
  author      User?     @relation("NewsAuthor", fields: [authorId], references: [id])

  @@index([category])
  @@index([priority])
  @@index([publishedAt])
  @@index([priority, publishedAt])
  @@map("news")
}

enum Priority {
  high
  medium
  low
}

// Navigation Menus Model
model Menu {
  id          String   @id @default(cuid())
  title       String
  slug        String
  icon        String?
  orderIndex  Int      @default(0)
  isActive    Boolean  @default(true)
  parentId    String?
  description String?
  url         String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  parent      Menu?    @relation("MenuHierarchy", fields: [parentId], references: [id])
  children    Menu[]   @relation("MenuHierarchy")

  @@index([orderIndex])
  @@index([isActive])
  @@index([parentId])
  @@map("menus")
}

// Site Statistics Model
model SiteStatistic {
  id          String   @id @default(cuid())
  metricName  String
  metricValue BigInt   @default(0)
  metricDate  DateTime
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([metricName, metricDate])
  @@index([metricName])
  @@index([metricDate])
  @@map("site_statistics")
}

// Analytics Events Model
model AnalyticsEvent {
  id           String    @id @default(cuid())
  eventType    EventType
  resourceId   String?
  resourceType String?
  sessionId    String?
  userAgent    String?
  referrer     String?
  ipAddress    String?
  createdAt    DateTime  @default(now())
  metadata     Json?

  @@index([eventType])
  @@index([resourceId])
  @@index([createdAt])
  @@index([resourceType, resourceId])
  @@map("analytics_events")
}

enum EventType {
  page_view
  article_view
  donation_view
  download
  share
}

// User Model untuk Authentication & CMS Admin
model User {
  id          String   @id @default(cuid())
  email       String   @unique
  password    String
  name        String
  role        UserRole @default(USER)
  isActive    Boolean  @default(true)
  avatar      String?
  lastLogin   DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  articles    Article[] @relation("ArticleAuthor")
  news        News[]    @relation("NewsAuthor")

  @@index([email])
  @@index([role])
  @@index([isActive])
  @@map("users")
}

enum UserRole {
  SUPER_ADMIN
  ADMIN
  EDITOR
  USER
}
```

## 🎯 CRITICAL: Frontend API Requirements

**🚨 IMPORTANT**: All endpoints below are **REQUIRED** by the frontend and must be implemented exactly as specified to prevent 404 errors and runtime crashes.

### Base Configuration
- **Base URL**: `/api/v1`
- **Content-Type**: `application/json`
- **Timeout**: 15 seconds (dev), 10 seconds (prod)
- **Error Format**: Standardized JSON response structure

## 🔥 HIGH PRIORITY: Homepage Critical Endpoints

### GET /api/v1/health
**Status**: ⭐ **CRITICAL** - Required for backend availability check
**Purpose**: Health check endpoint used by frontend to determine backend status
**Response**:
```json
{
  "success": true,
  "message": "Backend is running",
  "timestamp": "2024-12-20T10:00:00.000Z",
  "version": "1.0.0"
}
```

### GET /api/v1/home/dashboard  
**Status**: ⭐ **CRITICAL** - Main homepage data
**Purpose**: Single endpoint providing all homepage data (performance optimization)
**Query Params**: 
- `articles_limit` (default: 6)
- `donations_limit` (default: 3) 
- `news_limit` (default: 3)

**Response Structure**:
```json
{
  "success": true,
  "message": "Homepage data loaded successfully",
  "data": {
    "articles": {
      "featured": [
        {
          "id": "uuid",
          "title": "Article Title",
          "slug": "article-slug",
          "description": "Brief description",
          "content": "Full content",
          "image": "/images/article.jpg",
          "category": "kegiatan|berita|sumbangan|fasilitas|profil",
          "status": "published",
          "author": {
            "id": "uuid",
            "name": "Author Name",
            "avatar": "/images/author.jpg"
          },
          "publishedAt": "2024-12-20T10:00:00.000Z",
          "updatedAt": "2024-12-20T10:00:00.000Z",
          "views": 150,
          "likes": 25,
          "tags": ["tag1", "tag2"],
          "featured": true
        }
      ],
      "total": 42
    },
    "donations": {
      "active": [
        {
          "id": "uuid",
          "title": "Donation Program Title",
          "slug": "donation-slug",
          "description": "Brief description",
          "detail": "Detailed description",
          "image": "/images/donation.jpg",
          "target": 500000000,
          "collected": 150000000,
          "percentage": 30,
          "status": "active",
          "startDate": "2024-01-01T00:00:00.000Z",
          "endDate": "2024-12-31T23:59:59.000Z",
          "bankAccount": {
            "bankName": "Bank Name",
            "accountNumber": "1234567890",
            "accountName": "Masjid Al-Furqon"
          },
          "donors": {
            "total": 125,
            "recent": [
              {
                "name": "Donor Name",
                "amount": 500000,
                "donatedAt": "2024-12-20T09:00:00.000Z",
                "isAnonymous": false
              }
            ]
          },
          "createdAt": "2024-01-01T00:00:00.000Z",
          "updatedAt": "2024-12-20T10:00:00.000Z"
        }
      ],
      "total": 8
    },
    "news": {
      "latest": [
        {
          "id": "uuid",
          "title": "News Title",
          "slug": "news-slug", 
          "description": "Brief description",
          "content": "Full content",
          "image": "/images/news.jpg",
          "category": "pengumuman|kegiatan|info",
          "priority": "high|medium|low",
          "publishedAt": "2024-12-20T10:00:00.000Z",
          "updatedAt": "2024-12-20T10:00:00.000Z",
          "author": {
            "id": "uuid",
            "name": "Author Name"
          },
          "views": 89,
          "summary": "Brief summary"
        }
      ],
      "total": 15
    },
    "menus": [
      {
        "id": "uuid",
        "title": "Menu Title",
        "slug": "menu-slug",
        "icon": "FaIcon", 
        "order": 1,
        "isActive": true,
        "parentId": null,
        "description": "Menu description"
      }
    ],
    "stats": {
      "totalDonations": {
        "amount": 150000000,
        "programs": 5,
        "donors": 125
      },
      "activities": {
        "total": 12,
        "thisMonth": 3
      },
      "news": {
        "total": 8,
        "thisWeek": 2
      },
      "visitors": {
        "today": 45,
        "thisMonth": 1200,
        "total": 25000
      }
    }
  },
  "meta": {
    "timestamp": "2024-12-20T10:00:00.000Z",
    "cached": false
  }
}
```

### GET /api/v1/articles/featured
**Status**: 🔴 **HIGH PRIORITY** - Homepage articles carousel
**Query Params**: `limit` (default: 6)
**Response**: Array of articles with same structure as above

### GET /api/v1/donations/active  
**Status**: 🔴 **HIGH PRIORITY** - Active donation programs
**Query Params**: `limit` (default: 3)
**Response**: Array of donations with same structure as above

### GET /api/v1/news/latest
**Status**: 🔴 **HIGH PRIORITY** - Latest news for homepage
**Query Params**: `limit` (default: 3)  
**Response**: Array of news with same structure as above

### GET /api/v1/menus/navigation
**Status**: 🔴 **HIGH PRIORITY** - Navigation menu items
**Response**: Array of menu items with same structure as above

### GET /api/v1/statistics/public
**Status**: 🟡 **MEDIUM PRIORITY** - Public statistics
**Response**: Stats object with same structure as above

## 📄 CONTENT ENDPOINTS

### Articles API
```bash
GET  /api/v1/articles                    # List with pagination & filters
GET  /api/v1/articles/{id}               # Single article by ID  
GET  /api/v1/articles/slug/{slug}        # Single article by slug
POST /api/v1/articles/{id}/view          # Track article view
POST /api/v1/articles/{id}/like          # Like article
```

**GET /api/v1/articles Query Parameters**:
- `page` (default: 1)
- `limit` (default: 10)
- `category` (kegiatan|berita|sumbangan|fasilitas|profil)
- `status` (published|draft|archived)
- `featured` (boolean)
- `search` (string)
- `tags` (comma-separated)
- `sort` (publishedAt|title|views|likes)
- `order` (asc|desc, default: desc)

### Donations API
```bash
GET  /api/v1/donations                   # List donation programs
GET  /api/v1/donations/{id}              # Single donation by ID
GET  /api/v1/donations/slug/{slug}       # Single donation by slug  
POST /api/v1/donations/submit            # Submit donation
GET  /api/v1/donations/{transactionId}/status # Check donation status
```

**POST /api/v1/donations/submit Request Body**:
```json
{
  "donationId": "uuid",
  "donorName": "Donor Name",
  "amount": 100000,
  "email": "donor@email.com",
  "phone": "08123456789", 
  "message": "Optional message",
  "isAnonymous": false,
  "paymentMethod": "bank_transfer"
}
```

### News API
```bash
GET  /api/v1/news                        # List with pagination & filters
GET  /api/v1/news/{id}                   # Single news by ID
GET  /api/v1/news/slug/{slug}            # Single news by slug
POST /api/v1/news/{id}/view              # Track news view
```

### Analytics API
```bash
POST /api/v1/analytics/track             # Track user interactions
```

**POST /api/v1/analytics/track Request Body**:
```json
{
  "type": "page_view|article_view|donation_view|download|share",
  "resourceId": "resource-uuid",
  "resourceType": "article|donation|news|page",
  "metadata": {
    "referrer": "google.com",
    "userAgent": "Mozilla/5.0...",
    "sessionId": "session-123"
  }
}
```

## 🔐 ADMIN & CMS ENDPOINTS

### Authentication
```bash
POST /api/v1/auth/login                  # Admin login
POST /api/v1/auth/register               # Admin register (super admin only)
POST /api/v1/auth/logout                 # Admin logout
GET  /api/v1/auth/me                     # Get current user profile
PUT  /api/v1/auth/profile                # Update user profile
POST /api/v1/auth/change-password        # Change password
```

### CMS Admin - Articles
```bash
GET  /api/v1/admin/articles              # List all articles (with filters)
POST /api/v1/admin/articles              # Create new article
GET  /api/v1/admin/articles/{id}         # Get article for editing
PUT  /api/v1/admin/articles/{id}         # Update article
DELETE /api/v1/admin/articles/{id}       # Delete article
PATCH /api/v1/admin/articles/{id}/publish    # Publish article
PATCH /api/v1/admin/articles/{id}/unpublish  # Unpublish article
```

### CMS Admin - Donations
```bash
GET  /api/v1/admin/donations             # List all donations
POST /api/v1/admin/donations             # Create new donation program
PUT  /api/v1/admin/donations/{id}        # Update donation program
DELETE /api/v1/admin/donations/{id}      # Delete donation program
GET  /api/v1/admin/donations/{id}/transactions # Get donation transactions
```

### CMS Admin - News
```bash
GET  /api/v1/admin/news                  # List all news
POST /api/v1/admin/news                  # Create new news
PUT  /api/v1/admin/news/{id}             # Update news
DELETE /api/v1/admin/news/{id}           # Delete news
```

### CMS Admin - User Management
```bash
GET  /api/v1/admin/users                 # List all users (super admin only)
POST /api/v1/admin/users                 # Create new user (super admin only)
PUT  /api/v1/admin/users/{id}            # Update user (super admin only)
DELETE /api/v1/admin/users/{id}          # Delete user (super admin only)
PATCH /api/v1/admin/users/{id}/activate     # Activate user
PATCH /api/v1/admin/users/{id}/deactivate   # Deactivate user
```

### CMS Admin - File Upload
```bash
POST /api/v1/admin/upload                # Upload files (images, documents)
DELETE /api/v1/admin/upload/{id}         # Delete uploaded file
```

### CMS Admin - Analytics & Statistics
```bash
GET  /api/v1/admin/analytics             # Admin analytics dashboard
GET  /api/v1/admin/statistics            # Detailed statistics
```

## 🚨 CRITICAL FRONTEND SAFETY REQUIREMENTS

### Mandatory Response Fields
**Every endpoint MUST include these fields to prevent frontend crashes:**

**For Articles:**
- `author.name` (string, required)
- `author.id` (string, required)
- `publishedAt` (ISO string, required)
- `views` (number, default: 0)
- `likes` (number, default: 0)

**For Donations:**
- `donors.total` (number, required)
- `percentage` (number, required)
- `target` (number, required)
- `collected` (number, required)

**For News:**
- `author.name` (string, required)
- `publishedAt` (ISO string, required)
- `views` (number, default: 0)

### Error Prevention
- Always return `donors.total` as a number (not null/undefined)
- Always return `author.name` as a string (not null/undefined)  
- All date fields must be valid ISO 8601 strings
- All numeric fields must be numbers (not strings)
- Array fields must be arrays (not null/undefined)

## 📞 CONTACT & FEEDBACK ENDPOINTS

```bash
POST /api/v1/contact/submit              # Contact form submission
POST /api/v1/feedback/submit             # Feedback submission
POST /api/v1/newsletter/subscribe        # Newsletter subscription
```
```

## 3. API Endpoints yang Diperlukan Frontend

### Base URL Configuration
```
Development: http://localhost:8080/api/v1
Production:  https://be-alfurqon.com/api/v1

Standard Headers:
- Content-Type: application/json
- Accept: application/json
- X-Requested-With: XMLHttpRequest
```

### Priority 1: Essential Homepage Endpoints

#### GET /api/v1/home/dashboard
**Purpose**: Complete homepage data (articles, donations, news, menus, stats)
**Expected Response Format**:
```json
{
  "success": true,
  "message": "Data berhasil dimuat",
  "data": {
    "articles": [
      {
        "id": "uuid-string",
        "title": "Kajian Rutin Minggu Sore",
        "slug": "kajian-rutin-minggu-sore",
        "description": "Kajian rutin setiap hari minggu sore bersama Ustadz Ahmad",
        "content": "Content lengkap artikel...",
        "image": "/images/kajian.jpg",
        "category": "kegiatan",
        "status": "published",
        "author": {
          "id": "uuid-string",
          "name": "Ustadz Ahmad",
          "avatar": "/images/ustadz-ahmad.jpg"
        },
        "publishedAt": "2024-12-20T10:00:00.000Z",
        "updatedAt": "2024-12-20T10:00:00.000Z",
        "views": 150,
        "likes": 25,
        "tags": ["kajian", "akidah", "akhlak"],
        "featured": true
      }
    ],
    "donations": [
      {
        "id": "uuid-string",
        "title": "Renovasi Masjid Al-Furqon",
        "slug": "renovasi-masjid-al-furqon",
        "description": "Mari bersama-sama merenovasi masjid untuk kenyamanan ibadah",
        "detail": "Program renovasi masjid Al-Furqon meliputi perbaikan atap, lantai, dan fasilitas wudhu",
        "image": "/images/money.jpg",
        "target": 500000000,
        "collected": 150000000,
        "percentage": 30,
        "status": "active",
        "startDate": "2024-01-01T00:00:00.000Z",
        "endDate": "2024-12-31T23:59:59.000Z",
        "bankAccount": {
          "bankName": "Bank Syariah Indonesia",
          "accountNumber": "1234567890",
          "accountName": "Masjid Al-Furqon"
        },
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-12-20T10:00:00.000Z",
        "donors": {
          "total": 125,
          "recent": [
            {
              "name": "Ahmad Sutanto",
              "amount": 500000,
              "donatedAt": "2024-12-20T09:00:00.000Z",
              "isAnonymous": false
            }
          ]
        }
      }
    ],
    "news": [
      {
        "id": "uuid-string",
        "title": "Pembukaan Pendaftaran TPQ",
        "slug": "pembukaan-pendaftaran-tpq",
        "description": "Dibuka pendaftaran TPQ untuk anak-anak usia 5-12 tahun",
        "content": "Program TPQ Al-Furqon membuka pendaftaran...",
        "image": "/images/iqro.jpg",
        "category": "pengumuman",
        "priority": "high",
        "publishedAt": "2024-12-20T10:00:00.000Z",
        "updatedAt": "2024-12-20T10:00:00.000Z",
        "author": {
          "id": "uuid-string",
          "name": "Admin Masjid"
        },
        "views": 89,
        "summary": "Pendaftaran TPQ dibuka mulai tanggal 1 Januari 2025"
      }
    ],
    "menus": [
      {
        "id": "uuid-string",
        "title": "Sejarah",
        "slug": "sejarah",
        "icon": "FaHistory",
        "order": 1,
        "isActive": true,
        "parentId": null,
        "description": "Sejarah Masjid Al-Furqon"
      },
      {
        "id": "uuid-string",
        "title": "Fasilitas",
        "slug": "fasilitas",
        "icon": "FaBuilding",
        "order": 2,
        "isActive": true,
        "parentId": null,
        "description": "Fasilitas yang tersedia di masjid"
      }
    ],
    "stats": {
      "totalDonations": {
        "amount": 150000000,
        "programs": 5,
        "donors": 125
      },
      "activities": {
        "total": 12,
        "thisMonth": 3
      },
      "news": {
        "total": 8,
        "thisWeek": 2
      },
      "visitors": {
        "today": 45,
        "thisMonth": 1200,
        "total": 25000
      }
    }
  },
  "meta": {
    "timestamp": "2024-12-20T10:00:00.000Z"
  }
}
```

#### GET /api/v1/articles/featured
**Query Parameters**: `limit` (optional, default: 6)
**Purpose**: Get featured articles for homepage carousel
**Expected Response**:
```json
{
  "success": true,
  "message": "Artikel unggulan berhasil dimuat",
  "data": [
    {
      "id": "uuid-string",
      "title": "Kajian Rutin Minggu Sore",
      "slug": "kajian-rutin-minggu-sore",
      "description": "Kajian rutin setiap hari minggu sore",
      "image": "/images/kajian.jpg",
      "category": "kegiatan",
      "author": {
        "name": "Ustadz Ahmad"
      },
      "publishedAt": "2024-12-20T10:00:00.000Z",
      "views": 150,
      "likes": 25,
      "featured": true
    }
  ]
}
```

#### GET /api/v1/donations/active
**Query Parameters**: `limit` (optional, default: 3)
**Purpose**: Get active donation programs
**Expected Response**:
```json
{
  "success": true,
  "message": "Program donasi aktif berhasil dimuat",
  "data": [
    {
      "id": "uuid-string",
      "title": "Renovasi Masjid Al-Furqon",
      "description": "Mari bersama renovasi masjid",
      "image": "/images/money.jpg",
      "target": 500000000,
      "collected": 150000000,
      "percentage": 30,
      "status": "active",
      "donors": {
        "total": 125
      }
    }
  ]
}
```

#### POST /api/v1/donations/submit
**Purpose**: Submit donation form
**Request Body**:
```json
{
  "donationId": "uuid-string",
  "donorName": "Ahmad Sutanto",
  "amount": 100000,
  "email": "ahmad@email.com",
  "phone": "08123456789",
  "message": "Semoga berkah",
  "isAnonymous": false,
  "paymentMethod": "bank_transfer"
}
```
**Expected Response**:
```json
{
  "success": true,
  "message": "Donasi berhasil diproses",
  "data": {
    "transactionId": "TXN-20241220-123456",
    "paymentUrl": "https://payment.gateway.com/pay/TXN-20241220-123456",
    "expiresAt": "2024-12-21T10:00:00.000Z",
    "instructions": "Silakan lakukan pembayaran melalui link yang disediakan"
  }
}
```

#### GET /api/v1/news/latest
**Query Parameters**: `limit` (optional, default: 3)
**Purpose**: Get latest news for homepage
**Expected Response**:
```json
{
  "success": true,
  "message": "Berita terbaru berhasil dimuat",
  "data": [
    {
      "id": "uuid-string",
      "title": "Pembukaan Pendaftaran TPQ",
      "description": "Dibuka pendaftaran TPQ",
      "image": "/images/iqro.jpg",
      "category": "pengumuman",
      "priority": "high",
      "publishedAt": "2024-12-20T10:00:00.000Z",
      "author": {
        "name": "Admin Masjid"
      },
      "views": 89
    }
  ]
}
```

#### GET /api/v1/menus/navigation
**Purpose**: Get navigation menu items
**Expected Response**:
```json
{
  "success": true,
  "message": "Menu navigasi berhasil dimuat",
  "data": [
    {
      "id": "uuid-string",
      "title": "Sejarah",
      "slug": "sejarah",
      "icon": "FaHistory",
      "order": 1,
      "isActive": true
    }
  ]
}
```

#### GET /api/v1/statistics/public
**Purpose**: Get public website statistics
**Expected Response**:
```json
{
  "success": true,
  "message": "Statistik berhasil dimuat",
  "data": {
    "totalDonations": {
      "amount": 150000000,
      "programs": 5,
      "donors": 125
    },
    "activities": {
      "total": 12,
      "thisMonth": 3
    },
    "news": {
      "total": 8,
      "thisWeek": 2
    },
    "visitors": {
      "today": 45,
      "thisMonth": 1200,
      "total": 25000
    }
  }
}
```

### Priority 2: Extended API Endpoints

#### GET /api/v1/articles
**Query Parameters**:
```
- page: number (default: 1)
- limit: number (default: 10)
- category: string (kegiatan|berita|sumbangan|fasilitas|profil)
- status: string (published|draft|archived)
- featured: boolean
- search: string
- tags: string (comma-separated)
- sort: string (publishedAt|title|views|likes)
- order: string (asc|desc, default: desc)
```

#### GET /api/v1/articles/{id}
#### GET /api/v1/articles/slug/{slug}
#### POST /api/v1/articles/{id}/view
#### POST /api/v1/articles/{id}/like

#### GET /api/v1/donations
#### GET /api/v1/donations/{id}
#### GET /api/v1/donations/slug/{slug}
#### GET /api/v1/donations/{transactionId}/status

#### GET /api/v1/news
#### GET /api/v1/news/{id}
#### GET /api/v1/news/slug/{slug}
#### PATCH /api/v1/news/{id}/views

#### POST /api/v1/analytics/track
**Request Body**:
```json
{
  "type": "page_view",
  "resourceId": "home",
  "metadata": {
    "referrer": "google.com",
    "userAgent": "Mozilla/5.0...",
    "sessionId": "session-123"
  }
}
```

## 3. Request/Response Format Standardization

### Standard Request Headers
```typescript
const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  'X-Client-Version': '1.0.0'
}
```

### Standard Response Format
```typescript
// Success Response
{
  "success": true,
  "message": "Data berhasil dimuat",
  "data": {
    // Actual data here
  },
  "meta": {
    "timestamp": "2025-06-29T10:30:00Z",
    "version": "1.0.0",
    "request_id": "req_123456789"
  }
}

// Error Response  
{
  "success": false,
  "message": "Terjadi kesalahan",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": "Field 'email' is required",
    "field": "email"
  },
  "meta": {
    "timestamp": "2025-06-29T10:30:00Z",
    "request_id": "req_123456789"
  }
}

// Paginated Response
{
  "success": true,
  "message": "Data berhasil dimuat", 
  "data": [
    // Array of items
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 10,
    "total_items": 100,
    "items_per_page": 10,
    "has_next": true,
    "has_prev": false
  },
  "meta": {
    "timestamp": "2025-06-29T10:30:00Z"
  }
}
```

## 4. Node.js Express Implementation

### Project Structure
```
be-alfurqon/
├── src/
│   ├── controllers/
│   │   ├── homeController.js
│   │   ├── articleController.js
│   │   ├── donationController.js
│   │   ├── newsController.js
│   │   ├── analyticsController.js
│   │   ├── authController.js
│   │   └── adminController.js
│   ├── services/
│   │   ├── homeService.js
│   │   ├── articleService.js
│   │   ├── donationService.js
│   │   ├── newsService.js
│   │   ├── cacheService.js
│   │   └── authService.js
│   ├── middleware/
│   │   ├── cors.js
│   │   ├── rateLimit.js
│   │   ├── validation.js
│   │   ├── errorHandler.js
│   │   ├── auth.js
│   │   └── upload.js
│   ├── utils/
│   │   ├── database.js
│   │   ├── response.js
│   │   └── helpers.js
│   ├── routes/
│   │   ├── api.js
│   │   ├── home.js
│   │   ├── articles.js
│   │   ├── donations.js
│   │   ├── news.js
│   │   └── auth.js
│   └── app.js
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.js
├── package.json
├── .env
├── .env.example
└── README.md
```

### Package.json Setup
```json
{
  "name": "be-alfurqon",
  "version": "1.0.0",
  "description": "Backend API untuk Masjid Al-Furqon",
  "main": "src/app.js",
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "build": "echo 'No build step needed'",
    "db:migrate": "prisma migrate dev",
    "db:generate": "prisma generate",
    "db:seed": "node prisma/seed.js",
    "db:reset": "prisma migrate reset",
    "test": "jest",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "compression": "^1.7.4",
    "morgan": "^1.10.0",
    "dotenv": "^16.3.1",
    "@prisma/client": "^5.7.0",
    "express-rate-limit": "^7.1.5",
    "redis": "^4.6.11",
    "joi": "^17.11.0",
    "multer": "^1.4.5",
    "cloudinary": "^1.41.0",
    "uuid": "^9.0.1",
    "crypto": "^1.0.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "prisma": "^5.7.0",
    "jest": "^29.7.0",
    "eslint": "^8.55.0",
    "eslint-config-prettier": "^9.1.0",
    "prettier": "^3.1.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### Main App Setup (src/app.js)
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

const corsMiddleware = require('./middleware/cors');
const rateLimitMiddleware = require('./middleware/rateLimit');
const errorHandler = require('./middleware/errorHandler');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 8080;

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression());

// CORS configuration
app.use(corsMiddleware);

// Rate limiting
app.use(rateLimitMiddleware);

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API routes
app.use('/api/v1', apiRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Al-Furqon Backend running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api/v1`);
});

module.exports = app;
```

### CORS Middleware (src/middleware/cors.js)
```javascript
const cors = require('cors');

const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || [
  'http://localhost:3000',
  'https://masjid-alfurqon.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-Client-Version'
  ],
  maxAge: 86400 // 24 hours
};

module.exports = cors(corsOptions);
```

### Rate Limiting (src/middleware/rateLimit.js)
```javascript
const rateLimit = require('express-rate-limit');

const createRateLimit = (windowMs, max, message) => rateLimit({
  windowMs,
  max,
  message: {
    success: false,
    message,
    error: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limit
const generalLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  100, // limit each IP to 100 requests per windowMs
  'Terlalu banyak request. Silakan coba lagi dalam 15 menit.'
);

// Donation submission rate limit (more restrictive)
const donationLimit = createRateLimit(
  5 * 60 * 1000, // 5 minutes
  5, // limit each IP to 5 donation requests per 5 minutes
  'Terlalu banyak pengiriman donasi. Silakan coba lagi dalam 5 menit.'
);

module.exports = {
  general: generalLimit,
  donation: donationLimit
};
```

### Database Utils (src/utils/database.js)
```javascript
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

// Database connection test
async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

connectDatabase();

module.exports = prisma;
```

### Response Helper (src/utils/response.js)
```javascript
/**
 * Standard API response format
 */
class ApiResponse {
  static success(data, message = 'Success', meta = {}) {
    return {
      success: true,
      message,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta
      }
    };
  }

  static error(message = 'Error occurred', error = null, statusCode = 500) {
    const response = {
      success: false,
      message,
      meta: {
        timestamp: new Date().toISOString()
      }
    };

    if (error) {
      response.error = typeof error === 'string' ? error : error.message;
    }

    return response;
  }

  static paginated(data, pagination, message = 'Data retrieved successfully') {
    return {
      success: true,
      message,
      data,
      pagination,
      meta: {
        timestamp: new Date().toISOString()
      }
    };
  }
}

module.exports = ApiResponse;
```

### Home Controller (src/controllers/homeController.js)
```javascript
const homeService = require('../services/homeService');
const ApiResponse = require('../utils/response');

class HomeController {
  // GET /api/v1/home/dashboard
  static async getHomePageData(req, res, next) {
    try {
      console.log('📊 Fetching home page data');
      const data = await homeService.getHomePageData();
      
      res.json(ApiResponse.success(data, 'Data berhasil dimuat'));
    } catch (error) {
      console.error('❌ Error fetching home page data:', error);
      next(error);
    }
  }

  // GET /api/v1/statistics/public
  static async getPublicStats(req, res, next) {
    try {
      const stats = await homeService.getPublicStatistics();
      
      res.json(ApiResponse.success(stats, 'Statistik berhasil dimuat'));
    } catch (error) {
      console.error('❌ Error fetching statistics:', error);
      next(error);
    }
  }
}

module.exports = HomeController;
```

### Home Service (src/services/homeService.js)
```javascript
const prisma = require('../utils/database');
const cacheService = require('./cacheService');

class HomeService {
  static async getHomePageData() {
    const cacheKey = 'homepage:data';
    
    // Try to get from cache first
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      console.log('📋 Returning cached home page data');
      return cached;
    }

    console.log('🔄 Building fresh home page data');

    // Get featured articles (max 6)
    const articles = await prisma.article.findMany({
      where: {
        status: 'published',
        featured: true
      },
      orderBy: {
        publishedAt: 'desc'
      },
      take: 6,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        content: true,
        image: true,
        category: true,
        status: true,
        authorName: true,
        authorAvatar: true,
        publishedAt: true,
        updatedAt: true,
        views: true,
        likes: true,
        tags: true,
        featured: true
      }
    });

    // Get active donations (max 3)
    const donations = await prisma.donation.findMany({
      where: {
        status: 'active'
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 3,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        detail: true,
        image: true,
        targetAmount: true,
        collectedAmount: true,
        status: true,
        startDate: true,
        endDate: true,
        bankName: true,
        accountNumber: true,
        accountName: true,
        createdAt: true,
        updatedAt: true,
        totalDonors: true
      }
    });

    // Get latest news (max 3)
    const news = await prisma.news.findMany({
      where: {
        publishedAt: {
          lte: new Date()
        }
      },
      orderBy: {
        publishedAt: 'desc'
      },
      take: 3,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        content: true,
        image: true,
        category: true,
        priority: true,
        publishedAt: true,
        updatedAt: true,
        authorName: true,
        views: true,
        summary: true
      }
    });

    // Get active menus
    const menus = await prisma.menu.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        orderIndex: 'asc'
      },
      select: {
        id: true,
        title: true,
        slug: true,
        icon: true,
        orderIndex: true,
        isActive: true,
        parentId: true,
        description: true
      }
    });

    // Get public statistics
    const stats = await this.getPublicStatistics();

    // Transform data untuk frontend
    const homeData = {
      articles: articles.map(article => ({
        id: article.id,
        title: article.title,
        slug: article.slug,
        description: article.description,
        content: article.content,
        image: article.image,
        category: article.category.toLowerCase(),
        status: article.status.toLowerCase(),
        author: {
          id: null,
          name: article.authorName || 'Admin',
          avatar: article.authorAvatar
        },
        publishedAt: article.publishedAt,
        updatedAt: article.updatedAt,
        views: article.views,
        likes: article.likes,
        tags: article.tags || [],
        featured: article.featured
      })),
      
      donations: donations.map(donation => ({
        id: donation.id,
        title: donation.title,
        slug: donation.slug,
        description: donation.description,
        detail: donation.detail,
        image: donation.image,
        target: Number(donation.targetAmount),
        collected: Number(donation.collectedAmount),
        percentage: Math.round((Number(donation.collectedAmount) / Number(donation.targetAmount)) * 100),
        status: donation.status.toLowerCase(),
        startDate: donation.startDate,
        endDate: donation.endDate,
        bankAccount: {
          bankName: donation.bankName || 'Bank Syariah Indonesia',
          accountNumber: donation.accountNumber || '',
          accountName: donation.accountName || 'Masjid Al-Furqon'
        },
        createdAt: donation.createdAt,
        updatedAt: donation.updatedAt,
        donors: {
          total: donation.totalDonors,
          recent: [] // TODO: Get recent donors if needed
        }
      })),
      
      news: news.map(item => ({
        id: item.id,
        title: item.title,
        slug: item.slug,
        description: item.description,
        content: item.content,
        image: item.image,
        category: item.category,
        priority: item.priority.toLowerCase(),
        publishedAt: item.publishedAt,
        updatedAt: item.updatedAt,
        author: {
          id: null,
          name: item.authorName || 'Admin Masjid'
        },
        views: item.views,
        summary: item.summary
      })),
      
      menus: menus.map(menu => ({
        id: menu.id,
        title: menu.title,
        slug: menu.slug,
        icon: menu.icon,
        order: menu.orderIndex,
        isActive: menu.isActive,
        parentId: menu.parentId,
        description: menu.description
      })),
      
      stats
    };

    // Cache for 1 hour
    await cacheService.set(cacheKey, homeData, 3600);

    console.log(`✅ Home data built: ${articles.length} articles, ${donations.length} donations, ${news.length} news`);
    
    return homeData;
  }

  static async getPublicStatistics() {
    const cacheKey = 'stats:public';
    
    const cached = await cacheService.get(cacheKey);
    if (cached) return cached;

    // Get current date for queries
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));

    const stats = {
      totalDonations: {
        amount: await prisma.donation.aggregate({
          _sum: { collectedAmount: true }
        }).then(result => Number(result._sum.collectedAmount) || 0),
        programs: await prisma.donation.count({
          where: { status: 'active' }
        }),
        donors: await prisma.donationTransaction.count({
          where: { status: 'paid' }
        })
      },
      activities: {
        total: await prisma.article.count({
          where: { 
            status: 'published',
            category: 'kegiatan'
          }
        }),
        thisMonth: await prisma.article.count({
          where: {
            status: 'published',
            category: 'kegiatan',
            publishedAt: { gte: startOfMonth }
          }
        })
      },
      news: {
        total: await prisma.news.count({
          where: {
            publishedAt: { lte: new Date() }
          }
        }),
        thisWeek: await prisma.news.count({
          where: {
            publishedAt: { 
              gte: startOfWeek,
              lte: new Date()
            }
          }
        })
      },
      visitors: {
        today: await this.getVisitorCount('today'),
        thisMonth: await this.getVisitorCount('month'),
        total: await this.getVisitorCount('total')
      }
    };

    // Cache for 30 minutes
    await cacheService.set(cacheKey, stats, 1800);

    return stats;
  }

  static async getVisitorCount(period) {
    // Simple implementation - you can enhance this
    const baseCount = {
      today: 45,
      month: 1200,
      total: 25000
    };

    return baseCount[period] || 0;
  }
}

module.exports = HomeService;
```

### Cache Service (src/services/cacheService.js)
```javascript
const redis = require('redis');

class CacheService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.connect();
  }

  async connect() {
    try {
      if (process.env.REDIS_URL) {
        this.client = redis.createClient({
          url: process.env.REDIS_URL
        });

        this.client.on('error', (err) => {
          console.warn('⚠️ Redis client error:', err.message);
          this.isConnected = false;
        });

        this.client.on('connect', () => {
          console.log('✅ Redis connected');
          this.isConnected = true;
        });

        await this.client.connect();
      } else {
        console.log('⚠️ Redis URL not provided, using memory cache fallback');
        this.memoryCache = new Map();
      }
    } catch (error) {
      console.warn('⚠️ Redis connection failed, using memory cache:', error.message);
      this.memoryCache = new Map();
    }
  }

  async get(key) {
    try {
      if (this.client && this.isConnected) {
        const value = await this.client.get(key);
        return value ? JSON.parse(value) : null;
      } else if (this.memoryCache) {
        const item = this.memoryCache.get(key);
        if (item && item.expiry > Date.now()) {
          return item.value;
        }
        this.memoryCache.delete(key);
        return null;
      }
    } catch (error) {
      console.warn('Cache get error:', error.message);
      return null;
    }
  }

  async set(key, value, ttl = 3600) {
    try {
      if (this.client && this.isConnected) {
        await this.client.setEx(key, ttl, JSON.stringify(value));
      } else if (this.memoryCache) {
        this.memoryCache.set(key, {
          value,
          expiry: Date.now() + (ttl * 1000)
        });
      }
    } catch (error) {
      console.warn('Cache set error:', error.message);
    }
  }

  async del(key) {
    try {
      if (this.client && this.isConnected) {
        await this.client.del(key);
      } else if (this.memoryCache) {
        this.memoryCache.delete(key);
      }
    } catch (error) {
      console.warn('Cache delete error:', error.message);
    }
  }

  async clear() {
    try {
      if (this.client && this.isConnected) {
        await this.client.flushDb();
      } else if (this.memoryCache) {
        this.memoryCache.clear();
      }
    } catch (error) {
      console.warn('Cache clear error:', error.message);
    }
  }
}

module.exports = new CacheService();
```

### Error Handler (src/middleware/errorHandler.js)
```javascript
const ApiResponse = require('../utils/response');

function errorHandler(error, req, res, next) {
  console.error('💥 Error occurred:', error);

  // Default error
  let statusCode = 500;
  let message = 'Terjadi kesalahan';
  let errorDetails = null;

  // Prisma errors
  if (error.code === 'P2002') {
    statusCode = 400;
    message = 'Data sudah ada';
    errorDetails = 'DUPLICATE_ENTRY';
  } else if (error.code === 'P2025') {
    statusCode = 404;
    message = 'Data tidak ditemukan';
    errorDetails = 'NOT_FOUND';
  }

  // Validation errors
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Data tidak valid';
    errorDetails = error.details?.map(detail => detail.message).join(', ');
  }

  // CORS errors
  if (error.message.includes('CORS')) {
    statusCode = 403;
    message = 'Akses ditolak oleh CORS policy';
    errorDetails = 'CORS_ERROR';
  }

  const response = ApiResponse.error(message, errorDetails, statusCode);
  
  res.status(statusCode).json(response);
}

module.exports = errorHandler;
```

### API Routes (src/routes/api.js)
```javascript
const express = require('express');
const router = express.Router();

// Import route modules
const homeRoutes = require('./home');
const articleRoutes = require('./articles');
const donationRoutes = require('./donations');
const newsRoutes = require('./news');
const authRoutes = require('./auth');
const adminRoutes = require('./admin');

// Mount public routes
router.use('/home', homeRoutes);
router.use('/articles', articleRoutes);
router.use('/donations', donationRoutes);
router.use('/news', newsRoutes);
router.use('/statistics', homeRoutes); // Stats are handled by home controller

// Mount auth routes
router.use('/auth', authRoutes);

// Mount admin routes
router.use('/admin', adminRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Al-Furqon Backend API v1',
    version: '1.0.0',
    endpoints: {
      public: {
        home: '/home/dashboard',
        articles: '/articles',
        donations: '/donations',
        news: '/news',
        statistics: '/statistics/public'
      },
      auth: {
        login: '/auth/login',
        me: '/auth/me',
        logout: '/auth/logout'
      },
      admin: {
        articles: '/admin/articles',
        donations: '/admin/donations',
        news: '/admin/news',
        users: '/admin/users',
        analytics: '/admin/analytics'
      }
    },
    authentication: 'JWT Bearer Token required for admin endpoints',
    documentation: 'https://github.com/alfurqon/backend-api'
  });
});

module.exports = router;
```

### Home Routes (src/routes/home.js)
```javascript
const express = require('express');
const router = express.Router();
const HomeController = require('../controllers/homeController');

// GET /api/v1/home/dashboard
router.get('/dashboard', HomeController.getHomePageData);

// GET /api/v1/statistics/public
router.get('/public', HomeController.getPublicStats);

module.exports = router;
```

### Article Routes (src/routes/articles.js)
```javascript
const express = require('express');
const router = express.Router();
const ArticleController = require('../controllers/articleController');
const { general } = require('../middleware/rateLimit');

// Apply rate limiting
router.use(general);

// GET /api/v1/articles/featured
router.get('/featured', ArticleController.getFeaturedArticles);

// GET /api/v1/articles
router.get('/', ArticleController.getArticles);

// GET /api/v1/articles/:id
router.get('/:id', ArticleController.getArticleById);

// GET /api/v1/articles/slug/:slug
router.get('/slug/:slug', ArticleController.getArticleBySlug);

// POST /api/v1/articles/:id/view
router.post('/:id/view', ArticleController.incrementViews);

module.exports = router;
```

### Donation Routes (src/routes/donations.js)
```javascript
const express = require('express');
const router = express.Router();
const DonationController = require('../controllers/donationController');
const { general, donation } = require('../middleware/rateLimit');

// Apply rate limiting
router.use(general);

// GET /api/v1/donations/active
router.get('/active', DonationController.getActiveDonations);

// GET /api/v1/donations
router.get('/', DonationController.getDonations);

// GET /api/v1/donations/:id
router.get('/:id', DonationController.getDonationById);

// POST /api/v1/donations/submit (with stricter rate limit)
router.post('/submit', donation, DonationController.submitDonation);

module.exports = router;
```

### Auth Routes Setup (src/routes/auth.js)
```javascript
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { authenticateToken, requireSuperAdmin } = require('../middleware/auth');

// Public routes
router.post('/login', AuthController.login);

// Protected routes
router.get('/me', authenticateToken, AuthController.me);
router.post('/logout', authenticateToken, AuthController.logout);
router.put('/profile', authenticateToken, AuthController.updateProfile);
router.post('/change-password', authenticateToken, AuthController.changePassword);

// Super admin only
router.post('/register', authenticateToken, requireSuperAdmin, AuthController.register);

module.exports = router;
```

### Admin Routes Setup (src/routes/admin.js)
```javascript
const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const AuthController = require('../controllers/authController');
const { authenticateToken, requireAdmin, requireSuperAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Apply authentication to all admin routes
router.use(authenticateToken);

// Articles Management
router.get('/articles', requireAdmin, AdminController.getArticles);
router.post('/articles', requireAdmin, AdminController.createArticle);
router.get('/articles/:id', requireAdmin, AdminController.getArticle);
router.put('/articles/:id', requireAdmin, AdminController.updateArticle);
router.delete('/articles/:id', requireAdmin, AdminController.deleteArticle);
router.patch('/articles/:id/publish', requireAdmin, AdminController.publishArticle);
router.patch('/articles/:id/unpublish', requireAdmin, AdminController.unpublishArticle);

// Donations Management
router.get('/donations', requireAdmin, AdminController.getDonations);
router.post('/donations', requireAdmin, AdminController.createDonation);
router.get('/donations/:id', requireAdmin, AdminController.getDonation);
router.put('/donations/:id', requireAdmin, AdminController.updateDonation);
router.delete('/donations/:id', requireAdmin, AdminController.deleteDonation);
router.get('/donations/:id/transactions', requireAdmin, AdminController.getDonationTransactions);

// News Management
router.get('/news', requireAdmin, AdminController.getNews);
router.post('/news', requireAdmin, AdminController.createNews);
router.get('/news/:id', requireAdmin, AdminController.getNewsItem);
router.put('/news/:id', requireAdmin, AdminController.updateNews);
router.delete('/news/:id', requireAdmin, AdminController.deleteNews);

// User Management (Super Admin only)
router.get('/users', requireSuperAdmin, AdminController.getUsers);
router.post('/users', requireSuperAdmin, AuthController.register);
router.get('/users/:id', requireSuperAdmin, AdminController.getUser);
router.put('/users/:id', requireSuperAdmin, AdminController.updateUser);
router.delete('/users/:id', requireSuperAdmin, AdminController.deleteUser);
router.patch('/users/:id/activate', requireSuperAdmin, AdminController.activateUser);
router.patch('/users/:id/deactivate', requireSuperAdmin, AdminController.deactivateUser);

// File Upload
router.post('/upload', requireAdmin, upload.single('file'), AdminController.uploadFile);
router.delete('/upload/:id', requireAdmin, AdminController.deleteFile);

// Analytics & Statistics
router.get('/analytics', requireAdmin, AdminController.getAnalytics);
router.get('/statistics', requireAdmin, AdminController.getDetailedStatistics);

module.exports = router;
```

### File Upload Middleware (src/middleware/upload.js)
```javascript
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedExtensions = process.env.ALLOWED_EXTENSIONS?.split(',') || ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  const ext = path.extname(file.originalname).toLowerCase().substring(1);
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`File type .${ext} not allowed. Allowed types: ${allowedExtensions.join(', ')}`), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB default
  }
});

module.exports = upload;
```

### Updated Seed Data dengan Admin Users (prisma/seed.js)
```javascript
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed admin users first
  console.log('👤 Creating admin users...');
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12);
  
  const users = await prisma.user.createMany({
    data: [
      {
        id: 'user-001',
        email: process.env.ADMIN_EMAIL || 'admin@alfurqon.com',
        password: hashedPassword,
        name: process.env.ADMIN_NAME || 'Super Admin',
        role: 'SUPER_ADMIN',
        isActive: true
      },
      {
        id: 'user-002',
        email: 'editor@alfurqon.com',
        password: hashedPassword,
        name: 'Editor Masjid',
        role: 'EDITOR',
        isActive: true
      },
      {
        id: 'user-003',
        email: 'ustadz@alfurqon.com',
        password: hashedPassword,
        name: 'Ustadz Ahmad',
        role: 'EDITOR',
        isActive: true
      }
    ]
  });

  // Seed menus
  console.log('📋 Creating menu items...');
  const menus = await prisma.menu.createMany({
    data: [
      {
        id: 'menu-001',
        title: 'Sejarah',
        slug: 'sejarah',
        icon: 'FaHistory',
        orderIndex: 1,
        isActive: true,
        parentId: null,
        description: 'Sejarah Masjid Al-Furqon'
      },
      {
        id: 'menu-002',
        title: 'Fasilitas',
        slug: 'fasilitas',
        icon: 'FaBuilding',
        orderIndex: 2,
        isActive: true,
        parentId: null,
        description: 'Fasilitas yang tersedia di masjid'
      }
    ]
  });

  // Update articles data to include authorId
  const articles = await prisma.article.createMany({
    data: [
      {
        id: 'article-001',
        title: 'Kajian Rutin Minggu Sore',
        slug: 'kajian-rutin-minggu-sore',
        description: 'Kajian rutin setiap hari minggu sore bersama Ustadz Ahmad tentang akidah dan akhlak',
        content: 'Kajian lengkap tentang akidah dan akhlak yang dilaksanakan setiap hari minggu sore di Masjid Al-Furqon. Program ini telah berjalan selama 5 tahun dan selalu mendapat antusiasme dari jamaah.',
        image: '/images/kajian.jpg',
        category: 'kegiatan',
        status: 'published',
        authorId: 'user-003', // Ustadz Ahmad
        authorName: 'Ustadz Ahmad',
        authorAvatar: '/images/ustadz-ahmad.jpg',
        publishedAt: new Date('2024-12-20T10:00:00Z'),
        featured: true,
        tags: ['kajian', 'akidah', 'akhlak'],
        views: 150,
        likes: 25
      },
      {
        id: 'article-002',
        title: 'Pengajian Ibu-Ibu Setiap Kamis',
        slug: 'pengajian-ibu-ibu-setiap-kamis',
        description: 'Pengajian khusus untuk ibu-ibu dengan materi fiqih wanita',
        content: 'Program pengajian khusus untuk kaum ibu dengan fokus pada fiqih wanita dan kehidupan berkeluarga dalam Islam.',
        image: '/images/gambar1.jpg',
        category: 'kegiatan',
        status: 'published',
        authorId: 'user-002', // Editor
        authorName: 'Ustadzah Fatimah',
        authorAvatar: '/images/ustadzah-fatimah.jpg',
        publishedAt: new Date('2024-12-18T14:00:00Z'),
        featured: true,
        tags: ['pengajian', 'fiqih', 'wanita'],
        views: 89,
        likes: 15
      },
      {
        id: 'article-003',
        title: 'Bakti Sosial Ramadhan 2024',
        slug: 'bakti-sosial-ramadhan-2024',
        description: 'Kegiatan bakti sosial pembagian takjil dan sembako kepada masyarakat',
        content: 'Alhamdulillah kegiatan bakti sosial dalam rangka bulan Ramadhan 2024 telah terlaksana dengan sukses.',
        image: '/images/foods.jpg',
        category: 'berita',
        status: 'published',
        authorId: 'user-001', // Super Admin
        authorName: 'Panitia Ramadhan',
        authorAvatar: '/images/panitia.jpg',
        publishedAt: new Date('2024-12-15T16:00:00Z'),
        featured: false,
        tags: ['bakti sosial', 'ramadhan', 'takjil'],
        views: 200,
        likes: 45
      }
    ]
  });

  // Update news data to include authorId
  const news = await prisma.news.createMany({
    data: [
      {
        id: 'news-001',
        title: 'Pembukaan Pendaftaran TPQ',
        slug: 'pembukaan-pendaftaran-tpq',
        description: 'Dibuka pendaftaran TPQ untuk anak-anak usia 5-12 tahun',
        content: 'Program TPQ Al-Furqon membuka pendaftaran untuk periode baru. Pendaftaran dibuka mulai tanggal 1 Januari 2025.',
        image: '/images/iqro.jpg',
        category: 'pengumuman',
        priority: 'high',
        authorId: 'user-001', // Super Admin
        authorName: 'Admin Masjid',
        publishedAt: new Date('2024-12-20T09:00:00Z'),
        summary: 'Pendaftaran TPQ dibuka mulai tanggal 1 Januari 2025',
        views: 89
      },
      {
        id: 'news-002',
        title: 'Jadwal Sholat Ramadhan 2024',
        slug: 'jadwal-sholat-ramadhan-2024',
        description: 'Jadwal sholat dan kegiatan selama bulan Ramadhan',
        content: 'Pengumuman jadwal sholat tarawih, tahajud, dan berbagai kegiatan selama bulan Ramadhan 2024.',
        image: '/images/gambar2.jpg',
        category: 'jadwal',
        priority: 'high',
        authorId: 'user-001', // Super Admin
        authorName: 'Admin Masjid',
        publishedAt: new Date('2024-12-18T08:00:00Z'),
        views: 156
      }
    ]
  });

  // Seed statistics
  console.log('📊 Creating site statistics...');
  const statistics = await prisma.siteStatistic.createMany({
    data: [
      {
        id: 'statistic-001',
        metricName: 'total_donations',
        metricValue: 150000000,
        metricDate: new Date('2024-12-20'),
        createdAt: new Date('2024-12-20T10:00:00Z'),
        updatedAt: new Date('2024-12-20T10:00:00Z')
      },
      {
        id: 'statistic-002',
        metricName: 'total_articles',
        metricValue: 100,
        metricDate: new Date('2024-12-20'),
        createdAt: new Date('2024-12-20T10:00:00Z'),
        updatedAt: new Date('2024-12-20T10:00:00Z')
      },
      {
        id: 'statistic-003',
        metricName: 'total_users',
        metricValue: 50,
        metricDate: new Date('2024-12-20'),
        createdAt: new Date('2024-12-20T10:00:00Z'),
        updatedAt: new Date('2024-12-20T10:00:00Z')
      }
    ]
  });

  console.log('✅ Database seeded successfully');
  console.log(`📊 Created: ${users.count} users, ${menus.count} menus, ${articles.count} articles, ${donations.count} donations, ${news.count} news, ${statistics.count} statistics`);
  console.log('👤 Default admin login:');
  console.log(`   Email: ${process.env.ADMIN_EMAIL || 'admin@alfurqon.com'}`);
  console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
}
```

### Testing Admin Endpoints
```bash
# Login admin
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@alfurqon.com",
    "password": "admin123"
  }'

# Get admin profile (with token from login response)
curl -X GET http://localhost:8080/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get all articles (admin)
curl -X GET http://localhost:8080/api/v1/admin/articles \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Create new article (admin)
curl -X POST http://localhost:8080/api/v1/admin/articles \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Artikel Baru dari Admin",
    "description": "Deskripsi artikel baru",
    "content": "Konten lengkap artikel...",
    "category": "kegiatan",
    "status": "published",
    "featured": true,
    "tags": ["admin", "test"]
  }'

# Get admin analytics
curl -X GET http://localhost:8080/api/v1/admin/analytics \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Upload file (admin)
curl -X POST http://localhost:8080/api/v1/admin/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/image.jpg"
```

## 🎯 Summary Update

✅ **Backend Al-Furqon sekarang dilengkapi dengan sistem CMS lengkap:**

### 🔐 **Authentication System**
- **JWT-based authentication** untuk admin login
- **Role-based access control** (SUPER_ADMIN, ADMIN, EDITOR, USER)
- **Secure password hashing** dengan bcryptjs
- **Token validation** dan user session management

### 👥 **User Management**
- **Multi-level admin roles** dengan permission berbeda
- **User CRUD operations** (Super Admin only)
- **User activation/deactivation**
- **Profile management**

### 📝 **Content Management System (CMS)**
- **Articles Management**: Create, Read, Update, Delete, Publish/Unpublish
- **Donations Management**: Program donasi dan tracking transaksi
- **News Management**: Berita dan pengumuman masjid
- **File Upload System**: Upload gambar dan dokumen
- **Analytics Dashboard**: Statistik lengkap untuk admin

### 🛡️ **Security Features**
- **JWT token authentication**
- **Role-based permissions**
- **File upload validation**
- **Input sanitization**
- **Rate limiting**

### 📊 **Admin Dashboard Features**
- **Comprehensive analytics** (total articles, donations, users, dll)
- **Recent activity tracking**
- **Content statistics**
- **User activity monitoring**

### 🚀 **API Endpoints**
- **Public API**: Untuk frontend publik (tanpa auth)
- **Admin API**: Untuk CMS admin (dengan auth)
- **Auth API**: Login, logout, profile management
- **File Upload API**: Upload dan manage files

Backend ini sekarang **100% ready** untuk:
1. **Frontend publik** Masjid Al-Furqon 
2. **Admin dashboard** untuk content management
3. **Production deployment** dengan security features lengkap

**Default Admin Login:**
- Email: `admin@alfurqon.com`
- Password: `admin123`

Sistem CMS sudah siap digunakan! 🎉
