import { Page, expect, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
/**
 * Página encargada de todas las acciones relacionadas
 * con el proceso de autenticación.
 */
export class LoginPage extends BasePage {

  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly loggedInLabel: Locator;

  /**
   * Inicializa todos los selectores de la página.
   * Cada Locator representa un elemento del formulario.
   */
  constructor(page:Page){
    super(page);
    this.emailInput = page.locator('form').filter({hasText: 'Login'}).getByRole('textbox',{name: 'Email Address'});
    this.passwordInput = page.getByRole('textbox', {name: 'Password'});
    this.loginButton = page.getByRole('button', {name: 'Login'});
    this.errorMessage = page.getByText("Your email or password is incorrect!");
    this.loggedInLabel = page.getByText(" Logged in as ");
  }
  /**
   * Abre la página de Login.
   */
  async goto() {await this.navigate("/login");}
  /**
   * Completa el formulario e intenta iniciar sesión.
   */
  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
  /**
   * Verifica que el usuario haya iniciado sesión correctamente.
   */
  async verifyLoginSuccess() {await expect(this.loggedInLabel).toBeVisible();}
  /**
   * Verifica que se muestre el mensaje de error cuando
   * las credenciales son inválidas.
   */
  async verifyLoginError() {await expect(this.errorMessage).toContainText("Your email or password is incorrect!");}
}
