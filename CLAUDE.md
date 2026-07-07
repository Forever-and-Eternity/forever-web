# CLAUDE.md — forever-web (Lumora frontend)

Read this before making any change. These rules are mandatory for every task.

## Product

- Lumora ("Preserve what matters") — private family memory spaces. This is the frontend: Next.js App Router, React, TypeScript.
- Copy voice: warm, plain English, never corporate or flowery. Test: "would a real dad say this?"
- Brand (Halo): ink #141126, dusk #1E1B33, plum #3A2E4F, gold #E5B76A, apricot #E8A87C, pale gold #F2D9A4, ivory #F7F3EB. Lowercase serif "lumora" wordmark. Ink wordmark on light surfaces; ivory only on dusk backgrounds.

## Responsive — non-negotiable

- Every screen, dialog, popup and overlay MUST work at 390px mobile AND 1280px + 1440px desktop before it is called done.
- Interactive controls (close buttons, ESC hints, FABs) must NEVER overlap each other or content at any width.
- Keyboard hints (ESC etc.) hidden on touch devices. Touch targets minimum 44px on mobile.
- No horizontal scrolling at 390px, ever. No text clipped or hidden behind sidebars or navs at common widths.
- Dialogs need safe margins on small screens.
- Evidence required: screenshots at both breakpoints for every UI change.

## Code style

- TypeScript strict. Follow the existing folder structure and naming conventions — match neighbouring files exactly.
- Match existing formatting; do not reformat unrelated code. No new UI libraries without asking first.
- Nav parity: anything in the mobile bottom bar must also be in the desktop top bar, and vice versa.

## Safety

- Never delete or destructively migrate user data. Additive changes only.
- Both production URLs must always keep working: lumora.app and forever-web.replit.app.
