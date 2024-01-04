# nextjs-14-course

### 0. Prerequisites  


node v18

Github account

_Optional: Intellij plugin: React Buddy_  
https://plugins.jetbrains.com/plugin/17467-react-buddy  
https://www.youtube.com/watch?v=YIq1uYLjC2s

_Optional: Intellij plugin: Prisma ORM_  
https://plugins.jetbrains.com/plugin/20686-prisma-orm

_Optional: Chrome plugin: React Dev Tools_  
https://react.dev/learn/react-developer-tools  
Chrome: https://chromewebstore.google.com/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en

### 1. Init with npx create-next-app

```bash
npx create-next-app nextjs-14-course

#✔ Would you like to use TypeScript? … Yes
#✔ Would you like to use ESLint? … No 
#✔ Would you like to use Tailwind CSS? … No 
#✔ Would you like to use `src/` directory? … No 
#✔ Would you like to use App Router? (recommended) …  Yes
#✔ Would you like to customize the default import alias (@/*)? … No
```

Start app
```npm run dev``` http://localhost:3000/

Delete boilerplate from files:
[page.tsx](app%2Fpage.tsx) and [globals.css](app%2Fglobals.css)

### 2. Navbar

Create [NavMenu.tsx](app%2FNavMenu.tsx)
and add it to [layout.tsx](app%2Flayout.tsx)

### 3. Static page

[about/page.tsx](app%2Fabout%2Fpage.tsx)

http://localhost:3000/about

Forcing caching:
```tsx
export const dynamic = 'force-static';
```

Adding metadata
```tsx
export const metadata: Metadata = {
    title: 'About us',
    description: 'We are social media company',
};
```

### 4. API Route

[api/content/route.ts](app%2Fapi%2Fcontent%2Froute.ts)

http://localhost:3000/api/content

```ts
export async function GET() {
    return NextResponse.json(posts);
}
```
