# 🚀 Quick Deploy Instructions

## Your app is ready for deployment! Here's what I've set up:

✅ **Vercel Configuration**: Updated `vercel.json` with proper routing  
✅ **API Functions**: All endpoints work with Vercel serverless functions  
✅ **Database Ready**: Configured for Neon PostgreSQL  
✅ **Build Scripts**: Production-ready package.json  
✅ **CORS Enabled**: Cross-origin embedding works  
✅ **Integration Toggle**: Real Notion API validation included  

## 📋 Steps to Deploy (5 minutes):

### 1. Set Up Neon Database
- Go to https://console.neon.tech/
- Sign up with GitHub
- Create project: "instagram-notion-widgets"
- Copy your database connection string

### 2. Upload to GitHub
- Create new repository: "instagram-notion-widgets"  
- Upload ALL files from your Replit project
- Make repository **public** (required for Vercel free tier)

### 3. Deploy to Vercel
- Go to https://vercel.com
- Sign up with GitHub
- Import your repository
- Add environment variable: `DATABASE_URL` = your Neon connection string
- Deploy!

## 🎯 Your Integration Toggle Will Work!

The key feature you mentioned - the integration toggle that enables after entering a valid token - is now properly implemented:

- Real Notion API token validation (`/api/validate-token`)
- Live database access testing (`/api/validate-database`)
- Toggle enables only with valid credentials

## 🔗 After Deployment

Your app will be live at: `https://YOUR-PROJECT-NAME.vercel.app`

Test the setup form at: `https://YOUR-PROJECT-NAME.vercel.app/setup`

Embed widgets like: `https://YOUR-PROJECT-NAME.vercel.app/widget/TOKEN`

---

**Need help?** Follow the complete guide in `DEPLOYMENT_GUIDE.md`