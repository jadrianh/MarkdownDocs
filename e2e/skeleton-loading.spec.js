import { test, expect } from '@playwright/test';

test.describe('Skeleton & Shimmer Loading Placeholders', () => {
  test('Renders skeleton shimmer elements on raw HTML before script hydration', async ({ page }) => {
    // Interceptar la carga de scripts para inspeccionar el DOM estático inicial de index.html
    await page.route('**/src/core/main.js', (route) => {
      return route.abort();
    });

    await page.goto('/');

    // Verificar que el header posee los placeholders shimmer
    const headerRoot = page.locator('#app-header-root');
    await expect(headerRoot).toBeVisible();
    await expect(headerRoot).toHaveAttribute('aria-busy', 'true');

    const headerShimmers = headerRoot.locator('.skeleton-shimmer');
    const headerCount = await headerShimmers.count();
    expect(headerCount).toBeGreaterThanOrEqual(4);

    // Verificar que el workspace posee placeholders de toolbar, editor y sidebar
    const workspaceRoot = page.locator('#app-workspace-root');
    await expect(workspaceRoot).toBeVisible();
    await expect(workspaceRoot).toHaveAttribute('aria-busy', 'true');

    const workspaceShimmers = workspaceRoot.locator('.skeleton-shimmer');
    const workspaceCount = await workspaceShimmers.count();
    expect(workspaceCount).toBeGreaterThanOrEqual(10);
  });

  test('Smoothly transitions from skeleton to live interactive components', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Una vez montado por main.js, los componentes reales están activos y accesibles
    const header = page.locator('#app-header-root');
    await expect(header).toBeVisible();
    await expect(header).not.toHaveAttribute('aria-busy', 'true');
    await expect(page.locator('#importMdBtn')).toBeVisible();
    await expect(page.locator('#analyzeBtn')).toBeVisible();

    const editor = page.locator('#editor');
    await expect(editor).toBeVisible();

    const wordCount = page.locator('#wordCount');
    await expect(wordCount).toBeVisible();

    const sidebar = page.locator('#suggestionsSidebar');
    await expect(sidebar).toBeVisible();
  });

  test('Renders suggestions shimmer skeleton when text analysis is in progress', async ({ page }) => {
    let routePromiseResolve;
    const routePromise = new Promise((resolve) => {
      routePromiseResolve = resolve;
    });

    await page.route('https://api.languagetool.org/**', async (route) => {
      await routePromise;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ matches: [] })
      });
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const editor = page.locator('#editor');
    await editor.fill('Texto de prueba para verificar el esqueleto de carga');

    const analyzeBtn = page.locator('#analyzeBtn');
    await analyzeBtn.click();

    // El panel de resultados debe mostrar los skeleton shimmer de sugerencias
    const resultsPanel = page.locator('#resultsPanel');
    await expect(resultsPanel.locator('.skeleton-shimmer').first()).toBeVisible();
    await expect(resultsPanel.locator('[aria-busy="true"]')).toBeVisible();

    // Resolver la llamada de red para concluir limpiamente
    routePromiseResolve();
    await page.waitForTimeout(100);
    await page.unrouteAll({ behavior: 'ignoreErrors' });
  });
});
