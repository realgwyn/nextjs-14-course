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

### 5. Dynamic Routes (SSR - Server-Side-Rendering)

[blog/[slug]/page.tsx](app%2Fblog%2F%5Bslug%5D%2Fpage.tsx)

disable caching:
```ts
export const dynamic = 'force-dynamic'
 ```
or use revalidate cache period
```ts
export const revalidate = 69;
```

http://localhost:3000/blog/lorem-ipsum

### 6. Authentication with Auth.js

Install auth.js https://authjs.dev/
```bash
# beta is for nextjs v14
npm install next-auth@beta 
```

Create `.env` file and **add it to .gitignore**
```bash
touch .env
```

Generate key https://generate-secret.vercel.app/32 and save it into `.env` file: 
```properties
AUTH_SECRET=<your-secret-key>
```

Option 1: Authenticate using Github provider 


Login to your github https://github.com/ account, go to developer settings https://github.com/settings/developers  
and register new application:
![authjs1.png](screenshots/authjs1.png)

Click button `Generate a new client secret`

Copy application id and secret token and ...
![authjs2.png](screenshots/authjs2.png)
... add it into .env file:
```properties
GITHUB_ID=<client id>
GITHUB_SECRET=<client secret>
```

Step 1: create [auth.ts](app%2Fauth.ts):
```ts
import NextAuth from "next-auth"
import GithubProvider from 'next-auth/providers/github';


export const authOptions  = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
    ],
};

export const { handlers: { GET, POST }, auth,} = NextAuth(authOptions);
```

Step 2: create dynamic API route for auth.js [api/[...nextauth]/route.ts](app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts)

Step 3: Accessing session in [page.tsx](app%2Fpage.tsx):
```ts
const session = await auth();
if(session){
    console.log(`Hello ${session?.user.name}`);
}
```

**DEMO:**  

Start the app
```bash
 npm run dev
```


Go to http://localhost:3000/api/auth/signin to test login with github provider
Sign out with http://localhost:3000/api/auth/signout

### 7. Login buttons, accessing session on client and server side

Create [AuthProvider.tsx](app%2FAuthProvider.tsx), wrap [layout.tsx](app%2Flayout.tsx) with it

Create button components [components/buttons.tsx](components%2Fbuttons.tsx) add them to [NavMenu.tsx](app%2FNavMenu.tsx)

Fix  [next.config.js](next.config.js) to properly load github avatars
