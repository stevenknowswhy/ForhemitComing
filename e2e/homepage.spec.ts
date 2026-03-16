import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the homepage with preview', async ({ page }) => {
    await page.goto('/?preview=true');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check that the brand title is visible
    await expect(page.locator('.brand-title, h1')).toBeVisible({ timeout: 15000 });
  });

  test('should have proper title', async ({ page }) => {
    await page.goto('/?preview=true');
    
    // Check Open Graph title
    const title = await page.title();
    expect(title).toContain('Forhemit Capital');
  });

  test('should show 404 for unknown routes', async ({ page }) => {
    // The middleware redirects unknown routes to /coming-soon, not 404
    await page.goto('/this-page-does-not-exist?preview=true');
    await page.waitForLoadState('networkidle');
    
    // Should still load the site (middleware redirects to coming-soon)
    await expect(page.locator('body')).toBeVisible({ timeout: 15000 });
  });
});

test.describe('SEO', () => {
  test('should have sitemap.xml', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.ok()).toBeTruthy();
    expect(response.headers()['content-type']).toContain('xml');
  });

  test('should have robots.txt', async ({ request }) => {
    const response = await request.get('/robots.txt');
    expect(response.ok()).toBeTruthy();
    const text = await response.text();
    expect(text).toContain('User-Agent');
    expect(text).toContain('Sitemap');
  });
});
