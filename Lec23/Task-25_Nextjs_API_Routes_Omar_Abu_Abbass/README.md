# My Blog - Next.js Full Stack Application

## Project Explanation

A full-stack Blog application built with **Next.js App Router** featuring:

- **Server-Side Rendering (SSR)** — Pages are rendered on the server for every request, ensuring fresh data and better SEO.
- **Dynamic Routing** — Each blog post has its own page using `/posts/[id]` with dynamic metadata.
- **Route Handlers (API)** — Custom REST API built inside `/api/posts` supporting GET, POST, and DELETE operations.
- **Client Components** — The "Create Post" page uses React state and form handling.
- **Error & Loading Boundaries** — Built-in `error.js` and `loading.js` for better user experience.

## Screenshot

![Blog Home Page](screenshot.png)

## Features Implemented

- [x] Next.js App Router
- [x] SSR with `cache: "no-store"` (Home page & Post detail page)
- [x] Dynamic routing `/posts/[id]`
- [x] `generateMetadata` for dynamic SEO (title & description)
- [x] API Route Handlers — `GET /api/posts`, `POST /api/posts`, `DELETE /api/posts?id=`
- [x] Home page fetches from `/api/posts` using SSR
- [x] Create Post page (`/create`) — Client Component with form
- [x] Delete post endpoint (Bonus)
- [x] `loading.js` (Bonus)
- [x] `error.js` (Bonus)
- [x] Clean styling (Bonus)

## Tech Stack

- Next.js 16
- React 19
- App Router
- CSS (no external libraries)

## How to Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment Link

Live on Vercel: [https://your-app-name.vercel.app](https://your-app-name.vercel.app)

## GitHub Repository

[https://github.com/your-username/blog](https://github.com/your-username/blog)
