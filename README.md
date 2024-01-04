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

### 11.. Setup Auth.js with Prisma

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
