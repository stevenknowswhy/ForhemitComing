# Phase 3 Performance Optimizations

## 1. Query Caching for Stats

### File: `convex/jobApplications.ts`

Add caching to the getStats query:

```typescript
// Add at the top of the file
const statsCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 60 * 1000; // 1 minute

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const cacheKey = "jobStats";
    const cached = statsCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }
    
    const allApplications = await ctx.db.query("jobApplications").collect();
    
    const stats = {
      total: allApplications.length,
      byStatus: { /* ... */ },
      byPosition: { /* ... */ },
    };
    
    statsCache.set(cacheKey, { data: stats, timestamp: Date.now() });
    return stats;
  },
});
```

## 2. Admin Pagination

### File: `convex/jobApplications.ts`

Add cursor-based pagination:

```typescript
export const listPaginated = query({
  args: {
    cursor: v.optional(v.string()),
    limit: v.optional(v.number()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 25;
    
    let query = ctx.db.query("jobApplications");
    
    if (args.status) {
      query = query.withIndex("by_status", q => q.eq("status", args.status));
    }
    
    // Get one extra to check if there's a next page
    const results = await query.take(limit + 1);
    const hasMore = results.length > limit;
    const items = hasMore ? results.slice(0, -1) : results;
    
    return {
      items,
      nextCursor: hasMore ? items[items.length - 1]._id : null,
    };
  },
});
```

## 3. Image Optimization

Replace external `<img>` tags with `next/image`:

```typescript
import Image from "next/image";

// Instead of:
<img src="https://..." alt="..." />

// Use:
<Image
  src="https://..."
  alt="..."
  width={600}
  height={400}
  loading="lazy"
/>
```

Add to `next.config.js`:

```javascript
module.exports = {
  images: {
    domains: ['618ukecvpc.ufs.sh'],
  },
}
```

## 4. Dynamic Imports

Lazy load heavy components:

```typescript
import dynamic from "next/dynamic";

const ContactModal = dynamic(
  () => import("./components/modals/ContactModal"),
  { loading: () => <div>Loading...</div> }
);
```

## 5. Rate Limiting

Add rate limiting to upload endpoint via middleware or Vercel config.
