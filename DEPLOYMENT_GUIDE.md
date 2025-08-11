# Complete Deployment Guide: GitHub + Vercel + Neon Database

## Overview
This guide will help you deploy your Instagram-Notion widget integration platform using free services:
- **GitHub** for code hosting
- **Vercel** for web hosting
- **Neon** for PostgreSQL database

## Step 1: Set Up Neon Database (Free PostgreSQL)

1. **Go to** https://console.neon.tech/
2. **Sign up** using your GitHub account (recommended)
3. **Create a new project**:
   - Project name: `instagram-notion-widgets`
   - Region: Choose closest to your users
4. **Copy your connection string**:
   - Go to Dashboard → Connection Details
   - Copy the **Connection string**
   - It looks like: `postgresql://username:password@host/database?sslmode=require`
   - **Save this** - you'll need it for Vercel

## Step 2: Prepare Your Project Files

Before uploading to GitHub, we need to use the correct package.json:

1. **In your Replit terminal, run**:
   ```bash
   cp package.json.deploy package.json
   ```

2. **Your project now has**:
   - ✅ Vercel-optimized package.json
   - ✅ Proper API functions in `/api` folder
   - ✅ Database configuration for Neon
   - ✅ Build scripts for deployment

## Step 3: Upload to GitHub

### Option A: Create New Repository (Recommended)
1. **Go to** https://github.com
2. **Click** "New repository"
3. **Name it**: `instagram-notion-widgets`
4. **Make it** Public (required for Vercel free tier)
5. **Don't initialize** with README
6. **Click** "Create repository"

### Option B: Use Existing Repository
1. **Go to your existing GitHub repository**
2. **Delete all files** (or use force push method from earlier)

### Upload Your Files
1. **Download all files from your Replit project**
2. **Drag and drop everything** into your GitHub repository
3. **Commit message**: "Deploy Instagram-Notion widget platform"
4. **Click** "Commit changes"

## Step 4: Deploy to Vercel

1. **Go to** https://vercel.com
2. **Sign up** with your GitHub account
3. **Click** "New Project"
4. **Import your GitHub repository**
5. **Configure the deployment**:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/public`
   - **Install Command**: `npm install`

6. **Before deploying, add your database**:
   - **Click** "Environment Variables"
   - **Add**: `DATABASE_URL` = your Neon connection string
   - **Click** "Deploy"

## Step 5: Set Up Database Tables

After your first deployment:

1. **Your Vercel app will be live** at: `https://your-project-name.vercel.app`
2. **The database tables will be created automatically** when you first use the app
3. **Test the setup form** to ensure everything works

## Step 6: Test Integration Toggle Feature

Your integration toggle (the key feature you mentioned) should now work:

1. **Go to** your deployed app `/setup`
2. **Enter a valid Notion token** (starts with `ntn_` or `secret_`)
3. **The toggle should enable** after token validation
4. **Enter your database URL**
5. **Complete the setup** - this creates your embeddable widget

## How It Works in Production

### API Endpoints (Serverless Functions)
- `/api/validate-token` - Validates Notion tokens
- `/api/validate-database` - Checks database access
- `/api/widgets` - Creates and lists widgets
- `/api/widget/[token]` - Serves widget data

### Database Integration
- **Neon PostgreSQL** stores widget configurations
- **Automatic reconnection** handling for serverless
- **Connection pooling** for performance

### Widget Embedding
Your widgets will be embeddable at:
```html
<iframe src="https://your-project-name.vercel.app/widget/TOKEN_HERE" 
        width="400" height="400" frameborder="0">
</iframe>
```

## Troubleshooting

### If Deployment Fails
1. **Check the build logs** in Vercel dashboard
2. **Ensure** `package.json` has the correct build script
3. **Verify** all dependencies are included

### If Database Connection Fails
1. **Check** your Neon database is active
2. **Verify** the `DATABASE_URL` environment variable
3. **Ensure** connection string includes `?sslmode=require`

### If Integration Toggle Doesn't Work
1. **Check** browser console for errors
2. **Verify** Notion token is valid
3. **Test** API endpoints directly: `/api/validate-token`

## Cost Breakdown (All Free!)

- **GitHub**: Free for public repositories
- **Vercel**: Free tier includes 100GB bandwidth/month
- **Neon**: Free tier includes 0.5GB storage + 10GB transfer

## Next Steps

Once deployed:
1. **Share your widget URLs** with clients
2. **Monitor usage** in Vercel dashboard
3. **Upgrade plans** when you need more resources
4. **Custom domains** available in Vercel settings

Your Instagram-Notion widget platform is now completely independent from Replit and running on professional hosting infrastructure!