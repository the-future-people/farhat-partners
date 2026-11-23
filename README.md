# Farhat Trade Partners

The portal for Farhat's trade partners, at **partners.farhatprintingpress.com**:
registration (with a password, confirmed by a code to the phone), log in,
the dashboard and sending jobs at the trade price. The API is Octos
(`apps/partners`, `/api/v1/partners/`).

```
npm install
npm run dev      # http://localhost:5185
npm run build
```

Set `VITE_API_URL` on Vercel only if Octos moves; it defaults to the live API.
