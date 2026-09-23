This is a Next.js job portal with a MySQL + Sequelize authentication backend.

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:


You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Authentication setup

1. Open XAMPP Control Panel and start **Apache** and **MySQL**.
2. In phpMyAdmin (`http://localhost/phpmyadmin`), import `database.sql` or run its SQL to create `job_portal`.
3. Copy `.env.example` to `.env.local`. The default XAMPP connection assumes MySQL user `root` with no password; update `DATABASE_URL` if your XAMPP password is different. Set a long random `JWT_SECRET`.
4. Install dependencies and start the app:

```bash
npm install
npm run dev
```

The first register or login request connects to MySQL and creates the `users` table through Sequelize.

To seed one account for each role, run this once after MySQL is started:

```bash
npm run db:seed
```

The seed uses the `SEED_*` values from `.env.local`, or local-only defaults from `.env.example`. Change those passwords before sharing the environment.

Available roles are:

- `user`: job seeker
- `admin`: company administrator
- `superadmin`: reserved privileged role; it is never accepted from public registration

The public registration page and `/api/auth/register` create job seeker (`user`) accounts only. Company admins and superadmins must be provisioned through a protected admin flow. Login is available at `/api/auth/login` with `email` and `password`. A successful request sets an httpOnly `hirepath_session` JWT cookie.
