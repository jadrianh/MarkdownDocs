import { test, expect } from '@playwright/test';

test.describe('Toolbar Formatting → Preview Output', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('bold aplicado a selección aparece como <strong> en preview', async ({ page }) => {
    const editor = page.locator('#editor');
    await editor.fill('texto de prueba');
    await editor.selectText();
    await page.click('#btnBold');

    await page.click('#toggleViewBtn');
    await expect(page.locator('#previewPanel strong')).toBeVisible();
    await expect(page.locator('#previewPanel strong')).toContainText('texto de prueba');
  });

  test('italic aplicado a selección aparece como <em> en preview', async ({ page }) => {
    const editor = page.locator('#editor');
    await editor.fill('texto cursivo');
    await editor.selectText();
    await page.click('#btnItalic');

    await page.click('#toggleViewBtn');
    await expect(page.locator('#previewPanel em')).toBeVisible();
    await expect(page.locator('#previewPanel em')).toContainText('texto cursivo');
  });

  test('lista de viñetas aparece como <li> en preview', async ({ page }) => {
    const editor = page.locator('#editor');
    await editor.fill('primer ítem\nsegundo ítem');
    await editor.selectText();
    await page.click('#btnListUl');

    await page.click('#toggleViewBtn');
    const items = page.locator('#previewPanel li');
    await expect(items).toHaveCount(2);
  });
});
