# 🚀 Storvita.com Deployment Instructions

## What's Built

✅ **Homepage** - Professional landing page with services
✅ **Network Assessment Calculator** - Interactive lead gen tool
✅ **Security Audit Tool** - 10-question security score

## Deploy to Vercel (15 Minutes)

### Step 1: Login to Vercel
1. Go to vercel.com/login
2. Email: chris.iorg@storvita.com
3. Password: Kn@ck99!storvita

### Step 2: Create New Project
1. Click "Add New" → "Project"
2. Choose "Import Git Repository" OR "Deploy from ZIP"

### Step 3A: Deploy from ZIP (Easiest)
1. Download all files from `/root/.openclaw/workspace/storvita/`
2. ZIP them up
3. Drag-drop into Vercel
4. Click "Deploy"

### Step 3B: Or I Can Create GitHub Repo
- Would need GitHub access to auto-push
- Then Vercel connects to GitHub
- Auto-deploys on every change

### Step 4: Get DNS Records
Once deployed, Vercel will show:
- Production domain (something like storvita-xyz.vercel.app)
- DNS records needed

Copy these records (will look like):
```
Type: A
Host: @
Value: 76.76.21.21

Type: CNAME  
Host: www
Value: cname.vercel-dns.com
```

### Step 5: Update Squarespace DNS
1. Go back to Squarespace DNS Settings
2. Click "ADD PRESET" or add manually:
   - Add the A record (points storvita.com to Vercel)
   - Add the CNAME (points www.storvita.com to Vercel)
3. DELETE "Squarespace Domain Connect" CNAME
4. KEEP all Google Workspace MX records (email)

### Step 6: Wait for DNS Propagation
- Usually 5-30 minutes
- Check storvita.com - should show new site!

## Need Help?

Send me screenshot at any step and I'll guide you through.
