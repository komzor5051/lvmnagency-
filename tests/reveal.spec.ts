import { test, expect } from "@playwright/test";

const PAGE = "/products/consultation";

// Ключевой момент: toBeVisible() в Playwright НЕ считает opacity:0
// невидимостью — он смотрит на bounding box и visibility. На сломанной
// странице toBeVisible прошёл бы и дал ложную зелень. Поэтому проверяем
// вычисленную opacity обёртки, которая несёт data-studio-reveal.
async function revealOpacity(page: import("@playwright/test").Page) {
  return page.locator("[data-studio-reveal]").first().evaluate(
    (el) => getComputedStyle(el as HTMLElement).opacity
  );
}

test.describe("отрисовка без клиентского JS", () => {
  test.use({ javaScriptEnabled: false });

  test("контент страницы консультации виден при отключённом JS", async ({ page }) => {
    await page.goto(PAGE);
    await expect(page.locator("h1")).toHaveText(/\S/);
    expect(await revealOpacity(page)).toBe("1");
  });
});
