import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Responsabilidades:
 *  - Navegación al catálogo.
 *  - Búsqueda de productos.
 *  - Filtros por categoría y por marca.
 *  - Acceso a las tarjetas de producto individuales.
 */
export class ProductsPage extends BasePage {
  // ---- Header / navegación ----
  private readonly productsNavLink: Locator;
  private readonly pageTitle: (title: string | RegExp) => Locator;

  // ---- Búsqueda ----
  private readonly searchInput: Locator;
  private readonly searchButton: Locator;

  // ---- Catálogo ----
  private readonly productCards: Locator;
  private readonly productCardByName: (name: string) => Locator;
  private readonly viewProductButtonByIndex: (index: number) => Locator;

  // ---- Filtro por categoría (sidebar izquierdo) ----
  private readonly categoryPanel: Locator;
  private readonly categoryHeaderByName: (category: "Women" | "Men" | "Kids") => Locator;

  // ---- Filtro por marca (sidebar izquierdo) ----
  private readonly brandsPanel: Locator;
  private readonly brandLinkByName: (brand: string) => Locator;

  constructor(page: Page) {
    super(page);

    this.productsNavLink = page.locator('a[href="/products"]');
    this.pageTitle = (title) => page.getByRole('heading', { level: 2, name: title });

    this.searchInput = page.locator("#search_product");
    this.searchButton = page.locator("#submit_search");

    this.productCards = page.locator(".features_items .product-image-wrapper");
    this.productCardByName = (name: string) =>
      this.productCards.filter({ hasText: name });
    this.viewProductButtonByIndex = (index: number) =>
      this.productCards.nth(index).locator('a:has-text("View Product")');

    this.categoryPanel = page.locator("#accordian");
    this.categoryHeaderByName = (category) =>
      this.categoryPanel.locator(`a[href="#${category}"]`);

    this.brandsPanel = page.locator(".brands_products");
    this.brandLinkByName = (brand: string) =>
      this.brandsPanel.locator("a", { hasText: brand });
  }

  /** Navega directamente a /products. */
  async goto() {
    await this.navigate("/products");
    await expect(this.pageTitle(/All Products/i)).toHaveText(/All Products/i);
  }

  /** Cantidad de productos visibles actualmente en el catálogo. */
  async getVisibleProductsCount(): Promise<number> {
    return this.productCards.count();
  }

  /** Devuelve los nombres de todos los productos visibles (para validar catálogo/paginado). */
  async getVisibleProductNames(): Promise<string[]> {
    const names = await this.productCards.locator(".productinfo p").allTextContents();
    return names.map((n) => n.trim());
  }

  /** Ejecuta una búsqueda de producto por nombre. */
  async searchProduct(productName: string) {
    await this.searchInput.fill(productName);
    await this.searchButton.click();
    await expect(this.pageTitle(/SEARCHED PRODUCTS/i)).toBeVisible();
  }

  /** Verifica que exista al menos un resultado tras la búsqueda. */
  async searchResultsNotEmpty() {
    await expect(this.productCards.first()).toBeVisible();
    const count = await this.getVisibleProductsCount();
    expect(count).toBeGreaterThan(0);
  }

  /** Verifica estado vacío (0 resultados) para búsquedas inválidas. */
  async expectSearchResultsEmpty() {
    await expect(this.productCards).toHaveCount(0);
  }

  /** Verifica que todos los productos visibles contengan el término buscado. */
  async allResultsContain(term: string) {
    const names = await this.getVisibleProductNames();
    for (const name of names) {
      expect(name.toLowerCase()).toContain(term.toLowerCase());
    }
  }

  /** Click en "View Product" para el índice indicado (default: primero). */
  async viewProductByIndex(index = 0) {
    await this.viewProductButtonByIndex(index).click();
    await this.waitForPageLoad();
  }

  /** Click en "View Product" para un producto identificado por nombre. */
  async viewProductByName(name: string) {
    await this.productCardByName(name)
      .locator('a:has-text("View Product")')
      .click();
    await this.waitForPageLoad();
  }

  // ---------------- Filtro por categoría ----------------

  /**
   * Expande una categoría (Women, Men, Kids) en el sidebar y hace click
   * en una subcategoría específica (ej. "Dress", "Tshirts", "Jeans").
   */
  async filterByCategory(category: "Women" | "Men" | "Kids", subCategory: string) {
    await this.categoryHeaderByName(category).click();
    await this.categoryPanel
      .locator(`#${category} a`, { hasText: subCategory })
      .click();
          await expect(this.pageTitle(new RegExp(subCategory, 'i'))).toBeVisible();

    // await expect(this.pageTitle(new RegExp(subCategory, 'i'))).toContainText(subCategory, { ignoreCase: true });
  }

  /** Verifica el título de categoría (ej. "WOMEN - DRESS PRODUCTS"). */
  async categoryTitleContains(text: string) {
    await expect(this.pageTitle(new RegExp(text))).toBeVisible()
  }

  // ---------------- Filtro por marca ----------------

  /** Click en una marca específica del sidebar de marcas. */
  async filterByBrand(brand: string) {
    await this.brandLinkByName(brand).click();
    await expect(this.pageTitle(new RegExp(brand, 'i'))).toBeVisible();
  }

  /** Verifica el título de marca (ej. "BRAND - POLO PRODUCTS"). */
  async brandTitleContains(brand: string) {
    await expect(this.pageTitle(new RegExp(brand, 'i'))).toBeVisible();
  }

  /** Lista de marcas disponibles en el sidebar. */
  async getAvailableBrands(): Promise<string[]> {
    const brands = await this.brandsPanel.locator("a").allTextContents();
  return brands.map((b) => b.replace(/^\(\d+\)/,"").trim()).filter(Boolean);
  }
}
