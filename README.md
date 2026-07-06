# HealthyHoyas

**Live:** [healthy-hoyas.vercel.app](https://healthy-hoyas.vercel.app)

Nutrition tracking built specifically for Georgetown University dining halls. Students eat most meals at on-campus dining locations where nutrition information is scattered and hard to act on — HealthyHoyas turns the daily HoyaEats menus into a searchable, loggable food diary.

## Why this exists

Generic nutrition apps (MyFitnessPal et al.) fail on campus dining: the food isn't in their databases, portion labels don't match what's served, and manually entering a dining-hall meal takes longer than eating it. HealthyHoyas solves this by ingesting the actual daily menus for every Georgetown dining location, with per-item nutrition facts, so logging a meal is a two-tap flow from what's actually being served today.

## Ecosystem

This app is the front end of a three-part pipeline:

| Repo | Role |
|---|---|
| [scraper-hoyaeats](https://github.com/BrodieL3/scraper-hoyaeats) | Python scraper: collects daily menus + nutrition facts from HoyaEats across all dining locations, with a 700+ item nutrition cache, Unicode cleaning, and retry logic |
| [hoyaeats_api](https://github.com/BrodieL3/hoyaeats_api) | API layer serving scraped menu data |
| **this repo** | Next.js app: daily menus, food logging, nutrition dashboard |

## Stack

Next.js (App Router) · Supabase (Postgres, auth) · Tailwind CSS · Radix UI

## Development

```bash
npm install          # .npmrc sets legacy-peer-deps
cp .env.example .env # Supabase URL + keys
npm run dev
```
