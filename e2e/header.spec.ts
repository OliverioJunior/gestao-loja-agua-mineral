import { test, expect } from "@playwright/test";
test.describe("Header Component", () => {
  test.beforeEach(async ({ page }) => {
    // Navegar para a página que contém o Header
    await page.goto("/"); // Ajuste para a rota onde o Header está sendo usado
  });
  test.describe("Mobile Header", () => {
    test("deve exibir o header mobile em telas pequenas", async ({ page }) => {
      // Definir viewport mobile

      await page.setViewportSize({ width: 375, height: 667 });

      // Verificar se o header mobile está visível
      const mobileHeader = page.getByTestId("mobile-button-menu");
      await expect(mobileHeader).toBeVisible();
    });
    test("não deve exibir o header mobile em telas não pequenas", async ({
      page,
    }) => {
      // Definir viewport mobile

      await page.setViewportSize({ width: 1100, height: 800 });

      // Verificar se o header mobile está visível
      const mobileHeader = page.getByTestId("mobile-button-menu");
      await expect(mobileHeader).toBeHidden();
    });
  });
});
