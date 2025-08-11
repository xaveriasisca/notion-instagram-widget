# Deploy Your Instagram Widget to Vercel for FREE

This guide will help you deploy your widget for $0/month using GitHub and Vercel - perfect for someone who has never coded before!

## What You'll Get
- ✅ **FREE hosting forever** (no monthly costs)
- ✅ **Always available** (24/7 uptime)
- ✅ **Fast loading worldwide**
- ✅ **Secure HTTPS connection**
- ✅ **Professional URL** (like yourwidget.vercel.app)

---

## Step 1: Create Your GitHub Account (FREE)

1. **Go to** [github.com](https://github.com)
2. **Click** "Sign up"
3. **Choose a username** (like: yourname-widgets)
4. **Enter your email** and create a password
5. **Verify your email** when GitHub sends you a message
6. **Choose the FREE plan** when asked

✅ **You now have a GitHub account!**

---

## Step 2: Create Your Vercel Account (FREE)

1. **Go to** [vercel.com](https://vercel.com)
2. **Click** "Sign Up"
3. **Choose** "Continue with GitHub" (this connects your accounts)
4. **Click** "Authorize Vercel" when GitHub asks
5. **Choose the FREE "Hobby" plan**

✅ **You now have a Vercel account connected to GitHub!**

---

## Step 3: Get Your Code to GitHub

Back in your Replit project:

### 3a. Prepare Your Project
1. **In Replit Shell** (the black terminal at bottom), copy and paste this command:
   ```bash
   cp package.vercel.json package.json
   ```
2. **Press Enter** (this prepares your project for Vercel)
3. **Wait 10 seconds** for the command to complete

### 3b. Download Your Project Files
1. **In Replit**, click the **three dots menu** (⋮) next to "Files"
2. **Click** "Download as zip"
3. **Save the file** to your computer (like Downloads folder)
4. **Unzip/Extract** the downloaded file

### 3c. Upload to GitHub
1. **Go to** [github.com](https://github.com)
2. **Click the green "New" button** (top left)
3. **Repository name**: Type `my-instagram-widget`
4. **Description**: Type `Instagram widget for Notion`
5. **Make sure** "Public" is selected
6. **Check** "Add a README file"
7. **Click** "Create repository"

### 3d. Upload Your Files
1. **Click** "uploading an existing file" (blue link)
2. **Drag and drop** all files from your unzipped folder
3. **Type a message** like "Initial upload"
4. **Click** "Commit changes"

✅ **Your code is now on GitHub!**

---

## Step 4: Create Your FREE Database

Instead of using Replit's database, you'll create your own free one:

### 4a. Sign up for Neon (FREE PostgreSQL)
1. **Go to** [neon.tech](https://neon.tech)
2. **Click** "Sign Up"
3. **Choose** "Continue with GitHub" (connects to your existing account)
4. **Select** "Free Tier" (0$ forever)
5. **Click** "Create your first project"

### 4b. Create Your Database
1. **Project name**: Type `instagram-widget-db`
2. **Database name**: Keep as `neondb`
3. **Region**: Choose closest to you
4. **Click** "Create Project"

### 4c. Get Your Connection String
1. **Click** "Dashboard" after creation
2. **Click** your project name `instagram-widget-db`
3. **Click** "Connection Details"
4. **Copy the connection string** (starts with `postgresql://`)
5. **Save it in a text file** - you'll need it in Step 6

✅ **Your own database created for FREE!**

---

## Step 5: Deploy to Vercel

1. **Go to** [vercel.com/dashboard](https://vercel.com/dashboard)
2. **Click** "Add New Project"
3. **Find your repository** `my-instagram-widget`
4. **Click** "Import"

### Configure the Deployment:
- **Project Name**: Keep as `my-instagram-widget` 
- **Framework Preset**: Choose "Other"
- **Root Directory**: Leave as `./`
- **Build Command**: Type `npm run build`
- **Output Directory**: Type `dist/public`

5. **Click** "Deploy"
6. **Wait 2-3 minutes** for deployment to finish

✅ **Your widget is now deployed!**

---

## Step 6: Add Your Database Connection

After deployment finishes:

1. **Click** "Continue to Dashboard"
2. **Click** on your project name (`my-instagram-widget`)
3. **Click** "Settings" tab
4. **Click** "Environment Variables" in left menu
5. **Look for**:
   - A button that says "Add" or "Add Environment Variable" 
   - Or a text box at the top to add variables
   - Or click the "+" icon if you see one
6. **Fill in**:
   - **Name**: `DATABASE_URL`
   - **Value**: *Paste the database connection string from Step 4*
   - **Environments**: Check all boxes (Production, Preview, Development)
7. **Click** "Save" or "Add"

✅ **Database connected!**

---

## Step 7: Redeploy with Database

1. **Click** "Deployments" tab
2. **Click** the three dots (⋮) next to the latest deployment
3. **Click** "Redeploy"
4. **Click** "Redeploy" again to confirm
5. **Wait 2 minutes** for redeployment

✅ **Your widget is now fully working!**

---

## Step 8: Get Your Widget URLs

Your widget is now available at:

**Main URL**: `https://my-instagram-widget.vercel.app`
**Widget URL**: `https://my-instagram-widget.vercel.app/widget/c9a60321a9f7`

*(Replace `my-instagram-widget` with your actual project name if different)*

---

## Step 9: Update Your Notion Page

1. **Go to your Notion page** where you want the widget
2. **Delete the old widget** (if you have one)
3. **Type** `/embed` and press Enter
4. **Paste your widget URL** from Step 8
5. **Press Enter**

🎉 **Your widget is now live and FREE forever!**

---

## Step 10: Custom Domain (Optional)

Want a custom URL like `mywidgets.com`?

1. **Buy a domain** from any provider (like Namecheap, GoDaddy)
2. **In Vercel dashboard**, click "Settings" → "Domains"
3. **Add your domain** and follow the instructions
4. **Vercel handles everything else** automatically

---

## What You Get for FREE:

### Vercel Hosting:
- ✅ **100GB bandwidth/month** (plenty for widgets)
- ✅ **Unlimited projects**
- ✅ **Custom domains**
- ✅ **SSL certificates**
- ✅ **Global CDN**
- ✅ **Automatic deployments**

### Neon Database:
- ✅ **3GB storage** (plenty for widget data)
- ✅ **Unlimited queries**
- ✅ **Automatic backups**
- ✅ **Connection pooling**
- ✅ **Global availability**

## Future Updates

To update your widget:
1. **Edit files directly in GitHub** (click any file, then the pencil icon)
2. **Or download from Replit** and upload to GitHub again
3. **Vercel automatically redeploys** in 2 minutes!

**Pro tip**: Once deployed, you can edit everything directly in GitHub's web interface - no need for Replit!

## Need Help?

Common issues:
- **"Functions property cannot be used with builds"**: Use the updated vercel.json file (this is already fixed in your download)
- **"Build failed"**: Check that all files uploaded correctly
- **"Widget not found"**: Verify DATABASE_URL is set correctly
- **"Not loading"**: Wait 5 minutes after adding environment variables
- **"Can't find Add New button"**: Look for "Add Environment Variable", "Add", or "+" icon in the Environment Variables section
- **"Site requires authentication"**: In Vercel project settings → Security → Password Protection, set to "Disabled"
- **"Toggle button doesn't work"**: The latest version uses client-side validation - no API files needed. Just update your main React files and redeploy.

**Congratulations!** You've successfully deployed your first web application with **complete independence from Replit** for free! 🚀

## Complete Independence Achieved:
- ✅ **Your own GitHub repository** (you own the code)
- ✅ **Your own Vercel hosting** (free forever)
- ✅ **Your own Neon database** (free tier, 3GB storage)
- ✅ **No monthly costs** to anyone
- ✅ **No dependency on Replit** after initial setup

---

## Cost Comparison:
- **Replit Reserved VM**: $20/month
- **AWS/Digital Ocean**: $5-50/month
- **Heroku**: $7-25/month
- **Vercel + Neon (our solution)**: $0/month ✅

Your widget will handle thousands of views per month completely free with **ZERO dependency on Replit**!