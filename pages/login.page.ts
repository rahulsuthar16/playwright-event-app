import { Page, Locator } from '@playwright/test'

export class LoginPage {
    readonly page: Page

    readonly marketingImage: Locator
    readonly marketingContentList :Locator
    readonly apiDocumentationLink: Locator

    readonly loginFormHeader: Locator
    readonly loginFormHintText: Locator
    readonly emailInput: Locator
    readonly passwordInput: Locator
    readonly signInButton: Locator
    readonly registerButton: Locator
    readonly loginErrorMessage: Locator
    readonly emailInputError: Locator
    readonly passwordInputError: Locator

    constructor(page: Page) {
        this.page = page
        this.marketingImage = page.getByAltText("EventHub app preview")
        this.marketingContentList = page.getByRole('list')
        this.apiDocumentationLink = page.getByRole('link', { name: 'API Documentation (Swagger)' })
        this.loginFormHeader = page.locator('h2:visible')
        this.loginFormHintText = page.locator('p.text-sm.text-gray-500.mt-2.leading-relaxed')
        this.emailInput = page.getByLabel('Email')
        this.passwordInput = page.getByLabel('Password')
        this.signInButton = page.getByRole('button')
        this.registerButton = page.getByRole('link', { name: 'Register' })
        this.loginErrorMessage = page.getByText('Invalid email or password', { exact: true })
        this.emailInputError = page.getByText('Enter a valid email', { exact: true })
        this.passwordInputError = page.getByText('Password must be at least 6 characters', { exact: true })
    }

    async goto() {
        await this.page.goto("/login")
    }

    async login(email: string, password: string) {
        await this.emailInput.fill(email)
        await this.passwordInput.fill(password)
        await this.signInButton.click()
    }
}