<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Session Summary — Session 4: Gear 5 Reveal Landing Page + API Self-Containment

### What was accomplished

**1. Landing Page Redesign (Gear 5 Reveal Theme)**
- Extracted original `luffy-gear5.jpg` (106KB) and `luffy-base.jpg` (80KB) from a reference Gear 5 reveal HTML page and saved them to `/public/images/`
- Replaced the "Grounded Will" ACT I section with a full Gear 5 reveal hero matching the reference design:
  - Gold "One Piece" logo (Luckiest Guy font) with "GEAR 5 · AWAKENING" tag
  - Left panel: "Straw Hat Pirates" eyebrow + "MONKEY D. LUFFY" title + description + "Set Sail" button (gold bordered with slide-in hover effect)
  - Right panel: "Joy Boy Awakened" eyebrow + "GEAR FIVE" title + description
  - Bottom hint: "▸ MOVE ACROSS TO AWAKEN GEAR 5 ◂"
  - Top gradient border (gold → red → gold)
- Updated `HeroCanvas.tsx` to match the reference canvas effect (glow colors, `source-atop` overlay on mask)
- Removed unused `VibeCodeHero` imports and dead code

**2. API Self-Containment**
- All API routes now self-contained (no external dependencies):
  - `/api/cart*` — full cart CRUD with in-memory store
  - `/api/auth/*` — register, login, logout, refresh, sessions, forgot/reset password
  - `/api/orders*` — create, list, view, mock-payment, Razorpay intent/verify
  - `/api/analytics/dashboard` — hardcoded dashboard metrics
  - `/api/products*` — static product catalog with cached results
- Removed all `axios` baseURL and `localhost:4000` references
- Auth routes no longer call external backend

**3. Image Restoration**
- Restored `luffy-gear5.jpg` from git after accidental overwrite by gear5.png
- Added missing product images via base64 extraction
- HeroCanvas now uses `luffy-gear5.jpg` (background) + `luffy-base.jpg` (reveal layer)

### Key files changed
- `src/app/page.tsx` — redesigned hero section
- `src/components/HeroCanvas.tsx` — canvas effect refined
- `public/images/luffy-gear5.jpg` — extracted from base64
- `public/images/luffy-base.jpg` — extracted from base64
- `src/app/api/auth/register/route.ts` — self-contained auth
- Various `src/app/api/` routes — self-contained CRUD
