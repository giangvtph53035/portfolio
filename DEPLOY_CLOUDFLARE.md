# Deploy Laravel + React (Inertia.js) to Cloudflare

## ⚠️ Lưu ý quan trọng về kiến trúc hiện tại

Dự án của bạn sử dụng **Laravel + Inertia.js + React**, có nghĩa là:
- ✅ **Laravel PHP**: Xử lý dữ liệu, API, business logic
- ✅ **React**: Xử lý giao diện người dùng
- ✅ **Inertia.js**: Kết nối giữa Laravel và React

## 🚀 Deploy MIỄN PHÍ toàn bộ dự án lên Cloudflare

### ✅ Phương án: Full Cloudflare (100% MIỄN PHÍ)
- **Frontend (React)**: Cloudflare Pages (miễn phí)
- **Backend API (Laravel)**: Cloudflare Workers (miễn phí 100k requests/day)
- **Database**: Cloudflare D1 (miễn phí) hoặc PlanetScale (miễn phí)
- **File Storage**: Cloudflare R2 (miễn phí 10GB/tháng)

### 💰 Chi phí: $0/tháng
- Cloudflare Pages: Miễn phí không giới hạn
- Cloudflare Workers: Miễn phí 100,000 requests/ngày
- Cloudflare D1: Miễn phí 5GB storage
- Domain tùy chọn: Có thể sử dụng subdomain miễn phí

## 🎯 Cách deploy toàn bộ dự án MIỄN PHÍ

### Bước 1: Setup Cloudflare Workers cho Laravel API

#### 1.1. Tạo Worker cho API
```bash
# Cài đặt Wrangler CLI
npm install -g wrangler

# Login vào Cloudflare
wrangler login

# Tạo worker cho API
wrangler init api-worker
```

#### 1.2. Setup Database (Cloudflare D1 - MIỄN PHÍ)
```bash
# Tạo D1 database
wrangler d1 create portfolio-db

# Chạy migrations
wrangler d1 execute portfolio-db --file=./database/migrations/schema.sql
```

### Bước 2: Deploy Frontend (Cloudflare Pages)

#### 2.1. Cấu hình trên Cloudflare Pages
1. Đăng nhập vào [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Chọn **Pages** từ sidebar
3. Click **Create a project**
4. Chọn **Connect to Git** và kết nối với GitHub repository

#### 2.2. Build Settings cho Pages
- **Framework preset**: Vite
- **Build command**: `npm run build:cloudflare`
- **Build output directory**: `public`
- **Root directory**: `/` (để trống)

#### 2.3. Environment Variables cho Pages
```env
VITE_APP_NAME=Portfolio
VITE_API_URL=https://your-worker.your-subdomain.workers.dev
VITE_GITHUB_TOKEN=your_github_token
VITE_GITHUB_USERNAME=your_github_username
NODE_ENV=production
```

### Bước 3: Kết nối API và Frontend
1. Deploy Worker API trước
2. Lấy URL của Worker
3. Cập nhật `VITE_API_URL` trong Pages environment variables
4. Deploy Pages

### Bước 4: Auto Deploy
1. Click **Save and Deploy** trên Pages
2. Deploy Worker với `wrangler deploy`
3. Cloudflare sẽ tự động build và deploy toàn bộ hệ thống
4. Bạn sẽ có URL miễn phí để truy cập website

## Local Testing
Để test trước khi deploy:

```bash
# Build cho production
npm run build:production

# Preview build
npm run preview
```

## 💻 Commands để deploy

### Local Development
```bash
# Chạy development server (React)
npm run dev

# Chạy worker locally
npm run dev:worker

# Build cho production
npm run build:production
```

### Deployment Commands
```bash
# Deploy API Worker
npm run deploy:worker

# Deploy toàn bộ (build + deploy worker)
npm run deploy:full

# Set secrets cho Worker
wrangler secret put GITHUB_TOKEN
wrangler secret put GITHUB_USERNAME
```

### Quick Deploy Script
```bash
# Chạy script tự động
chmod +x deploy-cloudflare.sh
./deploy-cloudflare.sh
```

## 🎯 Kết quả cuối cùng

Sau khi hoàn thành, bạn sẽ có:

✅ **API Worker**: `https://portfolio-api.your-subdomain.workers.dev`
- Xử lý GitHub API requests
- Serve project data
- CORS-enabled
- **MIỄN PHÍ**: 100,000 requests/ngày

✅ **Frontend**: `https://portfolio.pages.dev`
- React SPA với Inertia.js
- Tailwind CSS styling
- i18n support (Vietnamese/English)
- **MIỄN PHÍ**: Unlimited bandwidth

✅ **Total Cost**: **$0/tháng** 🎉

## 🔧 Troubleshooting

### Worker không hoạt động
- Kiểm tra `wrangler.toml` configuration
- Đảm bảo `GITHUB_TOKEN` đã được set: `wrangler secret put GITHUB_TOKEN`
- Check logs: `wrangler tail`

### Pages build failed
- Kiểm tra build command: `npm run build:production`
- Đảm bảo `VITE_API_URL` trỏ đến Worker URL
- Check environment variables trong Pages settings

### CORS issues
- Worker đã có CORS headers configured
- Đảm bảo API calls đi qua Worker URL

### GitHub API rate limit
- Thêm `GITHUB_TOKEN` để tăng rate limit từ 60 → 5000 requests/hour
- Token cần scope: `public_repo` (read-only)