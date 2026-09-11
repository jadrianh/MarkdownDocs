import { test, expect } from '@playwright/test';

test.describe('Toolbar Responsive Layout', () => {
  const viewports = [1440, 1280, 1024, 900, 768, 480];

  for (const width of viewports) {
    test(`Toolbar does not overflow horizontally at ${width}px viewport`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const toolbar = page.locator('[data-purpose="editor-section"] > div').first();
      await expect(toolbar).toBeVisible();

      const info = await toolbar.evaluate((tb) => ({
        clientWidth: tb.clientWidth,
        scrollWidth: tb.scrollWidth,
        hasHScroll: tb.scrollWidth > tb.clientWidth,
      }));

      console.log(`Viewport ${width}px: client=${info.clientWidth}, scroll=${info.scrollWidth}, hasHScroll=${info.hasHScroll}`);
      expect(info.hasHScroll).toBe(false);
    });
  }

  test('Shows dropdown menu for secondary actions when container is compact', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 800 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Botón de más acciones visible en anchos compactos
    const moreActionsBtn = page.locator('#btnMoreActions');
    await expect(moreActionsBtn).toBeVisible();

    // Al hacer clic se despliegan las acciones
    await moreActionsBtn.click();
    const menuMoreActions = page.locator('#menuMoreActions');
    await expect(menuMoreActions).toBeVisible();

    // Verificar que los botones de Deshacer, Rehacer, Copiar y Limpiar están disponibles
    await expect(menuMoreActions.locator('[data-action="undo"]')).toBeVisible();
    await expect(menuMoreActions.locator('[data-action="redo"]')).toBeVisible();
    await expect(menuMoreActions.locator('[data-action="copy"]')).toBeVisible();
    await expect(menuMoreActions.locator('[data-action="clear"]')).toBeVisible();
  });
});
