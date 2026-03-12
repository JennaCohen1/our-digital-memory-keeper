# Deploy to Vercel

## 1. Push your code to GitHub

If you haven’t already:

```bash
git init
git add .
git commit -m "Initial commit"
# Create a repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

## 2. Connect the project to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (e.g. with GitHub).
2. Click **Add New…** → **Project**.
3. Import your GitHub repo and click **Deploy** (you can leave defaults).

## 3. Add the Google Client ID in Vercel

1. In Vercel, open your project → **Settings** → **Environment Variables**.
2. Add:
   - **Name:** `VITE_GOOGLE_CLIENT_ID`
   - **Value:** your Google OAuth Client ID (same as in `.env` locally).
3. Save and redeploy (Deployments → … on latest → **Redeploy**).

## 4. Allow your Vercel URL in Google OAuth

1. Open [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services** → **Credentials**.
2. Edit your **OAuth 2.0 Client ID** (or the one you use for production).
3. Under **Authorized JavaScript origins**, add:
   - `https://YOUR_PROJECT.vercel.app`
   - (If you use a custom domain, add that too, e.g. `https://yourdomain.com`.)
4. Under **Authorized redirect URIs**, add:
   - `https://YOUR_PROJECT.vercel.app`
   - (And your custom domain if you use one.)
5. **Save**.

Replace `YOUR_PROJECT` with your actual Vercel project name (e.g. `our-digital-memory-keeper`). You’ll see the exact URL in the Vercel dashboard after the first deploy.

After that, sign-in will work on your live Vercel URL.
