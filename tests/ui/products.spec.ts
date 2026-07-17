import { test, expect } from "@playwright/test";
import { ProductsPage } from "../../src/pages/ProductsPage";
import { ProductDetailPage } from "../../src/pages/ProductDetailPage";
import { DataFactory } from "../../src/utils/DataFactory";

/**
 * Suite de regresión: Catálogo, búsqueda, detalle y filtros de producto.
 * SUT: https://automationexercise.com/
 *
 * Convención de tags:
 *  @regression -> se ejecuta con `npm run test:regression`
 *  @smoke      -> subconjunto crítico para validación rápida
 */
test.describe("Products Catalog @regression", () => {
  test.beforeEach(async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto();
    // await productsPage.expectAllProductsPageVisible();
  });

  test("TC-007 debe mostrar el catálogo completo de productos @smoke", async ({ page }) => {
    const productsPage = new ProductsPage(page);

    const count = await productsPage.getVisibleProductsCount();
    expect(count).toBeGreaterThan(0);

    const names = await productsPage.getVisibleProductNames();
    expect(names.length).toBe(count);
    for (const name of names) {
      expect(name.length).toBeGreaterThan(0);
    }
  });

  test("TC-008 debe buscar un producto y mostrar 'SEARCHED PRODUCTS' @smoke", async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const term = DataFactory.buildValidSearchTerm();
    await productsPage.searchProduct(term);
    await productsPage.searchResultsNotEmpty();
  });

  test("TC-009 debe validar estado vacío al buscar un producto inválido", async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const invalidTerm = DataFactory.buildInvalidSearchTerm();
    await productsPage.searchProduct(invalidTerm);
    await productsPage.expectSearchResultsEmpty();
  });

  test("TC-010 debe mostrar todos los campos del detalle de un producto @smoke", async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const detailPage = new ProductDetailPage(page);
    await productsPage.viewProductByIndex(0);
    await detailPage.expectProductDetailVisible();
    await detailPage.expectAllFieldsPopulated();
    const details = await detailPage.getAllDetails();
    expect(details.name).toBeTruthy();
    expect(details.category).toBeTruthy();
    expect(details.price).toMatch(/Rs\.\s?\d+/);
    expect(details.availability.toLowerCase()).toContain("in stock");
    expect(details.condition).toBeTruthy();
    expect(details.brand).toBeTruthy();
  });

  test.describe("Filtro por categoría", () => {
    const categoryScenarios: {
      category: "Women" | "Men" | "Kids";
      subCategory: string;
    }[] = [
      { category: "Women", subCategory: "Dress" },
      { category: "Men", subCategory: "Tshirts" },
      { category: "Kids", subCategory: "Tops & Shirts" },
    ];

    for (const { category, subCategory } of categoryScenarios) {
      test(`debe filtrar productos por categoría ${category} > ${subCategory}`, async ({
        page,
      }) => {
        const productsPage = new ProductsPage(page);
        await productsPage.filterByCategory(category, subCategory);
        await productsPage.categoryTitleContains(category);
        await productsPage.searchResultsNotEmpty();
      });
    }
  });

  test("TC-011 debe filtrar productos por marca", async ({ page }) => {
    const productsPage = new ProductsPage(page);

    const brands = await productsPage.getAvailableBrands();
    expect(brands.length).toBeGreaterThan(0);

    const brand = brands[0]!;
    await productsPage.filterByBrand(brand);

    await productsPage.brandTitleContains(brand);
    await productsPage.searchResultsNotEmpty();
  });
});
