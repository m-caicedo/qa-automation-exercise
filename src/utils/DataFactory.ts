import { faker } from "@faker-js/faker";

export type ProductCategory = "Women" | "Men" | "Kids";

export interface ProductSearchTerm {
  keyword: string;
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
}

/**
 * DataFactory: builders para generar datos de prueba relacionados con
 * productos (nombre, categoría, precio) usando Faker.js.
 *
 * No representa productos reales del catálogo (que es fijo en el sitio),
 * sino datos sintéticos para casos negativos, búsquedas y validaciones
 * de formularios/carritos que requieran valores dinámicos.
 */
export class DataFactory {
  private static readonly CATEGORIES: ProductCategory[] = ["Women", "Men", "Kids"];

  private static readonly SUBCATEGORIES: Record<ProductCategory, string[]> = {
    Women: ["Dress", "Tops", "Saree"],
    Men: ["Tshirts", "Jeans"],
    Kids: ["Dress", "Tops & Shirts"],
  };

  /** Genera un nombre de producto pseudoaleatorio con estilo e-commerce. */
  static buildProductName(): string {
    const adjective = faker.commerce.productAdjective();
    const material = faker.commerce.productMaterial();
    const product = faker.commerce.product();
    return `${adjective} ${material} ${product}`;
  }

  /** Genera una categoría válida al azar entre Women, Men, Kids. */
  static buildCategory(): ProductCategory {
    return faker.helpers.arrayElement(this.CATEGORIES);
  }

  /** Genera una subcategoría válida para la categoría dada. */
  static buildSubCategory(category: ProductCategory): string {
    return faker.helpers.arrayElement(this.SUBCATEGORIES[category]);
  }

  /** Genera un precio con formato "Rs. NNN" como en automationexercise.com. */
  static buildPrice(min = 300, max = 2500): string {
    const amount = faker.number.int({ min, max });
    return `Rs. ${amount}`;
  }

  /** Genera un término de búsqueda válido (nombre corto, real-ish). */
  static buildValidSearchTerm(): string {
    return faker.helpers.arrayElement([
      "Top",
      "Tshirt",
      "Dress",
      "Jeans",
      "Saree",
      "Shirt",
    ]);
  }

  /**
   * Genera un término de búsqueda inválido: cadena aleatoria que casi
   * con certeza no coincide con ningún producto del catálogo real.
   */
  static buildInvalidSearchTerm(): string {
    return `zzz-${faker.string.alphanumeric(10)}-notfound`;
  }

  /** Builder completo de un criterio de búsqueda/filtrado de producto. */
  static buildProductSearch(overrides: Partial<ProductSearchTerm> = {}): ProductSearchTerm {
    const category = overrides.category ?? this.buildCategory();
    return {
      keyword: overrides.keyword ?? this.buildValidSearchTerm(),
      category,
      minPrice: overrides.minPrice ?? 300,
      maxPrice: overrides.maxPrice ?? 2500,
    };
  }

  /** Builder de un "producto" sintético completo (nombre, categoría, precio). */
  static buildProduct() {
    const category = this.buildCategory();
    return {
      name: this.buildProductName(),
      category,
      subCategory: this.buildSubCategory(category),
      price: this.buildPrice(),
    };
  }
}
