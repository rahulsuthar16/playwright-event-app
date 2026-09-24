import { expect, test } from '@playwright/test'
import { RegisterPage } from '../pages/register.page'
import credentials from '../data/credentials.json'


let registerPage: RegisterPage
const existingUser = credentials.valid

test.describe("registration scenarios", { tag: ["@register"] }, () => {
    test.beforeEach(async ({ page }) => {
        registerPage = new RegisterPage(page)
        await registerPage.goto()
    })

    test.skip("REGISTER_01 : User can register successfully with valid details", async ({ page }) => {
        const randomEmail = `user_${Math.random().toString(36).substring(2, 10)}@tester.com`;
        const password = "Test@123"
        await registerPage.register(randomEmail, password, password)
        await expect(page).toHaveURL("/");
    })

    test("REGISTER_02 : Registration fails when using an existing email", async () => {
        await registerPage.register(existingUser.email, "Test@123", "Test@123")
        await expect(registerPage.emailAlreadyExistsError).toBeVisible()
        await expect(registerPage.emailAlreadyExistsError).toHaveText("Email already registered")
    })

    test("REGISTER_03 : Registration validates password mismatch rules", async () => {
        await registerPage.register(existingUser.email, "Test@123", "Test1@123")
        await expect(registerPage.passwordsDoNotMatchError).toBeVisible()
        await expect(registerPage.passwordsDoNotMatchError).toHaveText("Passwords do not match")
    })

    test("REGISTER_04 : Registration requires all mandatory fields", async () => {
        await registerPage.register("", "", "")
        await expect(registerPage.invalidEmailError).toBeVisible()
        await expect(registerPage.invalidEmailError).toHaveText("Enter a valid email")

        await expect(registerPage.passwordRequirementsError).toBeVisible()
        await expect(registerPage.passwordRequirementsError).toHaveText("Password does not meet the requirements below")
    })

    test("REGISTER_05 : Marketing section renders correctly on register page", async () => {
        await expect(registerPage.marketingHeader).toBeVisible()
        await expect(registerPage.marketingContentList).toBeVisible()
        await expect(registerPage.marketingContentList.locator('li')).toHaveCount(4);
        await expect(registerPage.apiDocumentationLink).toHaveCount(2);
    })

    test("REGISTER_06 : User can navigate from register to login page", async ({ page }) => {
        await registerPage.signInLink.click()
        await expect(page).toHaveURL(/login/);
    })

    test("REGISTER_07 : user can navigate to API documentation", { tag: '@swagger-doc' }, async ({ page, context }) => {
        const [apiDocsPage] = await Promise.all([
            context.waitForEvent('page'),
            registerPage.apiDocumentationLink.first().click()
        ]);
        await apiDocsPage.waitForLoadState('domcontentloaded');
        await expect(apiDocsPage).toHaveURL(/api\/docs/);
    })

})