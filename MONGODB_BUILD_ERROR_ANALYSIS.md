# MongoDB Build Error Analysis - CareNet360

## Error Summary
- **Error Code**: MIDDLEWARE_INVOCATION_FAILED  
- **Error**: `querySrv ENOTFOUND _mongodb._tcp.cluster0.evvzodo.mongodb.net`  
- **When**: During Vercel build process
- **Root Cause**: MongoDB connection being attempted during build time when it should only happen at runtime

---

## Root Cause Analysis

### 1. **Primary Issue: Module-Level Export**
In `lib/mongodb.ts`:
```typescript
export default clientPromise
```

The `clientPromise` is exported as the default export at the module level. While lazy-loaded correctly inside `getDatabase()`, the issue is:
- When lib/mongodb.ts is imported anywhere, Node.js evaluates the module
- Although the connection is lazy (inside getDatabase), having this export at module level can cause issues with build tools/Vercel's analyzer

### 2. **Secondary Issue: Environment Variable at Build Time**
Line 3 in lib/mongodb.ts:
```typescript
const uri = process.env.MONGODB_URI || ""
```
- During Vercel build, environment variables are available
- If any code path accidentally calls getDatabase() at module import time or during build analysis, it will try to connect

### 3. **Why Middleware Shows as Failed**
- Vercel evaluates middleware.ts during build to extract the matcher config
- When files/modules are being analyzed, if any imported module tries to establish a MongoDB connection, it fails
- The middleware itself is innocent, but its import chain might trigger the issue

---

## Files Importing MongoDB (Analyzed)

### API Routes (These are CORRECT - use lazy loading):
All 20+ API routes import correctly:
```typescript
import { getDatabase } from "@/lib/mongodb"
```
And call it inside async handlers:
```typescript
const db = await getDatabase()
```

### Type-Only Imports (No Issue):
- `lib/types.ts`: `import type { ObjectId } from "mongodb"`  
- Multiple API routes use: `import type { User } from "@/lib/types"`

### Problematic Pattern:
The issue is the **default export** that should not exist:
```typescript
// lib/mongodb.ts (line 42)
export default clientPromise  // ← This is unnecessary and causes issues
```

---

## Detailed Recommendations

### 1. **REMOVE the Default Export** (Primary Fix)
Remove line 42 from `lib/mongodb.ts`:
```typescript
// DELETE THIS LINE:
export default clientPromise
```

**Why**: This default export offers no value since:
- No files import it (verified via codebase search)
- All code uses `getDatabase()` named export
- Exporting a module-level variable can trigger connection attempts

### 2. **Add Null Checks in getDatabase()** (Defensive)
Ensure the function handles missing MONGODB_URI gracefully during build:
```typescript
export async function getDatabase(): Promise<Db | null> {
  if (!uri) {
    console.warn("MONGODB_URI not configured")
    return null
  }
  // ... rest of function
}
```
**Status**: Already implemented ✓

### 3. **Add Explicit Error Handling**
Wrap the connection attempt to prevent throwing during build:
```typescript
try {
  if (process.env.NODE_ENV === "development") {
    // ... development logic
  } else {
    // ... production logic
  }
} catch (error) {
  console.error("MongoDB connection error:", error)
  return null  // Return null instead of throwing
}
```
**Status**: Already implemented ✓

### 4. **Use Conditional Build Skipping** (Optional Enhancement)
Add this to `next.config.mjs` to prevent API route evaluation:
```javascript
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  // Prevent API preload during build
  experimental: {
    serverComponentsExternalPackages: ["mongodb"],
  },
}
```

### 5. **Add server-only Marker** (Best Practice)
Add this at the top of `lib/mongodb.ts`:
```typescript
import "server-only"
```
This prevents accidental client-side imports.

---

## Implementation Steps

### Step 1: Fix lib/mongodb.ts
1. Remove the default export (line 42)
2. Add "server-only" import at the top
3. Ensure proper error handling

### Step 2: Update Environment Configuration
Ensure Vercel has:
- `MONGODB_URI` environment variable set
- `NODE_ENV=production` during build (should be automatic)

### Step 3: Update next.config.mjs
Add the experimental configuration to prevent edge cases.

### Step 4: Verify API Route Structure
All API routes should:
- ✓ Import `getDatabase` (named export)
- ✓ Call it inside async route handlers (GET, POST, etc.)
- ✓ Never call database code at module level
- ✓ Properly await the connection

---

## Files That Need Changes

1. **[lib/mongodb.ts](lib/mongodb.ts)** - PRIMARY FIX
   - Remove default export
   - Add "server-only" import
   
2. **[next.config.mjs](next.config.mjs)** - OPTIONAL BUT RECOMMENDED
   - Add experimental config to prevent API preload

---

## Quick Checklist

- [ ] Remove `export default clientPromise` from lib/mongodb.ts
- [ ] Add `import "server-only"` to lib/mongodb.ts
- [ ] Add experimental config to next.config.mjs
- [ ] Run `npm run build` locally to verify
- [ ] Redeploy to Vercel
- [ ] Check build logs for MongoDB connection errors

---

## Expected Outcome

After these changes:
1. Build will no longer attempt MongoDB connection
2. API routes will still work normally (getDatabase() called at runtime)
3. Middleware will work correctly
4. Vercel deployment will succeed

