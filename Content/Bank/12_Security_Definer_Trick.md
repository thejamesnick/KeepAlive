# 🏁 Content Unit: The "Security Definer" Trick

## 1. 📝 The DevLog (Deep Dive)
**Title:** Allowing Writes from Nobody: The "Security Definer" Trick

### 1. Context: The Anonymous Ping
**KeepAlive** has a unique problem.
Most apps only allow "Logged In Users" to write to the database.
But KeepAlive is a health-check system. The "User" is actually a GitHub Action script running on a server somewhere.
This script has an API Token, but it does **not** have a Supabase User Session (`auth.uid()`).
It is effectively "Anonymous."

### 2. The Spark: The RLS Blockade
I set up Row Level Security (RLS) to protect my data.
`CREATE POLICY "Users can insert" ON pings TO authenticated ...`
Then I ran my GitHub Action.
**Error:** `new row violates row-level security policy`.
The database rejected the write because the "pinger" wasn't logged in.

### 3. The Friction: The "Open Door" Temptation
I considered just opening the door.
`CREATE POLICY "Anyone can insert" ON pings TO anon ...`
**The Trap:**
This would allow *anyone* on the internet to spam my database with fake pings. Malicious actors could fill my storage limit in minutes.
I needed a way to:
1.  Accept a request from an "Anonymous" user.
2.  check if they have a valid token.
3.  **If valid:** Elevate their privileges to "Admin" just for that one split second to write the data.
4.  **If invalid:** Reject them.

### 4. The Investigation: Postgres Internals
I dug into the Postgres documentation.
Most SQL functions run with the privileges of the **Invoker** (the person calling the function).
If I (Anon) call `insert_ping()`, the function runs as Anon. RLS blocks me.

But there is a flag called **SECURITY DEFINER**.
If you add this flag to a function, it runs with the privileges of the **Creator** (Me, The Database Owner).
It is comparable to `sudo` in Linux.
Even if a "Guest" calls it, the function executes with "God Mode" powers.

### 5. The Fix: The Token-Gated RPC
I wrote a specific Remote Procedure Call (RPC) function.

**The Architecture:**
1.  **Input:** The function takes a `token` (string) as an argument.
2.  **Validation:** It logic-checks if that token exists in the `projects` table.
    *   `SELECT id FROM projects WHERE api_token = token`.
3.  **Execution:** If valid, it performs the `INSERT`.
    *   Because it is `SECURITY DEFINER`, this insert **bypasses RLS**.
4.  **Security:** Because the logic is hardcoded inside the function, the user cannot do anything *except* what I programmed (Register a ping). They can't delete tables or read other users' data.

### 6. The Takeaway
RLS is a hammer. Sometimes you need a scalpel.
`SECURITY DEFINER` functions allow you to create "Privileged Portals" through your firewall.
They are dangerous if written poorly (SQL Injection risk!), but they are the only way to build public-facing write APIs on a secure database.

---

## 2. 📡 The BIP (Build In Public)

**Anchor:**
Building the ping ingestion API.

**Pulse:**
Figured out how to let "Anonymous" GitHub Actions write to my secure database today.
It felt like hacking my own system.

**Signal:**
The concept is `SECURITY DEFINER`.
It allows a Postgres function to run with "Admin" privileges, even if called by a "Guest."
I wrapped my `INSERT` logic inside a function that verifies the API Token first.
It's like giving the Guest a Key Card that only opens one specific door.

**Direction:**
The Ingestion API is live and secure.
Next: Building the Notification system.

---

## 3. 🍿 The CodeBite (Snippet)

**Headline:** How to `sudo` in Postgres (Bypassing RLS) 🛡️

**Challenge:**
You want to allow an unauthenticated user (like a webhook or script) to insert data, but RLS is blocking them.

**Hint:**
Wrap the insert in a `SECURITY DEFINER` function.

**Snippet:**
```sql
-- 1. Create the Function
create or replace function register_ping(token text)
returns jsonb
language plpgsql
security definer -- << THE MAGIC WORDS (Runs as Admin)
as $$
declare
  target_project_id uuid;
begin
  -- 2. Custom Security Check (Manual)
  select id into target_project_id from projects where api_token = token;
  
  if target_project_id is null then
     raise exception 'Invalid Token'; -- Block bad actors
  end if;

  -- 3. Privileged Operation (Bypasses RLS)
  insert into pings (project_id) values (target_project_id);
  
  return '{"success": true}'::jsonb;
end;
$$;
```

**Mini Lesson:**
Only use `SECURITY DEFINER` if you hard-code the logic inside. Never execute arbitrary SQL passed as an argument, or you just created a backdoor.

---

## 4. 🔗 Social Media (LinkedIn Long Form)

**Headline:** How to Let "Guests" Write to Your Secure Database.

**(1. The Hook)**
I had a security dilemma.
I have a database locked down tight with Row Level Security (RLS).
Only logged-in users can touch it.
But... I needed a script (GitHub Action) to write data to it.
The script cannot "Log In." Ideally, it shouldn't have my Admin Keys either.

**(2. The Problem)**
If I relax the RLS policy (`TO anon USING (true)`), I open my database to spammers.
If I keep it strict, my feature breaks.
I needed a middle ground: **Token-Based Write Access.**

**(3. The Solution)**
Postgres has a superpower called `SECURITY DEFINER`.
Normally, when you run a function, it runs with *your* permissions. (If you are Guest, you have Guest powers).
If you tag a function with `SECURITY DEFINER`, it runs with the *Author's* permissions. (If I wrote it, it has Admin powers).

**(4. The Implementation)**
I created a function `register_ping(token)`.
Inside the function, I check if the token is valid.
If it is, I perform the write.
Because the function is "Admin," it ignores the RLS rules that usually block Guests.

**(5. The Result)**
I have a "Public" endpoint that acts like a "Private" one.
The GitHub Action can simply call the function (RPC).
It gets in, does its job, and gets out.
But it can't read anything else. It can't delete anything.

**Takeaway:**
Think of `SECURITY DEFINER` as a "Service Account" for your SQL functions.
It grants specific powers for specific tasks.

#Database #Postgres #Supabase #Security #Backend

---

## 5. 🧵 Twitter / X Thread (The Hook & Structure)

**(Tweet 1/8)**
I effectively hacked my own database today. 🔓
I needed to bypass my own security rules to allow a feature to work.

If you use Supabase RLS, you need to know about the `SECURITY DEFINER` trapdoor. 🧵👇

**(Tweet 2/8 - The Scenario)**
I have a "Pings" table.
Protected by RLS.
"Only the Owner can insert."

But my users use GitHub Actions to ping me.
Those scripts are "Anonymous." They are not logged in.
So RLS blocks them. 🛑

**(Tweet 3/8 - The Bad Fix)**
I could just allow "Anonymous Inserts."
But then a troll could script a loop and fill my DB with 1M junk rows.
I needed to validate an **API Token** first.

**(Tweet 4/8 - The Problem)**
RLS policies are great for "ID checks."
They are bad for complex logic like "Check if this token exists in another table and then allow write."

**(Tweet 5/8 - The Magic)**
Enter Postgres Functions.
Specifically: `SECURITY DEFINER`.

Detailed translation: "Run this function as if **I** (The Admin) ran it."

**(Tweet 6/8 - The Pattern)**
I wrote a function `handle_ping(token)`.
1. Check token validity.
2. If valid, INSERT.

Because the function runs as Admin, it ignores the RLS blockade.
It punches a tiny, secure hole through the wall.

**(Tweet 7/8 - The Warning)**
Be careful! ⚠️
`SECURITY DEFINER` is absolute power.
If you let a user pass in "Table Name" as an argument, they could delete your whole DB.
Always validate inputs strictly.

**(Tweet 8/8)**
I use this pattern for all my public webhooks now.
Here is the template.

(Link to CodeBite)
#Postgres #SQL #DevTips

---

## 6. 🧵 Threads (Meta) - The "Developer Chat" Vibe

**(Post 1/4)**
Database permissions are a headache. 🤕
I spent all morning trying to figure out how to let a GitHub Action write to my DB without giving it full Admin keys.

**(Post 2/4)**
The answer is `SECURITY DEFINER` in Postgres.
It's basically `sudo` for SQL functions.
It lets a Guest user execute a function with Admin privileges.

**(Post 3/4)**
So I wrote a function that checks an API token, and *only if valid*, performs the insert.
It bypasses all the Row Level Security rules safely.

**(Post 4/4)**
Feels powerful but scary. One typo and I could expose everything.
Do you use this pattern or do you just give your scripts a Service Key?
