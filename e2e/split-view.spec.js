import { test, expect } from '@playwright/test';

test.describe('Split View (Vista Dividida) con Renderizado Simultáneo y Botones UtilityTools', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Starts in solo editor mode by default with toggleViewBtn enabled and toggleSplitBtn inactive', async ({ page }) => {
    const editor = page.locator('#editor');
    const preview = page.locator('#previewPanel');
    const splitDivider = page.locator('#splitDivider');
    const toggleViewBtn = page.locator('#toggleViewBtn');
    const toggleSplitBtn = page.locator('#toggleSplitBtn');
    const toggleViewIcon = page.locator('#toggleViewIcon');

    await expect(editor).toBeVisible();
    await expect(preview).toBeHidden();
    await expect(splitDivider).toBeHidden();

    // Botón 1: habilitado para ver preview
    await expect(toggleViewBtn).toBeVisible();
    await expect(toggleViewBtn).toBeEnabled();
    await expect(toggleViewIcon).toHaveText('chrome_reader_mode');

    // Botón 2: inactivo (vista dividida apagada)
    await expect(toggleSplitBtn).toBeVisible();
    await expect(toggleSplitBtn).toHaveAttribute('aria-pressed', 'false');
    await expect(toggleSplitBtn).not.toHaveClass(/text-primary/);
  });

  test('Toggles Split View like toggleSidebarBtn and blocks first button in edit mode', async ({ page }) => {
    const toggleSplitBtn = page.locator('#toggleSplitBtn');
    const toggleViewBtn = page.locator('#toggleViewBtn');
    const toggleViewIcon = page.locator('#toggleViewIcon');
    const editor = page.locator('#editor');
    const preview = page.locator('#previewPanel');
    const splitDivider = page.locator('#splitDivider');
    const previewSplitHeader = page.locator('#previewSplitHeader');

    // 1. Activar Vista Dividida
    await toggleSplitBtn.click();

    // Ambos paneles y divisor visibles
    await expect(editor).toBeVisible();
    await expect(preview).toBeVisible();
    await expect(splitDivider).toBeVisible();
    await expect(previewSplitHeader).toBeVisible();
    await expect(page.locator('#previewLiveBadge')).toContainText('EN VIVO');

    // Botón 2 se activa (como toggleSidebarBtn)
    await expect(toggleSplitBtn).toHaveAttribute('aria-pressed', 'true');
    await expect(toggleSplitBtn).toHaveClass(/text-primary/);

    // Botón 1 se bloquea en modo edición
    await expect(toggleViewBtn).toBeDisabled();
    await expect(toggleViewBtn).toHaveAttribute('aria-disabled', 'true');
    await expect(toggleViewIcon).toHaveText('edit_note');

    // 2. Desactivar Vista Dividida (regresar a vista completa)
    await toggleSplitBtn.click();

    await expect(editor).toBeVisible();
    await expect(preview).toBeHidden();
    await expect(splitDivider).toBeHidden();

    // Botón 2 vuelve a estado inactivo
    await expect(toggleSplitBtn).toHaveAttribute('aria-pressed', 'false');
    await expect(toggleSplitBtn).not.toHaveClass(/text-primary/);

    // Botón 1 se desbloquea
    await expect(toggleViewBtn).toBeEnabled();
    await expect(toggleViewBtn).not.toHaveAttribute('aria-disabled', 'true');
    await expect(toggleViewIcon).toHaveText('chrome_reader_mode');
  });

  test('Renders content simultaneously in real-time in Split View', async ({ page }) => {
    const toggleSplitBtn = page.locator('#toggleSplitBtn');
    const editor = page.locator('#editor');
    const preview = page.locator('#previewPanel');

    // Activar vista dividida
    await toggleSplitBtn.click();
    await expect(preview).toBeVisible();

    // Escribir en el editor y verificar renderizado simultáneo en tiempo real
    await editor.fill('# Título en Tiempo Real\n\nEste párrafo contiene **negrita en vivo** y *cursiva*.');

    // La vista previa debe reflejar el HTML de inmediato
    await expect(preview.locator('h1')).toHaveText('Título en Tiempo Real');
    await expect(preview.locator('strong')).toHaveText('negrita en vivo');
    await expect(preview.locator('em')).toHaveText('cursiva');
  });

  test('First button toggles between solo preview and solo editor when not in split view', async ({ page }) => {
    const editor = page.locator('#editor');
    const preview = page.locator('#previewPanel');
    const toggleViewBtn = page.locator('#toggleViewBtn');
    const toggleViewIcon = page.locator('#toggleViewIcon');

    // 1. Clic para ir a Vista Previa
    await toggleViewBtn.click();
    await expect(editor).toBeHidden();
    await expect(preview).toBeVisible();
    await expect(toggleViewBtn).toHaveClass(/text-primary/);
    await expect(toggleViewIcon).toHaveText('edit_note');

    // 2. Clic para volver a Editor
    await toggleViewBtn.click();
    await expect(editor).toBeVisible();
    await expect(preview).toBeHidden();
    await expect(toggleViewBtn).not.toHaveClass(/text-primary/);
    await expect(toggleViewIcon).toHaveText('chrome_reader_mode');
  });

  test('Supports keyboard shortcuts for view switching (Ctrl+Alt+S, Ctrl+Alt+P, Ctrl+Alt+E)', async ({ page }) => {
    const editor = page.locator('#editor');
    const preview = page.locator('#previewPanel');
    const toggleSplitBtn = page.locator('#toggleSplitBtn');
    const toggleViewBtn = page.locator('#toggleViewBtn');

    // Enfocar editor
    await editor.focus();

    // Ctrl+Alt+S -> Alterna a Vista Dividida
    await page.keyboard.press('Control+Alt+s');
    await expect(editor).toBeVisible();
    await expect(preview).toBeVisible();
    await expect(toggleSplitBtn).toHaveAttribute('aria-pressed', 'true');
    await expect(toggleViewBtn).toBeDisabled();

    // Ctrl+Alt+S de nuevo -> Regresa a Solo Editor
    await page.keyboard.press('Control+Alt+s');
    await expect(editor).toBeVisible();
    await expect(preview).toBeHidden();
    await expect(toggleSplitBtn).toHaveAttribute('aria-pressed', 'false');
    await expect(toggleViewBtn).toBeEnabled();

    // Ctrl+Alt+P -> Alterna a Solo Vista Previa
    await page.keyboard.press('Control+Alt+p');
    await expect(editor).toBeHidden();
    await expect(preview).toBeVisible();

    // Ctrl+Alt+E -> Regresa a Solo Editor
    await page.keyboard.press('Control+Alt+e');
    await expect(editor).toBeVisible();
    await expect(preview).toBeHidden();
  });
});
