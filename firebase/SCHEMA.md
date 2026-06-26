# Firebase Database Schema

## Collections

### `equipment`

Each document represents a single piece of used commercial catering equipment.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Display name, e.g. "Rational SCC 101 Combi Oven" |
| `brand` | string | Yes | Manufacturer, e.g. "Rational" |
| `model` | string | Yes | Model number/name |
| `price` | number | Yes | Price in GBP (integer pence not used — whole pounds) |
| `description` | string | Yes | Full item description |
| `category` | string | Yes | One of the category slugs (see below) |
| `condition` | string | Yes | `excellent`, `good`, `fair`, `refurbished`, `as-is` |
| `dimensions` | string | Yes | Physical dimensions, e.g. "850 x 771 x 757 mm" |
| `powerSpecs` | string | Yes | Power requirements, e.g. "3 Phase, 18.9 kW" |
| `photos` | string[] | Yes | Array of Firebase Storage download URLs |
| `status` | string | Yes | `available` or `sold` |
| `dateAdded` | timestamp | Yes | Auto-set on creation |
| `slug` | string | No | URL-friendly identifier |
| `featured` | boolean | No | Show on homepage (default: false) |

#### Category Slugs

- `pizza-ovens`
- `combi-ovens`
- `refrigeration`
- `dishwashers`
- `coffee-machines`
- `fryers`
- `preparation-equipment`
- `mixers`
- `grills`
- `other-equipment`

#### Example Document

```json
{
  "title": "Rational SCC 101 Combi Oven",
  "brand": "Rational",
  "model": "SCC 101",
  "price": 4500,
  "description": "Excellent condition Rational combi oven. Fully serviced, clean and ready to install. Includes 10 tray capacity and self-cleaning function.",
  "category": "combi-ovens",
  "condition": "excellent",
  "dimensions": "850 x 771 x 757 mm (W x D x H)",
  "powerSpecs": "3 Phase, 18.9 kW",
  "photos": [
    "https://firebasestorage.googleapis.com/..."
  ],
  "status": "available",
  "dateAdded": "2025-06-15T10:00:00.000Z",
  "slug": "rational-scc-101-combi-oven",
  "featured": true
}
```

---

### `categories`

Optional dynamic category management (defaults are hardcoded in the app).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Display name |
| `slug` | string | Yes | URL slug matching equipment category values |
| `description` | string | Yes | Short description |
| `order` | number | Yes | Sort order |
| `active` | boolean | Yes | Whether category is visible |

---

## Firebase Storage Structure

```
equipment/
  {equipmentId}/
    {timestamp}-{filename}.jpg
    {timestamp}-{filename}.jpg
```

---

## Firestore Indexes

Create a composite index for category filtering with date sorting:

- Collection: `equipment`
- Fields: `category` (Ascending), `dateAdded` (Descending)

Firebase will prompt you to create this index when first querying by category.

---

## Authentication

- **Method:** Email/Password (Firebase Authentication)
- **Admin access:** Controlled via `NEXT_PUBLIC_ADMIN_UID` environment variable
- Only the user whose UID matches this value can access `/admin/*` routes (except login)

---

## Security Rules Summary

| Resource | Read | Write |
|----------|------|-------|
| `equipment` | Public | Authenticated users |
| `categories` | Public | Authenticated users |
| Storage `equipment/*` | Public | Authenticated users (images only, max 5MB) |

> **Production tip:** Tighten Firestore rules to only allow writes from your admin UID:

```javascript
function isAdmin() {
  return request.auth != null && request.auth.uid == 'YOUR_ADMIN_UID';
}
```
