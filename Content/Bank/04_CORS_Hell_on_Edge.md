# 🏁 Content Unit: CORS Hell on the Edge

## 1. 📝 The DevLog (Deep Dive)
**Title:** Access-Control-Allow-Headache: CORS on Edge Functions

### 1. Context: The "Public" Endpoint
**KeepAlive** has one crucial API route: `/api/ping`.
This route is special. It is not meant to be hit by my frontend. It is meant to be hit by *users* from their own servers, their Github Actions, or even their local terminals.
Because it needs to be blazing fast and scalable, I deployed it to the **Vercel Edge Runtime**.
My goal: allow `POST` requests from anywhere.

### 2. The Spark: The Red Console Error
I deployed the code. I tested it with `curl`. It worked.
Then I tried to call it from a client-side dashboard I was building on a different domain (`localhost:3000` calling `keepalive.app`).
**Boom.**
```
Access to fetch at 'https://keepalive.app/api/ping' from origin 'http://localhost:3000' has been blocked by CORS policy.
```
I rolled my eyes. "Classic CORS," I thought.
I went into my `route.ts` and added the headers:
```typescript
{
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
}
```
I redeployed.
**It happened again.**
I was confused. I explicitly said "Allow Origin: *". Why was the browser lying?

### 3. The Friction: The Preflight Trap
I spent 2 hours debugging.
I changed the logic. I moved the headers to `next.config.js`. Nothing worked.
Finally, I looked at the "Network" tab in Chrome DevTools.
I noticed something consistent:
The error wasn't happening on the `POST`.
The browser was sending a request method called `OPTIONS` *before* the POST.
This `OPTIONS` request was returning `405 Method Not Allowed`.

**The Trap:**
When you make a "Simple Request" (like `GET` or standard `POST`), the browser just sends it.
But... if you add **custom headers** (like `Authorization: Bearer my-token`), the browser says "Whoa, this is sensitive."
It sends a **Preflight Request** (`OPTIONS`) to ask the server: "Hey, are you cool with me sending an Auth header?"
My API only had a `export async function POST`.
It ignored `OPTIONS`.
So the browser interpreted the silence as "NO."

### 4. The Investigation: Edge Runtime vs. Node
In a standard Node.js Express server, middleware usually handles this `OPTIONS` stuff for you implicitly.
But in **Next.js App Router (Edge Runtime)**, you are bare metal. You have to handle every method explicitly.
If you don't export an `OPTIONS` function, Next.js returns 405 by default.

### 5. The Fix: The Manual Options Handler
I had to write a dedicated handler just to say "Yes" to the browser.
It must return `204 No Content` and—crucially—it must explicitly allow the headers you plan to receive.

**The Code:**
```typescript
export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      // CRITICAL: You must list the specific headers you expect!
      'Access-Control-Allow-Headers': 'Content-Type, Authorization', 
    },
  });
}
```
Once I added `Authorization` to the allowed headers list, the Preflight passed, and the POST succeeded.

### 6. The Takeaway
CORS is not designed to annoy developers; it is designed to protect users.
But developer tools often hide the mechanics of the "Preflight" handshake.
If you are building an API meant for others, you cannot ignore `OPTIONS`.
Silence is rejection.

---

## 2. 📡 The BIP (Build In Public)

**Anchor:**
Finalizing the public API for KeepAlive.

**Pulse:**
Battled CORS errors for 4 hours today. ⚔️
The API worked in `curl` but failed in the browser.
Turned out I was ignoring the `OPTIONS` preflight request.

**Signal:**
Did you know that adding an `Authorization` header turns a "Simple Request" into a "Complex Request"?
That triggers a mandatory preflight.
If your Edge Function doesn't explicitly handle `OPTIONS`, the browser blocks the real request.

**Direction:**
API is now fully CORS-compatible.
Ready for public consumption.

---

## 3. 🍿 The CodeBite (Snippet)

**Headline:** The Universal CORS Fix for Next.js API Routes 🌐

**Challenge:**
Your API Route works in Postman but fails in the Browser with a CORS error, even with "Allow-Origin: *".

**Hint:**
You are probably missing the Preflight (`OPTIONS`) handler.

**Snippet:**
```typescript
// app/api/ping/route.ts

// 1. Handle the Real Request
export async function POST(req: Request) { ... }

// 2. Handle the Preflight (MANDATORY)
export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      // You MUST list headers like 'Authorization' here
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
```

**Mini Lesson:**
Browsers are paranoid. If you send custom headers, they ask for permission first. Your server must explicitly grant it via the `OPTIONS` method.

---

## 4. 🔗 Social Media (LinkedIn Long Form)

**Headline:** Why "Access-Control-Allow-Origin: *" Is Not Enough.

**(1. The Hook)**
I thought I understood CORS.
I was wrong.
I added the wildcard header `*`.
I thought that meant "Allow Everyone."
But my API was still blocking requests.

**(2. The Problem)**
The HTTP specification distinguishes between "Simple" requests and "Preflighted" requests.
A standard `GET` or form `POST` is simple. The browser sends it immediately.
But as soon as you add **Security**, you add **Complexity**.
I added an `Authorization: Bearer` header to secure my endpoint.
The browser blocked it.

**(3. The Mechanics)**
Before sending your data, the browser quietly sends an `OPTIONS` request.
"Hey Server, user wants to send a custom Authorization header. Is that okay?"
My server (running on Vercel Edge) didn't answer. It threw a 405 Error because I hadn't written code for `OPTIONS`.
The browser interpreted "405" as "Permission Denied."

**(4. The Solution)**
You must explicitly code the handshake.
You need a route handler that does nothing but say "Yes."
It returns Status 204 (No Content).
And—this is the key—it must echo back the *specific headers* that are allowed.
`Access-Control-Allow-Headers: Authorization`.

**(5. The Result)**
Once I added the handshake, the API opened up.
It works from localhost. It works from production. It works from 3rd party apps.

**Takeaway:**
Don't fear CORS. Understand the handshake.
Security is a conversation between the Browser and the Server. Don't leave the Browser on "Read."

#WebDev #API #Security #NextJS #CORS

---

## 5. 🧵 Twitter / X Thread (The Hook & Structure)

**(Tweet 1/8)**
I hate CORS. 🛑
You hate CORS.
We all hate CORS.

But today I learned why my "Universal Unblock" header wasn't working.
If you are building APIs on Next.js App Router, read this. 🧵👇

**(Tweet 2/8 - The Scenario)**
I built a public API endpoint.
I wanted anyone to be able to hit it.
So I added:
`Access-Control-Allow-Origin: *`

Job done, right?
Wrong.

**(Tweet 3/8 - The Error)**
Requests failed instantly.
`Blocked solely by CORS policy.`
But my logs showed the server never even received the POST request!
It was being blocked *before* it left the browser.

**(Tweet 4/8 - The Preflight)**
Here is what I missed:
I was using a Bearer Token for auth.
`Authorization: Bearer xyz`

To the browser, `Authorization` is a "Non-Simple Header."
It triggers a safety check.
The browser sends an `OPTIONS` ping first.

**(Tweet 5/8 - The Ghost)**
My Next.js route file looked like this:
`export async function POST() { ... }`

Notice what's missing?
`OPTIONS`.
Next.js automatically replied `405 Method Not Allowed`.
The browser took that as a rejection.

**(Tweet 6/8 - The Fix)**
You have to manually write the doorman.
`export async function OPTIONS() { return 204 }`

And you have to explicitly whitelist the Auth header:
`Allow-Headers: Authorization`

**(Tweet 7/8 - The Logic)**
It's annoying, but it prevents malicious JS from stealing your bank details using custom headers.
It's a necessary evil.

**(Tweet 8/8)**
I documented the full `OPTIONS` handler snippet here.
Copy-paste it into your `route.ts` and never fight CORS again.

(Link to CodeBite)
#BuildInPublic #NextJS

---

## 6. 🧵 Threads (Meta) - The "Developer Chat" Vibe

**(Post 1/4)**
Is there anything more humbling than a CORS error that won't go away? 🛑
I spent 2 hours yelling at my screen today.
"I SAID ALLOW ORIGIN STAR! WHY WON'T YOU WORK?"

**(Post 2/4)**
Turns out, if you use Auth headers, the browser sends a secret `OPTIONS` request first.
If you don't answer that request, it blocks the main one.
I was fundamentally misunderstanding the HTTP handshake.

**(Post 3/4)**
Fixed it by exporting an explicit `OPTIONS` function in my Next.js route.
Now my API is truly public.

**(Post 4/4)**
Honestly, CORS protects users, but for developers, it feels like the browser is gaslighting you.
Anyone else struggle with this on Vercel Edge?
