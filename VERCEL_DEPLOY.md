# Deploy Your Widget to Vercel - Complete Beginner Guide

This guide will help you deploy your Instagram widget to Vercel for **FREE** - even if you've never coded or deployed anything before!

## What You'll Need
- 15 minutes of your time
- A computer with internet
- Your current database connection (we'll show you where to find it)

---

## Step 1: Create Your Free Vercel Account

1. **Go to** [vercel.com](https://vercel.com)
2. **Click** "Sign Up" 
3. **Choose** "Continue with GitHub" (easiest option)
4. **Create a GitHub account** if you don't have one (it's also free)
5. **Authorize Vercel** to access your GitHub

✅ **You now have a Vercel account!**

---

## Step 2: Install the Deployment Tool

Don't worry - this is easier than it sounds!

### For Windows:
1. **Press** `Windows key + R`
2. **Type** `cmd` and press Enter
3. **Copy and paste** this command:
   ```
   npm install -g vercel
   ```
4. **Press Enter** and wait (it takes 1-2 minutes)

### For Mac:
1. **Press** `Cmd + Space` 
2. **Type** `terminal` and press Enter
3. **Copy and paste** this command:
   ```
   npm install -g vercel
   ```
4. **Press Enter** and wait (it takes 1-2 minutes)

✅ **The deployment tool is now installed!**

---

## Step 3: Prepare Your Project Files

In your Replit project, you need to switch to a special configuration file for Vercel:

1. **Open the Shell** (bottom panel in Replit - it's the black terminal window)
2. **Copy and paste** this command:
   ```bash
   cp package.json.vercel package.json
   ```
3. **Press Enter**

**What this does:** This copies a special Vercel-optimized version of your project settings over your current settings. Don't worry - this doesn't break anything, it just tells Vercel how to deploy your app.

✅ **Your project is ready for deployment!**

---

## Step 4: Get Your Database Connection

You'll need this information for the next step:

1. **In Replit**, click the **"Secrets"** tab (left sidebar)
2. **Find** the secret called `DATABASE_URL`
3. **Click the eye icon** to reveal it
4. **Copy the entire URL** (it starts with `postgresql://`)
5. **Save it somewhere** (like in a text file) - you'll need it in Step 6

✅ **Database connection saved!**

---

## Step 5: Deploy to Vercel

Back in your Replit Shell:

1. **Type** this command and press Enter:
   ```bash
   vercel login
   ```

2. **It will ask**: "Continue with GitHub?" 
   - **Type** `y` and press Enter

3. **A browser window opens** 
   - **Click** "Authorize Vercel"
   - **Go back** to your Replit tab

4. **Type** this command and press Enter:
   ```bash
   vercel
   ```

5. **Answer the questions**:
   - "Set up and deploy?" → **Type** `y` and press Enter
   - "Which scope?" → **Press Enter** (use default)
   - "Link to existing project?" → **Type** `n` and press Enter
   - "Project name?" → **Type** `my-instagram-widget` and press Enter
   - "In which directory?" → **Press Enter** (use default)
   - "Override settings?" → **Type** `n` and press Enter

6. **Wait 2-3 minutes** while it deploys

✅ **Your widget is now live on the internet!**

---

## Step 6: Add Your Database Connection

After deployment finishes:

1. **Copy the URL** Vercel shows you (it looks like `https://my-instagram-widget.vercel.app`)
2. **Open that URL** in a new browser tab
3. **Go to** [vercel.com/dashboard](https://vercel.com/dashboard)
4. **Click on** your project (`my-instagram-widget`)
5. **Click** "Settings" tab
6. **Click** "Environment Variables" in the left menu
7. **Click** "Add New"
8. **Fill in**:
   - Name: `DATABASE_URL`
   - Value: *paste the database URL you copied in Step 4*
9. **Click** "Save"

✅ **Database connected!**

---

## Step 7: Redeploy with Database

Back in Replit Shell:

1. **Type** this command and press Enter:
   ```bash
   vercel --prod
   ```
2. **Wait 1-2 minutes**

✅ **Your widget is now fully working!**

---

## Step 8: Get Your Widget Link

Your widget is now available at:
```
https://my-instagram-widget.vercel.app/widget/c9a60321a9f7
```

**Replace** `my-instagram-widget` with your actual project name if you chose a different one.

---

## Step 9: Update Your Notion Page

1. **Go to your Notion page** where the widget is embedded
2. **Delete the old widget** (the one with the Replit URL)
3. **Type** `/embed` and press Enter
4. **Paste your new Vercel URL** from Step 8
5. **Press Enter**

🎉 **Your widget is now deployed for FREE and will work 24/7!**

---

## What You Get for FREE:
- ✅ Always available (24/7)
- ✅ Fast loading worldwide
- ✅ Secure HTTPS connection
- ✅ No monthly costs
- ✅ Automatic updates when you redeploy

## Need Help?
If something doesn't work:
1. **Check** that you copied the DATABASE_URL correctly
2. **Wait 5 minutes** after adding environment variables
3. **Try visiting** your widget URL directly in a browser
4. **Ask for help** if you get stuck!

## Future Updates
To update your widget later:
1. **Make changes** in Replit
2. **Run** `vercel --prod` in the Shell
3. **Wait 2 minutes** - your widget updates automatically!

**Congratulations!** You've successfully deployed your first web application! 🚀