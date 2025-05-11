# Deploying the ChessChain App to Vercel

Follow these steps to successfully deploy your ChessChain application to Vercel.

## 1. Database Setup

This application requires a PostgreSQL database. You can create one on:
- [Neon](https://neon.tech) (recommended, has a free tier)
- [Supabase](https://supabase.com)
- [Railway](https://railway.app)

After creating your database, you'll need the connection string in this format:
```
postgresql://username:password@hostname:port/database
```

## 2. Vercel Setup

### 2.1 Add Environment Variables

In your Vercel project settings, add these environment variables:

- `DATABASE_URL`: Your PostgreSQL connection string
- `NODE_ENV`: Set to `production`

### 2.2 Deploy Configuration

1. Make sure your project has the `vercel.json` file with the proper configuration
2. When importing your project, set these settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

## 3. Database Initialization

After deployment, you'll need to initialize your database:

1. Install Vercel CLI: `npm i -g vercel`
2. Log in to Vercel: `vercel login`
3. Link your project: `vercel link`
4. Run database initialization: `vercel env pull && npx drizzle-kit push --force && npx tsx db/seed.ts`

## 4. Troubleshooting

If you see code displayed instead of your application rendering:

1. Check console logs in Vercel for errors
2. Ensure your `vercel.json` file is correctly configured
3. Check if you've set all required environment variables
4. Make sure your database is accessible from Vercel's servers

## 5. Important Considerations

- For Web3 functionality to work correctly, users will need to connect with MetaMask
- Switching networks in MetaMask might require a page refresh
- The smart contract needs to be deployed on a test network like Sepolia for testing