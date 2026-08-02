import { test, expect } from '@playwright/test';

test.describe('Write Markdown → Preview', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('markdown escrito se renderiza correctamente en el preview', async ({ page }) => {
    const editor = page.locator('#editor');
    await editor.fill('# Mi Título\n**negrita** y *cursiva*');

    await page.click('#toggleViewBtn');

    const preview = page.locator('#previewPanel');
    await expect(preview).toBeVisible();
    await expect(preview.locator('h1')).toContainText('Mi Título');
    await expect(preview.locator('strong')).toContainText('negrita');
    await expect(preview.locator('em')).toContainText('cursiva');
  });

  test('heading levels H1, H2 y H3 se renderizan en el preview', async ({ page }) => {
    await page.locator('#editor').fill('# H1\n## H2\n### H3');
    await page.click('#toggleViewBtn');

    const preview = page.locator('#previewPanel');
    await expect(preview.locator('h1')).toContainText('H1');
    await expect(preview.locator('h2')).toContainText('H2');
    await expect(preview.locator('h3')).toContainText('H3');
  });

  test('un link en markdown se renderiza como elemento anchor en el preview', async ({ page }) => {
    await page.locator('#editor').fill('[Visitar](https://example.com)');
    await page.click('#toggleViewBtn');

    const link = page.locator('#previewPanel a');
    await expect(link).toContainText('Visitar');
    await expect(link).toHaveAttribute('href', 'https://example.com');
  });
});
