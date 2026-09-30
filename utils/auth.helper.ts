// utils/auth.helper.ts
import { Page, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { valid } from "../data/credentials.json"

export async function loginUser(page: Page) {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(valid.email, valid.password);
    await expect(page).toHaveURL("/"); // Base post-login URL
}