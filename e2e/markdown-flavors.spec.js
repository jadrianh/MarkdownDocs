import { test, expect } from '@playwright/test';

test.describe('Markdown Flavors Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Switches markdown flavors via toolbar dropdown', async ({ page }) => {
    const flavorBtn = page.locator('#btnMarkdownFlavor');
    await expect(flavorBtn).toBeVisible();

    // Estado inicial: GFM
    await expect(page.locator('#currentFlavorText')).toHaveText('GFM');

    // Desplegar menú de dialectos
    await flavorBtn.click();
    const menu = page.locator('#menuMarkdownFlavor');
    await expect(menu).toBeVisible();

    // Seleccionar Académico (LaTeX)
    const academicOption = menu.locator('[data-flavor="academic"]');
    await academicOption.click();

    // Verificar que el indicador cambió a ACAD
    await expect(page.locator('#currentFlavorText')).toHaveText('ACAD');

    // Cambiar a vista previa para comprobar renderizado
    const editor = page.locator('#editor');
    await editor.fill('Ecuación: $E=mc^2$\n\nNota importante[^1]\n\n[^1]: Explicación al pie.');

    const toggleViewBtn = page.locator('#toggleViewBtn');
    await toggleViewBtn.click();

    const preview = page.locator('#previewPanel');
    await expect(preview).toBeVisible();

    // Verificar KaTeX y notas al pie en modo académico
    await expect(preview.locator('.katex')).toBeVisible();
    await expect(preview.locator('.footnotes')).toBeVisible();
    await expect(preview.locator('.footnote-ref')).toBeVisible();
  });

  test('Switches markdown flavors via Preferences Modal and keeps toolbar in sync', async ({ page }) => {
    // Abrir modal de preferencias
    const settingsBtn = page.locator('#themeSettingsBtn');
    await settingsBtn.click();

    const modal = page.locator('#themeModal');
    await expect(modal).toBeVisible();

    // Navegar a la pestaña de Markdown en la barra lateral
    const markdownTab = modal.locator('button[data-page-id="markdown"]');
    await markdownTab.click();

    // Seleccionar tarjeta CommonMark
    const commonmarkCard = modal.locator('.flavor-option-btn[data-flavor="commonmark"]');
    await commonmarkCard.click();

    // Verificar que la tarjeta se marca como activa
    await expect(commonmarkCard).toHaveClass(/active/);

    // Cerrar modal con botón de cerrar
    const closeBtn = page.locator('#closeThemeModal');
    await closeBtn.click();

    // Verificar que el botón de la barra de herramientas se sincronizó a STD
    await expect(page.locator('#currentFlavorText')).toHaveText('STD');
  });

  test('Renders official 1:1 GitHub alerts with Octicon SVG and proper structure', async ({ page }) => {
    const editor = page.locator('#editor');
    await editor.fill(`
> [!NOTE]
> Esta es una nota oficial con estilo GitHub.

> [!WARNING]
> Advertencia crítica con icono oficial de GitHub.
`);

    const toggleViewBtn = page.locator('#toggleViewBtn');
    await toggleViewBtn.click();

    const preview = page.locator('#previewPanel');
    await expect(preview).toBeVisible();

    const noteAlert = preview.locator('.markdown-alert.markdown-alert-note');
    await expect(noteAlert).toBeVisible();
    await expect(noteAlert.locator('.markdown-alert-title')).toContainText('Note');
    await expect(noteAlert.locator('.octicon-info')).toBeVisible();

    const warningAlert = preview.locator('.markdown-alert.markdown-alert-warning');
    await expect(warningAlert).toBeVisible();
    await expect(warningAlert.locator('.markdown-alert-title')).toContainText('Warning');
    await expect(warningAlert.locator('.octicon-alert')).toBeVisible();
  });
});
