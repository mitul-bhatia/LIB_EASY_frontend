## Frontend — LIB_EASY Web Client

### Overview
This Next.js 16 app is the user-facing portal for the LIB_EASY library management system. It offers:
- **Authentication pages** (`/signup`, `/signin`) connected to the Express API.
- **Responsive navigation bar** that adapts to auth state and exposes admin shortcuts.
- **User dashboard** with friendly copy for both guests and signed-in members.
- **Admin dashboard** stub for adding books (forms already wired to POST `/api/books/add`).
- **Books page** placeholder ready for catalog UI.

The design leans on Tailwind CSS, Radix primitives, and lucide icons, so it can evolve into a modern LMS interface with search, circulation stats, and patron self-service.

### Tech Stack
- `Next.js 16`, `React 19`, `App Router`
- `Tailwind CSS 3`, `tailwindcss-animate`, custom gradients
- `Axios` (with interceptors) for API calls
- `js-cookie` (available if client-side token access is ever needed)
- `AuthContext` for global user state + router redirects

### Project Structure
```
frontend/
├─ app/
│  ├─ layout.js           # Wraps pages with AuthProvider + NavBar
│  ├─ (root)/page.js      # Public dashboard hero text
│  ├─ signin/page.js
│  ├─ signup/page.js
│  ├─ dashboard/page.js   # Auth-aware dashboard screen
│  ├─ admin/dashboard/page.js
│  ├─ books/page.js
│  └─ globals.css
├─ components/
│  └─ NavBar.js
├─ context/
│  └─ AuthContext.js
├─ lib/
│  └─ axios.js            # Preconfigured Axios instance
└─ package.json
```

### Getting Started
1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```
2. **Environment variables**
   Create `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```
   This should match whatever host/port your Express server exposes.
3. **Run the dev server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000`.

### Authentication Flow (Frontend Perspective)
- `AuthContext` exposes `signup`, `signin`, `logout`, and current `user`.
- Each action calls the backend via `lib/axios.js`, which is configured with `withCredentials: true` so the HTTP-only cookie set by the server is preserved.
- Upon success, the router navigates to `/`.
- The Axios interceptor automatically retries once when an API call returns `401` (ideal once the backend exposes `/auth/refresh`).

### Pages & UX Notes
- **`/signup`** – collects name, email, password, role (default USER). Supports ADMIN selection for staff onboarding.
- **`/signin`** – upgraded UI with gradient background and copywriting.
- **`/dashboard`** – communicates different states for guests vs members, nudging sign-in or admin actions.
- **`/admin/dashboard`** – includes a book intake form (title, author, ISBN, categories, cover URL). API endpoint needs to exist before it will succeed.
- **`/books`** – placeholder (“coming soon”) ready for catalog cards or search filters.

### Styling & Components
- Tailwind configured in `tailwind.config.js` with extended color palette for both light/dark surfaces typical in LMS kiosks.
- `NavBar` pins to the top, showing auth actions on the right and a Books link on the left.

### Suggested Enhancements (Based on Library UX Research)
- **Catalog search & filters** (author, genre, availability) with instant feedback.
- **Borrowing workflow**: show active loans, due dates, ability to renew or reserve titles.
- **Responsive typography** for kiosk displays (tablet/desktop).
- **Accessibility**: ensure color contrast, keyboard navigation, ARIA labels for form controls.
- **Analytics widgets** (top borrowed books, new arrivals) for admin dashboards.

### Scripts
| Script | Description |
| --- | --- |
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Start built app |
| `npm run lint` | Run ESLint |

### Testing Ideas
- Add React Testing Library tests for `AuthContext` and form flows.
- E2E coverage with Playwright or Cypress for signup/login navigation.

Keep this README updated as you flesh out catalog, circulation, and analytics features. With the current scaffold, you can rapidly prototype the core scenarios librarians and patrons expect from a modern library management portal.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
