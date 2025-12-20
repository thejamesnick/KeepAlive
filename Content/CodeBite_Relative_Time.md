## CodeBite #01: Relative Time Formatter in TypeScript

### 1. Challenge
Displaying "Just now" or "5 mins ago" instead of a raw timestamp is a must for dashboards.

### 2. Hint
Don't pull in a heavy library like Moment.js for simple logic. Use `Math.floor` and some subtraction.

### 3. Code Snippet
```typescript
function formatRelativeTime(dateString: string | null) {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
}
```

### 4. Mini Lesson
Doing this client-side ensures the user sees the time relative to *their* current moment, not when the server rendered the page. Plus, it's zero dependencies.
