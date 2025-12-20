# DevLog: Why Hardcoding URLs Killed My Localhost Workflow

**Context:**
I'm building **KeepAlive**, a tool to monitor API endpoints. The dashboard needs to display the exact endpoint URL to the user so they can copy-paste it into their projects.

**The Problem:**
I initially hardcoded the endpoint as `https://keepalive.app/api/ping`. This worked fine in my head until I started testing locally. My local environment (`localhost:3000`) was showing the production URL. If I copied it to test, I was hitting the wrong server.

**Investigation:**
I considered using environment variables (`NEXT_PUBLIC_API_URL`), but that requires a rebuild or restart to change context. I wanted the dashboard to be smart enough to know *where* it is running—client-side—without extra config.

**Insight:**
The browser already knows where it is. `window.location.origin` gives the protocol, domain, and port.

**The Fix:**
I replaced the static string with a dynamic template literal:

```typescript
// Before
ENDPOINT: "https://keepalive.app/api/ping"

// After
ENDPOINT: `${window.location.origin}/api/ping`
```

**Takeaway:**
When building client-side dashboards, rely on the browser's context when possible. It makes your app portable between staging, dev, and prod without managing a dozen `.env` files for simple display logic.
