import { test, expect } from '@playwright/test';

test.describe('Preferences Modal with Sidebar Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Opens modal and verifies sidebar tabs and initial appearance page', async ({ page }) => {
    const settingsBtn = page.locator('#themeSettingsBtn');
    await settingsBtn.click();

    const modal = page.locator('#themeModal');
    await expect(modal).toBeVisible();

    // Verify left sidebar navigation exists
    const sidebar = modal.locator('#preferencesSidebar');
    await expect(sidebar).toBeVisible();

    // Verify all 4 tabs exist
    await expect(sidebar.locator('button[data-page-id="appearance"]')).toBeVisible();
    await expect(sidebar.locator('button[data-page-id="typography"]')).toBeVisible();
    await expect(sidebar.locator('button[data-page-id="markdown"]')).toBeVisible();
    await expect(sidebar.locator('button[data-page-id="about"]')).toBeVisible();

    // Verify initial active tab is appearance
    const appearanceTab = sidebar.locator('button[data-page-id="appearance"]');
    await expect(appearanceTab).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#preferencesCurrentPageLabel')).toHaveText('Apariencia');

    // Verify appearance panels are visible
    const appearancePanel = modal.locator('#pref-page-appearance');
    await expect(appearancePanel).toBeVisible();
    await expect(appearancePanel.locator('.theme-option-btn[data-mode="dark"]')).toBeVisible();
  });

  test('Navigates between sidebar pages smoothly', async ({ page }) => {
    const settingsBtn = page.locator('#themeSettingsBtn');
    await settingsBtn.click();

    const modal = page.locator('#themeModal');
    await expect(modal).toBeVisible();

    // Click on Typography tab
    const typoTab = modal.locator('button[data-page-id="typography"]');
    await typoTab.click();

    await expect(typoTab).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#preferencesCurrentPageLabel')).toHaveText('Tipografía');

    const typoPanel = modal.locator('#pref-page-typography');
    await expect(typoPanel).toBeVisible();
    await expect(typoPanel.locator('#editorFontFamily')).toBeVisible();
    await expect(typoPanel.locator('#editorFontSize')).toBeVisible();

    // Appearance panel should be hidden
    await expect(modal.locator('#pref-page-appearance')).toBeHidden();

    // Click on About tab
    const aboutTab = modal.locator('button[data-page-id="about"]');
    await aboutTab.click();

    await expect(aboutTab).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#preferencesCurrentPageLabel')).toHaveText('Acerca de');
    await expect(modal.locator('#pref-page-about')).toBeVisible();
    await expect(modal.locator('#pref-page-about')).toContainText('Atajos de Teclado Esenciales');

    // Close modal
    const closeBtn = modal.locator('#closeThemeModal');
    await closeBtn.click();
    await expect(modal).toBeHidden();
  });

  test('Switches theme mode and accent color from Appearance page', async ({ page }) => {
    const settingsBtn = page.locator('#themeSettingsBtn');
    await settingsBtn.click();

    const modal = page.locator('#themeModal');
    await expect(modal).toBeVisible();

    // Click Dark theme
    const darkBtn = modal.locator('.theme-option-btn[data-mode="dark"]');
    await darkBtn.click();
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Click Black OLED theme
    const blackBtn = modal.locator('.theme-option-btn[data-mode="black"]');
    await blackBtn.click();
    await expect(page.locator('html')).toHaveClass(/black-mode/);

    // Click Emerald accent color
    const emeraldColorBtn = modal.locator('.color-btn[data-color="16 185 129"]');
    await emeraldColorBtn.click();
    await expect(emeraldColorBtn).toHaveClass(/active/);
  });

  test('Active tab retains primary accent color on hover while inactive tab updates color', async ({ page }) => {
    const settingsBtn = page.locator('#themeSettingsBtn');
    await settingsBtn.click();

    const modal = page.locator('#themeModal');
    await expect(modal).toBeVisible();

    const activeTab = modal.locator('button[data-page-id="appearance"]');
    const inactiveTab = modal.locator('button[data-page-id="typography"]');

    const activeLabel = activeTab.locator('span.truncate');
    const inactiveLabel = inactiveTab.locator('span.truncate');

    // Get initial active color (theme primary)
    const initialActiveColor = await activeLabel.evaluate(el => window.getComputedStyle(el).color);

    // Hover over active tab - color must remain identical (primary accent)
    await activeTab.hover();
    await expect(activeLabel).toHaveCSS('color', initialActiveColor);

    // Hover over inactive tab - color should transition to zinc-900 (rgb(24, 24, 27))
    await inactiveTab.hover();
    await expect(inactiveLabel).toHaveCSS('color', 'rgb(24, 24, 27)');
  });
});
