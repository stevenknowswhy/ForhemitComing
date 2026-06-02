const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
	// Allow `@/convex/_generated/*` → `packages/convex/convex/_generated` (outside this app).
	experimental: {
		externalDir: true,
	},
	// Increase max header size — Clerk cookies can exceed the default 16KB limit
	httpAgentOptions: {
		maxHeaderSize: 32768,
	},
	// Lockfile in a parent directory (e.g. ~/package-lock.json) makes Next pick the wrong root;
	// without this, dev may never listen / Turbopack resolves the wrong tree.
	turbopack: {
		// Monorepo root so Turbopack resolves `next` and allows `packages/convex` via externalDir.
		root: path.resolve(__dirname, "../.."),
	},
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images.unsplash.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "618ukecvpc.ufs.sh",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "img.clerk.com",
				pathname: "/**",
			},
		],
		formats: ["image/avif", "image/webp"],
	},
	async headers() {
		return [
			// Embed routes: allow Box to iframe these pages
			{
				source: "/embed/:path*",
				headers: [
					{
						key: "Content-Security-Policy",
						value: [
							"default-src 'self'",
							"script-src 'self' 'unsafe-eval' 'unsafe-inline'",
							"style-src 'self' 'unsafe-inline'",
							"font-src 'self'",
							"img-src 'self' data:",
							"connect-src 'self' https://api.convex.dev https://striped-puma-587.convex.cloud wss://striped-puma-587.convex.cloud",
							"frame-ancestors https://*.box.com https://app.box.com",
						].join("; "),
					},
					{
						key: "X-Frame-Options",
						value: "ALLOW-FROM https://app.box.com",
					},
				],
			},
			{
				source: "/(.*)",
				headers: [
					{
						key: "Content-Security-Policy",
						value: [
							"default-src 'self'",
							"script-src 'self' 'unsafe-eval' 'unsafe-inline' blob: https://js.stripe.com https://uploadthing.com https://cdn.jsdelivr.net https://clerk.forhemit.website https://*.clerk.accounts.dev",
							"worker-src 'self' blob:",
							"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
							"font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net",
							"img-src 'self' data: https: blob: https://img.clerk.com",
							"connect-src 'self' https://api.convex.dev https://uploadthing.com wss://uploadthing.com https://striped-puma-587.convex.cloud wss://striped-puma-587.convex.cloud https://clerk.forhemit.website https://*.clerk.accounts.dev https://clerk-telemetry.com http://localhost:5173 ws://localhost:5173",
							"frame-src 'self' https://js.stripe.com https://clerk.forhemit.website https://*.clerk.accounts.dev",
							"object-src 'none'",
							"base-uri 'self'",
							"form-action 'self'",
							"frame-ancestors 'none'",
						].join("; "),
					},
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "X-Frame-Options",
						value: "DENY",
					},
					{
						key: "X-XSS-Protection",
						value: "1; mode=block",
					},
					{
						key: "Referrer-Policy",
						value: "strict-origin-when-cross-origin",
					},
					{
						key: "Permissions-Policy",
						value: "camera=(), microphone=(), geolocation=()",
					},
				],
			},
		];
	},
};

module.exports = nextConfig;
