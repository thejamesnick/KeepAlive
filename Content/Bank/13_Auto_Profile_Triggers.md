# 🏁 Content Unit: Auto-Profile Triggers

## 1. 📝 The DevLog (Deep Dive)
**Title:** Why I Stopped Creating Users in My Frontend Code

### 1. Context: The Dual-Table Problem
In Supabase (and many backend-as-a-service platforms), User Duality is a common pattern.
1.  **Auth Table:** Managed by Supabase (secure, hidden, handles passwords).
2.  **Public Profiles Table:** Managed by Me (public, contains avatar, display name, credits).

Every time a user signs up, I need to create a row in the `public.profiles` table. They must exist in lockstep.

### 2. The Spark: The "Ghost" User
My original code was standard React:
```javascript
// Signup.tsx
await supabase.auth.signUp({ email, password });
// Then...
await supabase.from('profiles').insert({ email });
```
One day, I looked at my analytics.
I had 105 Users in Auth.
I had 102 Profiles in Public.
**Three users were ghosts.** They could log in, but the app crashed immediately because it tried to load a profile that didn't exist.

### 3. The Investigation: The Network Gap
Why did it fail?
Maybe the user closed the browser tab immediately after hitting "Signup"?
Maybe their WiFi cut out during the 200ms between Request A and Request B?
Maybe the client crashed?

**The Trap:**
I was relying on the **Client (Browser)** to coordinate a transaction.
The Browser is an unreliable narrator. You cannot trust it to finish a job.
If data *must* exist together, it must be created together.

### 4. The Vision: Atomic Creation
I realized this logic didn't belong in React. It belonged in the Database.
I needed a "Trigger."
A Trigger is a piece of code that lives in Postgres and says:
"Hey, whenever a new row is inserted into `auth.users`, **immediately** run this function to insert a row into `public.profiles`."

This happens inside the database transaction. It is **Atomic**.
It is physically impossible for a user to exist without a profile.

### 5. The Fix: The PL/pgSQL Function
I wrote a simple SQL snippets.

**Part 1: The Handler**
A function `handle_new_user()` that takes the `new` user data and inserts it into profiles.

**Part 2: The Trigger**
A directive that binds that function to the `auth.users` table.

Now, my frontend code is just:
`await supabase.auth.signUp()`.
That's it. The database handles the housekeeping.

### 6. The Takeaway
Move your business logic as close to the data as possible.
If logic lives in the Frontend, it is a "Suggestion."
If logic lives in the Database, it is a "Law."
For data integrity (Credits, Profiles, Inventory), always use Laws.

---

## 2. 📡 The BIP (Build In Public)

**Anchor:**
Refactoring the onboarding flow.

**Pulse:**
Deleted 50 lines of React code today.
I removed the manual "Create Profile" call from the frontend.
Moved it to a Postgres Trigger.

**Signal:**
I found out that ~3% of my users were broken "Ghosts" because the client-side profile creation failed.
By moving it to the DB, consistency is now 100%.
Always bet on value moving down the stack.

**Direction:**
The system is now atomic.
No more "Profile Not Found" errors. Ever.

---

## 3. 🍿 The CodeBite (Snippet)

**Headline:** Stop Creating Profiles in React! 🛑

**Challenge:**
You sign up a user, but their "Profile" row creation fails (network error/tab close), leaving them in a broken state.

**Hint:**
Use a Postgres Trigger to automate it server-side.

**Snippet:**
```sql
-- 1. Create the Function
create function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- 2. Create the Trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

**Mini Lesson:**
This runs *inside* the Postgres transaction. It guarantees that if a User exists, a Profile exists. Zero latency. Zero network risk.

---

## 4. 🔗 Social Media (LinkedIn Long Form)

**Headline:** The "Unreliable Narrator" in your Codebase.

**(1. The Hook)**
I had a bug where 3% of my users were "Ghosts."
They existed in the Auth system.
But they had no data in the App.
They were broken from birth.

**(2. The Cause)**
I was running a two-step process on the Client:
1. `User Signs Up` (Network Request 1)
2. `App Creates Profile` (Network Request 2)

If the user closed the tab, lost signal, or crashed between Step 1 and Step 2...
The user was created, but the profile wasn't.
The chain was broken.

**(3. The Philosophy)**
The Frontend is an "Unreliable Narrator."
You cannot trust the browser to finish a sequence of events.
It is volatile.

**(4. The Solution)**
I moved the logic to the **Database**.
I used a **Postgres Trigger**.
Now, the moment the User row is written to the disk, the Database *itself* wakes up and writes the Profile row.
It is one atomic transaction.
It cannot be interrupted by a closed tab.

**(5. The Result)**
My code is smaller (deleted the frontend logic).
My data is cleaner (0% ghosts).
My app is faster (1 less network round trip).

**Takeaway:**
For critical data links, don't trust the client.
Let the database do the work.

#Postgres #Supabase #Architecture #Backend #WebDev

---

## 5. 🧵 Twitter / X Thread (The Hook & Structure)

**(Tweet 1/8)**
I deleted 50 lines of code and fixed my biggest bug. 🗑️

3% of my users were "Ghosts" (Broken profiles).
The fix wasn't better React code.
The fix was SQL. 🧵👇

**(Tweet 2/8 - The Pattern)**
We all do this:
`const onSignup = async () => {`
`  await auth.signup();`
`  await db.createProfile();`
`}`

This looks fine.
It is not fine.

**(Tweet 3/8 - The Crash)**
What if the user closes the tab after line 2?
What if the train goes into a tunnel?
What if the battery dies?

`auth.signup()` succeeded.
`db.createProfile()` never happened.

You now have a user who can log in, but has no profile.
A zombie. 🧟‍♂️

**(Tweet 4/8 - The Fix)**
Don't coordinate this on the client.
Coordinate it in the Database.

Use a **Trigger**.

**(Tweet 5/8 - How it works)**
Postgres listens. 👂
"When a row is added to the USERS table..."
"...Automatically add a row to the PROFILES table."

**(Tweet 6/8 - The Benefits)**
1. **Atomic:** Either both happen, or neither happens.
2. **Fast:** Zero network latency. It happens on the metal.
3. **Simple:** Your frontend code becomes just `auth.signup()`.

**(Tweet 7/8 - The Code)**
You need a `plpgsql` function and a `trigger` definition.
It sounds scary, but it's boilerplate.

**(Tweet 8/8)**
Here is the exact SQL snippet I used.
Copy-paste it into your Supabase SQL editor.
Stop creating ghosts.

(Link to CodeBite)
#SQL #Postgres #Supabase

---

## 6. 🧵 Threads (Meta) - The "Developer Chat" Vibe

**(Post 1/4)**
The moment you realize you can replace 50 lines of fragile Typescript with 5 lines of solid SQL... 🤯
Triggers are under-rated.

**(Post 2/4)**
I was manually creating user profiles in my frontend `useEffect`.
So many edge cases. What if they close the tab? What if it errors?

**(Post 3/4)**
Moved it to a Postgres Trigger.
Now the database just does it automatically whenever a user signs up.
I sleep better knowing my data integrity isn't dependent on Chrome remaining open.

**(Post 4/4)**
Are you Team "Logic in App" or Team "Logic in DB"?
I'm shifting hard to DB lately.
