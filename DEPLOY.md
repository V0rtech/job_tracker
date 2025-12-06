# Deployment Guide (Vercel + PostgreSQL)

Your app is now configured to use PostgreSQL, which is perfect for deploying to Vercel.

## 1. Push to GitHub
Push your code to a new GitHub repository.

```bash
git init
git add .
git commit -m "Initial commit"
# git remote add origin ...
# git push -u origin main
```

## 2. Set up Vercel
1. Go to [Vercel](https://vercel.com) and sign up/login.
2. Click **"Add New..."** -> **"Project"**.
3. Import your GitHub repository.

## 3. Create Database
*Before* you click "Deploy":
1. On the project configuration screen, look for **"Storage"** or **"Database"** in the menu (or deploy first and add it later, but adding it first is smoother).
2. Actually, the easiest way is:
   - Click **"Deploy"**. It might fail initially or build without a DB. That's okay.
   - Once the project is created, go to the **Storage** tab in the Vercel Dashboard.
   - Click **"Connect Store"** -> **"Postgres"**.
   - Accept the terms and create the database.
   - **Important:** Vercel will automatically add the `DATABASE_URL` and other env vars to your project settings.

## 4. Deploy & Migrate
Once the database is connected:
1. Go to **Deployments**.
2. Redeploy the latest commit (or push a small change to trigger it).
3. Vercel will build your app.
4. **Database Migration**: You need to apply your schema to the new production DB.
   - You can do this locally if you connect to the remote DB, OR
   - Add a build script.

**Recommended**: Add a `postinstall` script to `package.json` to generate the client, and use the build command to migrate.

Actually, Vercel automatically runs `prisma generate` if it detects Prisma.

To apply the schema to the DB, run this locally (set `DATABASE_URL` to your Vercel Postgres URL first in `.env`), OR run it from the Vercel Command Palette.

**Easiest way for you:**
After connecting the database in Vercel, go to **Settings** -> **Environment Variables**.
Copy the `POSTGRES_PRISMA_URL` or `DATABASE_URL`.
Paste it into your local `.env` file (replace the sqlite one).
Run:
```bash
npx prisma db push
```
This will create the tables in your live Vercel database.

Then your Vercel deployment will work!

## 5. Environment Variables
Make sure you set these in Vercel (Settings -> Environment Variables):
- `APP_PASSWORD`: The password for your login page.

