import { test, expect } from '@playwright/test';

test.describe('Auto-Save & Crash Resilience in LocalStorage', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    // Limpiar localStorage antes de cada prueba para arrancar limpios
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('networkidle');
  });

  test('Auto-saves editor content to localStorage and updates status indicator', async ({ page }) => {
    const editor = page.locator('#editor');
    const saveStatus = page.locator('#saveStatusContainer');
    const saveStatusIcon = page.locator('#saveStatusIcon');

    await expect(saveStatus).toBeVisible();
    await expect(saveStatusIcon).toHaveText('cloud');
    await expect(saveStatusIcon).toHaveClass(/text-zinc-400/);

    // Escribir texto en el editor
    const testText = '# Documento Resiliente\n\nEste texto se autoguarda localmente.';
    await editor.fill(testText);

    // Esperar a que el debounce termine y el icono sea nube verde (cloud_done)
    await expect(saveStatusIcon).toHaveText('cloud_done', { timeout: 3000 });
    await expect(saveStatusIcon).toHaveClass(/text-emerald-500/);

    // Verificar en localStorage directamente
    const savedData = await page.evaluate(() => {
      return localStorage.getItem('markdowndocs_draft_v1');
    });

    expect(savedData).not.toBeNull();
    const parsed = JSON.parse(savedData);
    expect(parsed.content).toBe(testText);
  });

  test('Recovers draft seamlessly after simulated browser restart or crash (page reload)', async ({ page }) => {
    const editor = page.locator('#editor');
    const resilientDoc = '# Nota de Recuperación\n\nSi la luz se corta o se apaga la PC, esto permanece intacto.';
    
    await editor.fill(resilientDoc);
    await expect(page.locator('#saveStatusIcon')).toHaveText('cloud_done', { timeout: 3000 });

    // Simular corte de luz / apagón cerrando la sesión y recargando la página
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Comprobar que el editor recuperó el texto exacto
    await expect(editor).toHaveValue(resilientDoc);

    // Comprobar que los contadores están sincronizados
    await expect(page.locator('#wordCount')).toContainText('PALABRAS');
    await expect(page.locator('#charCount')).toContainText('CARACTERES');

    // Comprobar que el icono muestra nube verde
    await expect(page.locator('#saveStatusIcon')).toHaveText('cloud_done');
    await expect(page.locator('#saveStatusIcon')).toHaveClass(/text-emerald-500/);
  });

  test('Clears draft from localStorage when user explicitly clears the editor', async ({ page }) => {
    const editor = page.locator('#editor');
    await editor.fill('Texto que luego será eliminado.');
    await expect(page.locator('#saveStatusIcon')).toHaveText('cloud_done', { timeout: 3000 });

    // Hacer clic en el botón de limpiar
    const clearBtn = page.locator('#clearBtn');
    await clearBtn.click();

    await expect(editor).toHaveValue('');
    await expect(page.locator('#saveStatusIcon')).toHaveText('cloud');
    await expect(page.locator('#saveStatusIcon')).toHaveClass(/text-zinc-400/);

    // Verificar que localStorage ya no tiene el borrador
    const savedData = await page.evaluate(() => {
      return localStorage.getItem('markdowndocs_draft_v1');
    });
    expect(savedData).toBeNull();

    // Si recargamos, el editor debe continuar limpio sin falsas restauraciones
    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(editor).toHaveValue('');
  });
});
