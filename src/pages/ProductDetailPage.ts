import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Representa los datos visibles en la página de detalle de producto.
 */
export interface ProductDetails {
  name: string;
  category: string;
  price: string;
  availability: string;
  condition: string;
  brand: string;
}

/**
 * Page Object para la página de detalle de producto
 * (https://automationexercise.com/product_details/{id}).
 */
export class ProductDetailPage extends BasePage {
  private readonly infoContainer: Locator;
  private readonly productName: Locator;
  private readonly productCategory: Locator;
  private readonly productPrice: Locator;
  private readonly productAvailability: Locator;
  private readonly productCondition: Locator;
  private readonly productBrand: Locator;
  private readonly quantityInput: Locator;
  private readonly addToCartButton: Locator;

  constructor(page: Page) {
    super(page);

    this.infoContainer = page.locator(".product-information");
    this.productName = this.infoContainer.getByRole('heading', { level: 2 })
    this.productCategory = this.infoContainer.locator("p", { hasText: "Category" });
    this.productPrice = this.infoContainer.locator("span span");
    this.productAvailability = this.infoContainer.locator("p", {
      hasText: "Availability",
    });
    this.productCondition = this.infoContainer.locator("p", { hasText: "Condition" });
    this.productBrand = this.infoContainer.locator("p", { hasText: "Brand" });
    this.quantityInput = page.locator("#quantity");
    this.addToCartButton = page.locator('button:has-text("Add to cart")');
  }

  /** Navega directamente a una ficha de producto por id. */
  async gotoById(productId: string | number) {
    await this.navigate(`/product_details/${productId}`);
  }

  /** Verifica que estemos en una página de detalle válida. */
  async expectProductDetailVisible() {
    await expect(this.productName).toBeVisible();
    await expect(this.productPrice).toBeVisible();
  }

  async getName(): Promise<string> {
    return (await this.productName.textContent())?.trim() ?? "";
  }

  async getPrice(): Promise<string> {
    return (await this.productPrice.first().textContent())?.trim() ?? "";
  }

  async getCategory(): Promise<string> {
    const text = (await this.productCategory.textContent()) ?? "";
    return text.replace("Category:", "").trim();
  }

  async getAvailability(): Promise<string> {
    const text = (await this.productAvailability.textContent()) ?? "";
    return text.replace("Availability:", "").trim();
  }

  async getCondition(): Promise<string> {
    const text = (await this.productCondition.textContent()) ?? "";
    return text.replace("Condition:", "").trim();
  }

  async getBrand(): Promise<string> {
    const text = (await this.productBrand.textContent()) ?? "";
    return text.replace("Brand:", "").trim();
  }

  /** Recolecta todos los campos del detalle en un solo objeto. */
  async getAllDetails(): Promise<ProductDetails> {
    return {
      name: await this.getName(),
      category: await this.getCategory(),
      price: await this.getPrice(),
      availability: await this.getAvailability(),
      condition: await this.getCondition(),
      brand: await this.getBrand(),
    };
  }

  /** Verifica que ninguno de los 6 campos requeridos esté vacío. */
  async expectAllFieldsPopulated() {
    const details = await this.getAllDetails();
    for (const [field, value] of Object.entries(details)) {
      expect(value, `El campo "${field}" no debería estar vacío`).not.toBe("");
    }
  }

  async setQuantity(quantity: number) {
    await this.quantityInput.fill(String(quantity));
  }

  async addToCart() {
    await this.addToCartButton.click();
  }
}
