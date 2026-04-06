#!/bin/bash
set -e

echo "========================================"
echo "Phase 3 Auto-Installation Script"
echo "Performance Optimization"
echo "========================================"
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found. Run from project root.${NC}"
    exit 1
fi

echo -e "${YELLOW}Phase 3 Note:${NC}"
echo "This phase requires manual implementation for optimal results."
echo "The following optimizations are recommended:"
echo ""
echo "1. Query Caching - Add to Convex queries"
echo "2. Admin Pagination - Add pagination UI and cursor-based queries"
echo "3. Image Optimization - Use next/image"
echo "4. Dynamic Imports - Lazy load modals"
echo "5. Rate Limiting - Add to upload endpoint"
echo ""
echo -e "${YELLOW}Creating performance optimization templates...${NC}"

# Create a performance optimization guide
cat > PERFORMANCE_OPTIMIZATIONS.md << 'EOF'
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
EOF

echo -e "${GREEN}✓ Created PERFORMANCE_OPTIMIZATIONS.md${NC}"
echo ""

# Quick wins - add next/image domains if not present
if [ -f "next.config.js" ]; then
    echo -e "${YELLOW}Checking next.config.js for image domains...${NC}"
    
    if ! grep -q "domains" next.config.js; then
        echo "Adding image domains to next.config.js..."
        
        node << 'NODE_SCRIPT'
const fs = require('fs');
const path = 'next.config.js';
let content = fs.readFileSync(path, 'utf8');

// Simple addition for basic config
if (content.includes('module.exports')) {
    // Check if it's a simple object
    if (content.match(/module\.exports\s*=\s*\{[^}]*\}/)) {
        content = content.replace(
            /module\.exports\s*=\s*\{/,
            `module.exports = {\n  images: {\n    domains: ['618ukecvpc.ufs.sh'],\n  },`
        );
        fs.writeFileSync(path, content);
        console.log('✓ Added image domains to next.config.js');
    } else {
        console.log('⚠ next.config.js has complex structure - manual update needed');
    }
} else {
    console.log('⚠ Could not find module.exports in next.config.js');
}
NODE_SCRIPT
    else
        echo -e "${GREEN}✓ Image domains already configured${NC}"
    fi
else
    echo -e "${YELLOW}⚠ next.config.js not found${NC}"
fi

echo ""
echo "========================================"
echo -e "${GREEN}Phase 3 Setup Complete!${NC}"
echo "========================================"
echo ""
echo "Phase 3 is primarily manual optimization."
echo "See PERFORMANCE_OPTIMIZATIONS.md for detailed instructions."
echo ""
echo "Quick wins applied:"
echo "- [x] Created optimization guide"
echo "- [x] Updated next.config.js (if applicable)"
echo ""
echo "Manual work needed:"
echo "- [ ] Implement query caching"
echo "- [ ] Add pagination to admin"
echo "- [ ] Convert images to next/Image"
echo "- [ ] Add dynamic imports"
echo "- [ ] Implement rate limiting"
echo ""
