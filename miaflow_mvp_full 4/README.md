# MiaFlow Full MVP

This is a full front-end MVP for MiaFlow, a safety-first AI operations dashboard for small businesses.

## Included

- Landing page
- Formspree waitlist form
- About page
- Support page
- Internships page
- Dashboard demo
- CSV upload
- Product performance table
- Inventory Recommendation Agent
- Daily Summary Agent
- Marketing Suggestion Agent
- Phone Order Draft Agent
- Approval queue
- Activity log

The agents are rule-based so the MVP works without paid OpenAI tokens. You can later connect OpenAI, Activepieces, n8n, or Supabase.

## Run locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

Dashboard:

```text
http://localhost:3000/dashboard
```

## Deploy to Vercel

1. Upload this folder to GitHub.
2. Import the repo into Vercel.
3. Framework preset: Next.js.
4. Build command: default.
5. Output directory: blank.
6. Deploy.

## Waitlist

The landing page posts to Formspree:

```text
https://formspree.io/f/meedayyg
```

Submissions show in your Formspree dashboard.

## CSV format

Required columns:

```text
date,product,quantity_sold,revenue
```

Optional columns:

```text
category,inventory_on_hand
```

Sample data is in:

```text
sample-data/bakery-sales-sample.csv
```


## Internship application form

The Internships page now includes a working application form.

By default, it submits to the same Formspree endpoint as the waitlist:

```text
https://formspree.io/f/meedayyg
```

To use a separate Formspree form for internships, add this environment variable in Vercel:

```env
NEXT_PUBLIC_INTERNSHIP_FORMSPREE_ENDPOINT=https://formspree.io/f/your-internship-form-id
```

If this variable is not set, the form will use `NEXT_PUBLIC_FORMSPREE_ENDPOINT` or the hardcoded MiaFlow endpoint.
