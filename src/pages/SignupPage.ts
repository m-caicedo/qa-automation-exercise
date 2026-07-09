import { Page, expect, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Datos necesarios para completar el formulario
 * "ENTER ACCOUNT INFORMATION" de automationexercise.com.
 */
export interface SignupData {
  title: "Mr" | "Mrs";
  password: string;
  day: string;    // "1".."31"
  month: string;  // "January".."December"
  year: string;   // "1990"
  newsletter?: boolean;
  optin?: boolean;
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  country: string; // "India" | "United States" | "Canada" | ...
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
}

/**
 * Página de registro completo de usuario.
 * Cubre el formulario "ENTER ACCOUNT INFORMATION" que aparece
 * después de enviar nombre + email desde /login.
 * Selectores basados en los atributos data-qa reales del sitio.
 */
export class SignupPage extends BasePage {

  // Título (Mr / Mrs)
  readonly titleMr: Locator;
  readonly titleMrs: Locator;

  // Password y fecha de nacimiento
  readonly passwordInput: Locator;
  readonly daysSelect: Locator;
  readonly monthsSelect: Locator;
  readonly yearsSelect: Locator;

  // Checkboxes de suscripción
  readonly newsletterCheckbox: Locator;
  readonly optinCheckbox: Locator;

  // Dirección
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly companyInput: Locator;
  readonly address1Input: Locator;
  readonly address2Input: Locator;
  readonly countrySelect: Locator;
  readonly stateInput: Locator;
  readonly cityInput: Locator;
  readonly zipcodeInput: Locator;
  readonly mobileNumberInput: Locator;

  // Acción final y confirmaciones
  readonly createAccountButton: Locator;
  readonly accountCreatedLabel: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);

    this.titleMr = page.locator('#id_gender1');
    this.titleMrs = page.locator('#id_gender2');

    this.passwordInput = page.locator('[data-qa="password"]');
    this.daysSelect = page.locator('[data-qa="days"]');
    this.monthsSelect = page.locator('[data-qa="months"]');
    this.yearsSelect = page.locator('[data-qa="years"]');

    this.newsletterCheckbox = page.locator('#newsletter');
    this.optinCheckbox = page.locator('#optin');

    this.firstNameInput = page.locator('[data-qa="first_name"]');
    this.lastNameInput = page.locator('[data-qa="last_name"]');
    this.companyInput = page.locator('[data-qa="company"]');
    this.address1Input = page.locator('[data-qa="address"]');
    this.address2Input = page.locator('[data-qa="address2"]');
    this.countrySelect = page.locator('[data-qa="country"]');
    this.stateInput = page.locator('[data-qa="state"]');
    this.cityInput = page.locator('[data-qa="city"]');
    this.zipcodeInput = page.locator('[data-qa="zipcode"]');
    this.mobileNumberInput = page.locator('[data-qa="mobile_number"]');

    this.createAccountButton = page.locator('[data-qa="create-account"]');
    this.accountCreatedLabel = page.locator('[data-qa="account-created"]');
    this.continueButton = page.locator('[data-qa="continue-button"]');
  }

  /** Espera a que se muestre el formulario de información de cuenta. */
  async verifyAccountInfoFormVisible() {
    await expect(this.page.getByText("ENTER ACCOUNT INFORMATION")).toBeVisible();
  }

  /**
   * Completa los 14 campos del formulario de registro
   * y crea la cuenta.
   */
  async fillAccountInformation(data: SignupData) {
    // 1. Título
    if (data.title === "Mr") {
      await this.titleMr.check();
    } else {
      await this.titleMrs.check();
    }

    // 2. Password
    await this.passwordInput.fill(data.password);

    // 3-5. Fecha de nacimiento
    await this.daysSelect.selectOption(data.day);
    await this.monthsSelect.selectOption(data.month);
    await this.yearsSelect.selectOption(data.year);

    // 6-7. Checkboxes opcionales
    if (data.newsletter) {
      await this.newsletterCheckbox.check();
    }
    if (data.optin) {
      await this.optinCheckbox.check();
    }

    // 8-9. Nombre y apellido
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);

    // 10. Compañía
    await this.companyInput.fill(data.company);

    // 11-12. Dirección
    await this.address1Input.fill(data.address1);
    await this.address2Input.fill(data.address2);

    // 13. País
    await this.countrySelect.selectOption(data.country);

    // 14. Estado, ciudad, código postal y teléfono
    await this.stateInput.fill(data.state);
    await this.cityInput.fill(data.city);
    await this.zipcodeInput.fill(data.zipcode);
    await this.mobileNumberInput.fill(data.mobileNumber);
  }

  /** Hace clic en "Create Account". */
  async createAccount() {
    await this.createAccountButton.click();
  }

  /** Verifica el mensaje "ACCOUNT CREATED!". */
  async verifyAccountCreated() {
    await expect(this.accountCreatedLabel).toBeVisible();
    await expect(this.accountCreatedLabel).toContainText("Account Created!");
  }

  /** Hace clic en "Continue" tras la creación de la cuenta. */
  async continueAfterAccountCreation() {
    await this.continueButton.click();
  }
}