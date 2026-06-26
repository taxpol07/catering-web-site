# Premier Catering Equipment UK

A production-ready full-stack web application for a UK commercial catering equipment dealer. Built as an online warehouse/showroom for used commercial catering equipment.

## Tech Stack

- **Next.js 15** (App Router)
- **React 19** + **TypeScript**
- **Tailwind CSS 4**
- **Firebase Authentication** (admin login)
- **Firebase Firestore** (database)
- **Firebase Storage** (image uploads)
- **Vercel** (deployment)

## Features

### Customer Site
- Responsive dark/modern design
- Homepage with hero, featured equipment, and category showcase
- Equipment catalogue with search, category/brand/status filters, and pagination
- Equipment detail pages with image gallery and lightbox
- WhatsApp and Facebook contact buttons
- SEO-friendly metadata, sitemap, and robots.txt

### Admin Panel (`/admin`)
- Secure email/password login
- Dashboard with inventory statistics
- Full CRUD for equipment
- Mark items as sold
- Multi-photo upload to Firebase Storage
- Category management
- Search and filter inventory

## Project Structure

```
catering-equipment-warehouse/
├── firebase/
│   ├── firestore.rules      # Firestore security rules
│   ├── storage.rules        # Storage security rules
│   ├── SCHEMA.md            # Database schema documentation
│   └── sample-data.json     # Sample equipment data
├── scripts/
│   └── seed-firestore.ts    # Database seed script
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Homepage
│   │   ├── equipment/                  # Customer catalogue
│   │   ├── admin/
│   │   │   ├── login/                  # Admin login (public)
│   │   │   └── (panel)/                # Protected admin routes
│   │   ├── layout.tsx
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   ├── components/
│   │   ├── admin/                      # Admin components
│   │   ├── equipment/                  # Equipment UI
│   │   ├── home/                       # Homepage sections
│   │   ├── layout/                     # Header, Footer
│   │   └── ui/                         # Reusable UI
│   ├── context/
│   │   └── AuthContext.tsx             # Firebase auth provider
│   ├── lib/
│   │   ├── firebase/                   # Firebase config & services
│   │   ├── constants.ts
│   │   └── utils.ts
│   └── types/
│       └── index.ts
├── .env.local.example
├── firebase.json
└── package.json
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** → Email/Password sign-in method
4. Create **Firestore Database** (production mode)
5. Enable **Storage**
6. Register a **Web App** and copy the config values

### 3. Configure Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.local.example .env.local
```

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase web API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | e.g. `your-project.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | e.g. `your-project.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID |
| `NEXT_PUBLIC_ADMIN_UID` | UID of admin user (see step 4) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number (no + prefix), e.g. `447700900000` |
| `NEXT_PUBLIC_FACEBOOK_URL` | Your Facebook page URL |
| `NEXT_PUBLIC_BUSINESS_NAME` | Business display name |
| `NEXT_PUBLIC_BUSINESS_PHONE` | Contact phone number |
| `NEXT_PUBLIC_BUSINESS_EMAIL` | Contact email |
| `NEXT_PUBLIC_BUSINESS_ADDRESS` | Business address |
| `NEXT_PUBLIC_SITE_URL` | Production URL (for sitemap) |

### 4. Create Admin User

1. In Firebase Console → Authentication → Users → Add user
2. Create an admin account with email and password
3. Copy the user's **UID**
4. Set `NEXT_PUBLIC_ADMIN_UID` in `.env.local` to this UID

### 5. Deploy Firebase Security Rules

Install Firebase CLI if needed:

```bash
npm install -g firebase-tools
firebase login
firebase use your-project-id
firebase deploy --only firestore:rules,storage
```

Or paste the rules manually from `firebase/firestore.rules` and `firebase/storage.rules` into the Firebase Console.

### 6. Seed Sample Data (Optional)

1. Download service account JSON from Firebase Console → Project Settings → Service Accounts
2. Save as `firebase-service-account.json` in project root (gitignored)
3. Run:

```bash
npm run seed
```

This adds 12 sample equipment items and 10 categories.

### 7. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the customer site.
Open [http://localhost:3000/admin/login](http://localhost:3000/admin/login) for the admin panel.

## Deploy to Vercel

### Option A: Vercel Dashboard

1. Push the project to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repository
3. Framework preset: **Next.js** (auto-detected)
4. Add all environment variables from `.env.local.example`
5. Deploy

### Option B: Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow prompts, then add environment variables:

```bash
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
# ... add all variables
vercel --prod
```

### Post-Deployment Checklist

- [ ] All `NEXT_PUBLIC_*` environment variables set in Vercel
- [ ] `NEXT_PUBLIC_SITE_URL` set to your Vercel domain
- [ ] Firebase Auth authorized domains includes your Vercel domain
- [ ] Firestore and Storage rules deployed
- [ ] Admin user created and `NEXT_PUBLIC_ADMIN_UID` configured
- [ ] Test admin login at `/admin/login`
- [ ] Test equipment upload with photos

## Firebase Database Schema

See [firebase/SCHEMA.md](firebase/SCHEMA.md) for full documentation.

### Equipment Collection

| Field | Type | Description |
|-------|------|-------------|
| title | string | Display name |
| brand | string | Manufacturer |
| model | string | Model number |
| price | number | Price in GBP |
| description | string | Full description |
| category | string | Category slug |
| condition | string | excellent/good/fair/refurbished/as-is |
| dimensions | string | Physical dimensions |
| powerSpecs | string | Power requirements |
| photos | string[] | Storage URLs |
| status | string | available/sold |
| dateAdded | timestamp | Auto-set on creation |
| featured | boolean | Show on homepage |

## Admin Usage

1. Navigate to `/admin/login`
2. Sign in with your admin credentials
3. Use the dashboard to view statistics
4. Add equipment via **Add Equipment** — upload photos, set price, category, etc.
5. Mark items as **Sold** from the inventory list
6. Edit or delete items as needed
7. Manage categories under **Categories**

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run seed` | Seed Firestore with sample data |

## License

Private — for commercial use by the business owner.
