import { test, expect } from '@playwright/test';

test.describe('Undo / Redo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('undo (botón) revierte el bold tras el debounce del historial', async ({ page }) => {
    const editor = page.locator('#editor');

    await editor.fill('contenido original');
    await page.waitForTimeout(1200);

    await editor.selectText();
    await page.click('#btnBold');
    await expect(editor).toHaveValue('**contenido original**');
    await page.waitForTimeout(1200);

    await page.click('#undoBtn');
    await expect(editor).toHaveValue('contenido original');

    await page.click('#toggleViewBtn');
    await expect(page.locator('#previewPanel strong')).toHaveCount(0);
  });

  test('undo y redo (botones) restauran el estado en textarea y preview', async ({ page }) => {
    const editor = page.locator('#editor');

    await editor.fill('texto base');
    await page.waitForTimeout(1200);

    await editor.selectText();
    await page.click('#btnItalic');
    await expect(editor).toHaveValue('*texto base*');
    await page.waitForTimeout(1200);

    await page.click('#undoBtn');
    await expect(editor).toHaveValue('texto base');

    await page.click('#toggleViewBtn');
    await expect(page.locator('#previewPanel em')).toHaveCount(0);

    await page.click('#toggleViewBtn');
    await page.click('#redoBtn');
    await expect(editor).toHaveValue('*texto base*');

    await page.click('#toggleViewBtn');
    await expect(page.locator('#previewPanel em')).toBeVisible();
  });
});



