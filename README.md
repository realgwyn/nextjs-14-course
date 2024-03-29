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

### 8. Redirecting to login page

[dashboard/page.tsx](app%2Fdashboard%2Fpage.tsx):
```ts
import {auth} from "@/app/auth";
import {redirect} from "next/navigation";

const session = await auth();
if(!session) {
redirect('/api/auth/signin')
}
```

**DEMO:** http://localhost:3000/dashboard

### 9. External database setup

Go to and create account https://console.neon.tech/ Choose region: `europe`

Go to dashboard and create role: `admin`,

Create database name: `sandbox`, owner: `admin`

Create another database name: `shadow`, owner: `admin`

Copy connection strings of `sandbox` and `shadow` and Add connection strings to `.env`:
```env
...
DATABASE_URL=postgresql://USERNAME:PASSWORD@ep-still-waterfall-******.eu-central-1.aws.neon.tech/sandbox?sslmode=require
SHADOW_DATABASE_URL=postgresql://USERNAME:PASSWORD@ep-still-waterfall-*******.eu-central-1.aws.neon.tech/shadow?sslmode=require
...
```

### 10. Setup Prisma ORM

```bash
npx prisma init
```

Open [prisma/schema.prisma](myspace%2Fprisma%2Fschema.prisma) and add:
```js
shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
```

_Tip: Intellij install Prisma ORM plugin_

### 11. Setup Auth.js with Prisma

https://authjs.dev/reference/adapter/prisma

Run command:
```bash
npm install @prisma/client @auth/prisma-adapter
```

Add prisma adapter to [auth.ts](app%2Fauth.ts):
```ts
import NextAuth from "next-auth"
import GithubProvider from 'next-auth/providers/github';
import {PrismaAdapter} from "@auth/prisma-adapter";
import {PrismaClient} from "@prisma/client";

export const prisma = new PrismaClient();

export const authOptions  = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
    ],
    adapter: PrismaAdapter(prisma),
};

export const { handlers: { GET, POST }, auth,} = NextAuth(authOptions);
```

Paste Auth.js schema to `schema.prisma`
```prisma
// Auth.js Schema

model Account {
  id                 String  @id @default(cuid())
  userId             String
  type               String
  provider           String
  providerAccountId  String
  refresh_token      String?  @db.Text
  access_token       String?  @db.Text
  expires_at         Int?
  token_type         String?
  scope              String?
  id_token           String?  @db.Text
  session_state      String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

```

Configure database to use new schema:
```bash
npx prisma migrate dev
```

```bash
$> npx prisma migrate dev

Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "sandbox", schema "public" at "ep-still-waterfall-85718213.eu-central-1.aws.neon.tech"

✔ Enter a name for the new migration: … init-authjs
Applying migration `20240103090427_init_authjs`

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20240103090427_init_authjs/
    └─ migration.sql

Your database is now in sync with your schema.
```

**DEMO TIME - login and check if session is persisted in the database** 

Start app
```bash
npx run dev
```
Click login button, login with github account

Next go to https://console.neon.tech/ dashboard and check if session exists

![screenshots/prisma1.png](screenshots/prisma1.png)

### 12. Prisma: schema migration

Add two new fields `bio` and `age` in [prisma/schema.prisma](myspace%2Fprisma%2Fschema.prisma)
```prisma

model User {
...
  bio           String?   @db.Text
  age           Int?
...
```

Run migration command:
```bash
npx prisma migrate dev
```

**DEMO:** Check if new columns are present in user table:
![screenshots/prisma2.png](screenshots/prisma2.png)


### 13. Prisma: Accessing database in Routes

Generate prisma client:
```bash
npx prisma generate
```

Export global prisma client [lib/prisma.ts](lib%2Fprisma.ts)
```js
import { PrismaClient } from '@prisma/client'
export const prisma = new PrismaClient()
```

Create new api route for users [route.ts](app%2Fapi%2Fusers%2Froute.ts)
```ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from "next/server";

export async function GET(request: Request){
    const users = await prisma.user.findMany();
    console.log(users)
    return NextResponse.json(users);
}
```

**DEMO:** http://localhost:3000/api/users

### 14. Prisma: Accessing database in server components

Create [components/UserCard.tsx](components%2FUserCard.tsx) and add it to [users/page.tsx](app%2Fusers%2Fpage.tsx)

**DEMO:** http://localhost:3000/users

### 15. Prisma: Accessing database in dynamic Routes

[users/[id]/page.tsx](app%2Fusers%2F%5Bid%5D%2Fpage.tsx)

Simple query with prisma:
```ts
export default async function UserProfile({params}: Props) {
    const user = await prisma.user.findUnique({
        where: {
            id: params.id
        }
    });
    //...
}
```

**DEMO:** http://localhost:3000/users and click on username to go to user's profile page

### 16. Showing loading state

Create [users/loading.tsx](app%2Fusers%2Floading.tsx)

```tsx
export default function LoadingUsers() {
    return <div>Loading users list...</div>
}
```

### 17. Error handling and error recovery

Create buggy _client component_ page [buggy-page/page.tsx](app%2Fbuggy-page%2Fpage.tsx)

```tsx
'use client' // <-- RESET WORKS ONLY ON CLIENT COMPONENTS

export default function BuggyPage() {
    if(Math.random() < 0.5){
        console.log("time to fail!")
        throw new Error("server unavailable")
    }
    return (
        <div>
            This page fails from time to time, <a href={'/buggy-page'}>refresh</a> it few times to see the error.
        </div>
    );
}
```

Create custom error page [buggy-page/error.tsx](app%2Fbuggy-page%2Ferror.tsx)
```tsx
'use client'

import {useEffect} from "react";

export default function Error({error, reset}: { error: Error; reset: () => void; }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div>
            <h2>Something went wrong!</h2>
            <p>{error.message}</p>
            <button onClick={reset}>Click this button to retry</button>
        </div>
    );
}
```

**DEMO:** http://localhost:3000/buggy-page

### 18. Form submission

Create [dashboard/ProfileForm.tsx](app%2Fdashboard%2FProfileForm.tsx) and add it to [dashboard/page.tsx](app%2Fdashboard%2Fpage.tsx)

Create API Route [api/user/route.ts](app%2Fapi%2Fuser%2Froute.ts)

**DEMO:** http://localhost:3000/dashboard modify data and click 'Save' button

### 19. Prisma: Relation table

Add new table `Follows` and relation in `User` table in [schema.prisma](myspace%2Fprisma%2Fschema.prisma):
```prisma

model User {
  //...
  followedBy    Follows[] @relation("following")
  following     Follows[] @relation("follower")
  //...
}

model Follows {
  follower    User   @relation("follower", fields: [followerId], references: [id])
  followerId  String
  following   User   @relation("following", fields: [followingId], references: [id])
  followingId String

  @@id([followerId, followingId])
}
```

Run schema migration
```bash
npx prisma migrate dev
```

### 20. Follow user feature

Create API Route [follow/route.tsx](app%2Fapi%2Ffollow%2Froute.tsx)  
Create Server Component: [components/FollowButton.tsx](components%2FFollowButton.tsx) and Client Component: [components/FollowClient.tsx](components%2FFollowClient.tsx)  
Follow button used in user profile page: [users/[id]/page.tsx](app%2Fusers%2F%5Bid%5D%2Fpage.tsx)  

**DEMO:** Go to http://localhost:3000/users, open user's profile, click 'Follow' button

### 21. Deploy on Vercel

Create production build to check for any errors
```bash
npm run build
```

**Install [Vercel CLI](https://vercel.com/docs/cli) for dry-running builds locally**  

```bash
pnpm i -g vercel
```


Add missing dependencies to [package.json](package.json)
```bash
npm install prisma #duh
```

Add `vercel-build` and `postinstall` scripts to [package.json](package.json) which will be used by Vercel deployment
```json
{
    "scripts": {
      ...
      "vercel-build": "prisma generate && prisma migrate deploy && next build",
      "prisma:generate": "prisma generate",
      "postinstall": "prisma generate",
    }
}
```

Go to https://vercel.com/ and import project from your github repo
![vercel1.png](screenshots%2Fvercel1.png)

![vercel2.png](screenshots%2Fvercel2.png)

Allow Vercel integration with your project, choose option `only select repositories` and choose your nextjs project

![vercel3.png](screenshots%2Fvercel3.png)

Next, go to your imported project  `.../settings/environment-variables`
![vercel4.1.png](screenshots%2Fvercel4.1.png)

And add entries from your local `.env` file
![vercel4.png](screenshots%2Fvercel4.png)

**Finaly add a separate database for preview deployments**  
Go to https://console.neon.tech/app/projects and create 3rd database `sandbox-vercel`, copy its connection string
and add it to your Vercel project Settings Environment Variable for `preview` environment

![vercel5.png](screenshots%2Fvercel5.png)

_Vercel uses the DATABASE_URL environment variable you define when you import the project for both the production and preview environments. This causes problems if you create a pull request with a database schema migration because the pull request will change the schema of the production database._


Dry-run vercel build locally
```bash
vercel build
```

