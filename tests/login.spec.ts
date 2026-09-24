import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/login.page'
import credentials from '../data/credentials.json'

let loginPage: LoginPage
const validUser = credentials.valid
const inValidUser = credentials.invalid

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    await loginPage.goto()
})

test.describe("login scenarios", { tag: ['@login'] }, () => {

    test("LOGIN_01 : User can login successfully with valid credentials", async ({ page }) => {
        await loginPage.login(validUser.email, validUser.password)
        await expect(page).toHaveURL("/");
    })

    test("LOGIN_02 : Login fails with invalid password", async ({ page }) => {
        await loginPage.login(inValidUser.email, inValidUser.password)
        await expect(loginPage.loginErrorMessage).toBeVisible()
        await expect(loginPage.loginErrorMessage).toHaveText('Invalid email or password');
        await expect(page).toHaveURL(/login/);
    })

    test("LOGIN_03 : Login fails with unregistered email", async ({ page }) => {
        await loginPage.login(validUser.email, inValidUser.password)
        await expect(loginPage.loginErrorMessage).toBeVisible()
        await expect(loginPage.loginErrorMessage).toHaveText('Invalid email or password');
        await expect(page).toHaveURL(/login/);
    })

    test("LOGIN_04 : Login enforces empty field validation", async ({ page }) => {
        await loginPage.login("", "")
        await expect(loginPage.emailInputError).toBeVisible()
        await expect(loginPage.passwordInputError).toBeVisible()
    })

    test("LOGIN_05 : Marketing section renders correctly on login page", async () => {
        await expect(loginPage.marketingImage).toBeVisible()
        await expect(loginPage.marketingContentList).toBeVisible()
        await expect(loginPage.marketingContentList.locator('li')).toHaveCount(4);
        await expect(loginPage.loginFormHeader).toBeVisible()
        await expect(loginPage.loginFormHintText).toBeVisible()
    })

    test("LOGIN_06 : User can navigate from login to register page", async ({ page }) => {
        await expect.soft(loginPage.registerButton).toHaveText('Register');
        await loginPage.registerButton.click()
        await expect(page).toHaveURL(/register/);
    })

    test("LOGIN_07 : user can navigate to API documentation", { tag: '@swagger-doc' }, async ({ page, context }) => {
        const [apiDocsPage] = await Promise.all([
            context.waitForEvent('page'),
            loginPage.apiDocumentationLink.click()
        ]);
        await apiDocsPage.waitForLoadState('domcontentloaded');
        await expect(apiDocsPage).toHaveURL(/api\/docs/);
    })
})