#!/bin/bash

# MIỄN PHÍ: Full-Stack Cloudflare Deployment Script
echo "🚀 Starting FULL-STACK Cloudflare deployment..."
echo "💰 Cost: $0/month (100% FREE)"

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "📦 Installing Wrangler CLI..."
    npm install -g wrangler
fi

# Login to Cloudflare (if not already logged in)
echo "🔐 Please ensure you're logged in to Cloudflare..."
echo "Run: wrangler login"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the frontend
echo "🔨 Building frontend for production..."
npm run build:production

# Deploy the API Worker
echo "🚀 Deploying API Worker..."
wrangler deploy

# Get Worker URL
WORKER_URL=$(wrangler whoami 2>/dev/null | grep -o 'https://.*\.workers\.dev' | head -1)
if [ -z "$WORKER_URL" ]; then
    WORKER_URL="https://portfolio-api.your-subdomain.workers.dev"
fi

echo "✅ Deployment completed successfully!"
echo ""
echo "� DEPLOYMENT SUMMARY:"
echo "=================="
echo "🌐 Frontend: Ready for Cloudflare Pages"
echo "📁 Build directory: public/"
echo "⚡ API Worker: $WORKER_URL"
echo "💰 Total cost: $0/month"
echo ""
echo "🔧 FINAL STEPS:"
echo "1. Go to Cloudflare Dashboard > Pages"
echo "2. Connect your GitHub repository"
echo "3. Set build command: npm run build:production"
echo "4. Set build output directory: public"
echo "5. Add environment variable: VITE_API_URL=$WORKER_URL"
echo "6. Deploy Pages!"
echo ""
echo "🎉 Your full-stack app will be running 100% FREE on Cloudflare!"