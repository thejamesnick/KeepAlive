# 🧠 KeepAlive Content Engine: Topic Backlog

## 🏁 The Origin Story (Foundational)
1.  **KeepAlive: The "Why"**: The story of why we built this.
    *   **The Spark**: "Hey, your demo link is 404ing." (The embarrassment of silent failures)
    *   **The Trap**: "Free Tier" doesn't mean "Always On." If you don't use it, you lose it (7-day pause policies).
    *   **The Solution**: A "Dead Man's Switch" for your portfolio.
    *   **The Vibe**: Why we picked the "Apple SaaS" aesthetic (Black & White, Squircle) over generic dev-tool styling.

## 🤯 The "Headache" Series (Engineering War Stories)

### 1. The "Ghost" Session Race Condition
*   **The Pain:** Users would log in, refresh, and immediately get kicked out.
*   **The Cause:** `useEffect` firing before the Supabase Auth listener had initialized, causing a false "null" user state.
*   **The Fix:** Improving the auth guard logic to wait for the *initial* session check, not just the listener attachment.

### 2. "Why is my Phone Hot?" - The CSS Performance Trap
*   **The Pain:** The dashboard looked beautiful on desktop but ran at 15fps on iPhone.
*   **The Cause:** Overusing `backdrop-filter: blur()` on large nested elements without `will-change` or layer promotion.
*   **The Fix:** Reducing the blur radius and isolating glass elements to specific z-indexes.

### 3. The Optimistic UI Lie (State Rollbacks)
*   **The Pain:** A user creates a project, sees it appear, then it disappears 2 seconds later because the DB call failed.
*   **The Cause:** Naive optimistic updates that didn't handle the "error" path correctly.
*   **The Fix:** A robust "rollback" mechanism in the React state reducers.

### 4. CORS hell on the Edge
*   **The Pain:** "Access-Control-Allow-Origin" errors only when pining from *some* external domains.
*   **The Cause:** Security headers on Vercel Edge functions behave differently than standard Node servers, especially with preflight `OPTIONS` requests.
*   **The Fix:** Manually handling the `OPTIONS` method in `route.ts`.

### 5. The RLS " Silent Failure"
*   **The Pain:** Queries returning `[]` (empty array) instead of an error, making debugging impossible.
*   **The Cause:** Row Level Security (RLS) silently filtering out rows because the server-side client wasn't passing the Auth Cookie correctly.
*   **The Fix:** Ensuring the `createServerClient` context is passed through every server action.

### 6. The Copy-Paste "Secure Context" Bug
*   **The Pain:** The "Copy API Key" button worked on localhost but failed on the production URL for some users.
*   **The Cause:** `navigator.clipboard` is only available in Secure Contexts (HTTPS). If a user accessed via HTTP or a weird proxy, it crashed.
*   **The Fix:** Graceful degradation and fallback text selection.

### 7. Relative Time Algorithms (Zero Dependencies)
*   **The Pain:** Importing Moment.js (50kb+) just to show "5 mins ago".
*   **The Insight:** Writing a recursive, O(1) formatter in pure TypeScript.
*   **The Lesson:** Understanding date math and reducing bundle size.

### 8. Generating High-Entropy Keys
*   **The Pain:** Using `Math.random()` allows attackers to predict API keys.
*   **The Fix:** Using `crypto.getRandomValues()` for cryptographically secure randomness.
*   **The Lesson:** Security hygiene in client-side generation.

## 🩸 Critical CodeBites (Only the complex ones)
9.  **Snippet:** **The `useAsyncEffect` Hook** - handling async cleanup correctly to prevent memory leaks in React.
10. **Snippet:** **Safe JSON Parsing** - A wrapper that prevents `JSON.parse` from crashing the entire app on bad API responses.
11. **Snippet:** **Double-Check Locking in React** - Preventing a button from being clicked twice while an API call is in flight (state locking).

## 🗄️ Database Deep Dives (From `schema.sql`)
12. **The "Security Definer" Trick**: How we built `register_ping` to allow unauthenticated API tokens to write to the DB without breaking RLS.
13. **Auto-Profile Triggers**: The PL/pgSQL function `handle_new_user` that automatically creates user profiles on signup (and why doing it in the app layer is a mistake).
