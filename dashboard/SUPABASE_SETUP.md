# Supabase Auth Setup Guide (Critical)

To prevent users from creating duplicate accounts (one via Google, one via GitHub), you **MUST** enable Account Linking.

## 1. Prevent "Double Dipping" (Duplicate Accounts)
1.  Go to **Authentication** -> **Settings**.
2.  Find the **"Security"** section (or "User Sessions").
3.  ✅ **ENABLE** `Confirm email`.
    *   *Why?* You can't safely link accounts if you don't verify they own the email.
4.  ✅ **ENABLE** `Link identities on email`.
    *   *Why?* This is the magic switch. If a user signs in with GitHub (`user@gmail.com`) and then Google (`user@gmail.com`), Supabase will merge them into ONE account.

## 2. Enable Providers
1.  **Google**:
    *   Go to **Authentication** -> **Providers** -> **Google**.
    *   Paste your `Client ID` and `Secret` from Google Cloud Console.
    *   Ensure "Enable" is checked.
2.  **GitHub**:
    *   Go to **Authentication** -> **Providers** -> **GitHub**.
    *   Paste your `Client ID` and `Secret` from GitHub Developer Settings.
    *   Ensure "Enable" is checked.

## 3. Redirect URLs
1.  Go to **Authentication** -> **URL Configuration**.
2.  Add your production URL (e.g., `https://keepalive.app/dashboard`).
3.  Add your localhost URL (e.g., `http://localhost:3000/dashboard`).

---
**Once you do Step 1, your "One User, One Account" rule is enforced automatically.**
