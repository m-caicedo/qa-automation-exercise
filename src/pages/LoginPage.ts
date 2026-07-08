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
  readonly logoutButton: Locator;

  /**
   * Selectores del formulario de Signup (usados solo para iniciar el flujo)
  */
  readonly signupNameInput: Locator;
  readonly signupEmailInput: Locator;
  readonly signupButton: Locator;
  readonly signupErrorMessage: Locator;

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
    this.logoutButton = page.locator('a[href="/logout"]');

    /**
    * Formulario de Signup (nombre + email), previo a "Enter Account Information"
    */
    this.signupNameInput = page.locator('form').filter({ hasText: 'Signup' }).getByRole('textbox', { name: 'Name' });
    this.signupEmailInput = page.locator('[data-qa="signup-email"]');
    this.signupButton = page.locator('[data-qa="signup-button"]');
    this.signupErrorMessage = page.getByText("Email Address already exist!");
  
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

  /**
   * Cierra la sesión activa haciendo clic en el botón "Logout".
   */
  async logout() {
    await this.logoutButton.click();
  }
 
  /**
   * Verifica que, tras el logout, el usuario haya sido
   * redirigido a la página de login (TC-006).
   */
  async verifyRedirectedToLogin() {
    await expect(this.page).toHaveURL(/.*\/login/);
    await expect(this.loginButton).toBeVisible();
  }
 
  /**
   * Inicia el flujo de registro desde /login: llena nombre + email
   * y hace clic en "Signup". Usado por TC-004 y TC-005.
   */
  async startSignup(name: string, email: string) {
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupButton.click();
  }
 
  /**
   * Verifica el mensaje de error cuando el email ya existe (TC-005).
   */
  async verifySignupEmailExistsError() {
    await expect(this.signupErrorMessage).toBeVisible();
  }

}
