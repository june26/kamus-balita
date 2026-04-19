# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server (Next.js)
npm run build    # production build
npm run lint     # ESLint
```

No test suite is configured.

## Project Overview

**Kamus Upay** — a personal toddler dictionary web app. A parent records words invented by a child named "Upay" and their meanings. All UI text is in Indonesian (Bahasa Indonesia).

## Architecture

**Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Firebase (Auth + Firestore), shadcn/ui, Framer Motion, Sonner toasts.

**Auth flow:** Firebase email/password auth. `MainWrapper` listens to `onAuthStateChanged` — shows `LoginModal` (Dialog) when logged out, `WordContainer` when logged in. Words are scoped per user via `userId` field.

**Data flow:** Firestore collection `words` with fields `{ toddler, meaning, userId, createdAt }`. `subscribeWords(uid, callback)` in `helper/subscribeWords.ts` sets up a real-time `onSnapshot` listener filtered by `userId`, ordered by `createdAt desc`. `WordContainer` holds the live word list state and passes items to `WordCard`.

**WordCard interaction:** Cards use Framer Motion `drag="x"` — swiping left reveals edit (blue) and delete (red) action buttons hidden behind the card. Both actions open confirmation/edit Dialogs.

**Firebase config:** Initialized once in `lib/firebase.ts` using `NEXT_PUBLIC_FIREBASE_*` env vars. Exports `db` (Firestore) and `auth`.

**UI components:** shadcn/ui lives in `app/components/ui/`. `helper/pastelText.tsx` renders each character of a string in cycling pastel Tailwind colors.

## Environment

Requires a `.env` file with:
```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
```
