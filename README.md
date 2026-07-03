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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to load Inter Tight, Onest and Caveat (cyrillic subsets).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deployment

Live at **https://vladlyamin.ru**, self-hosted on a Timeweb VPS (region
Novosibirsk). **Not Vercel** — Vercel is blocked in Russia, so the old
`lvmn.vercel.app` deployment is retired.

- **Server**: `5.42.111.39`, Ubuntu 24.04, Node 20, pm2 (`lvmn`), nginx + certbot SSL.
- **Code**: `/var/www/lvmn-site`. **Secrets**: `/var/www/lvmn-site/.env.local`.
- **Crons**: system crontab (UTC) via `scripts/cron-runner.sh`, not Vercel Cron.

Deploy an update from this folder:

```bash
rsync -az --exclude node_modules --exclude .next --exclude .git \
  ./ root@5.42.111.39:/var/www/lvmn-site/
ssh root@5.42.111.39 'cd /var/www/lvmn-site \
  && NODE_OPTIONS="--max-old-space-size=2048" npm run build \
  && pm2 restart lvmn --update-env'
```

See `CLAUDE.md` → Deployment for full details.
