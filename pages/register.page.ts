import { Page, Locator } from '@playwright/test'

export class RegisterPage {
    readonly page: Page
    readonly marketingHeader: Locator
    readonly marketingContentList: Locator
    readonly apiDocumentationLink: Locator

    readonly emailInput: Locator
    readonly passwordInput: Locator
    readonly confirmPasswordInput: Locator
    readonly createAccountButton: Locator
    readonly signInLink: Locator
    readonly invalidEmailError: Locator
    readonly passwordRequirementsError: Locator
    readonly emailAlreadyExistsError: Locator
    readonly passwordsDoNotMatchError: Locator

    constructor(page: Page) {
        this.page = page
        this.marketingHeader = page.locator('h2:visible')
        this.marketingContentList = page.locator('ul.space-y-4')
        this.apiDocumentationLink = page.getByRole('link', { name: 'API Documentation (Swagger)' })
        this.emailInput = page.getByTestId('register-email')
        this.passwordInput = page.getByTestId("register-password")
        this.confirmPasswordInput = page.locator("input[placeholder='Repeat your password']")
        this.createAccountButton = page.getByRole("button")
        this.signInLink = page.getByRole('link', { name: 'Sign in' })
        this.invalidEmailError = page.getByText('Enter a valid email')
        this.passwordRequirementsError = page.getByText('Password does not meet the requirements below', { exact: true })
        this.emailAlreadyExistsError = page.getByText("Email already registered")
        this.passwordsDoNotMatchError = page.getByText('Passwords do not match')
    }

    async goto() {
        await this.page.goto("/register")
    }

    async register(email: string, password: string, confirmPassword: string) {
        await this.emailInput.fill(email)
        await this.passwordInput.fill(password)
        await this.confirmPasswordInput.fill(confirmPassword)
        await this.createAccountButton.click()
    }
}