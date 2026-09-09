# Alien Farmers Conversation Center — local preview

This is an isolated, working preview of the customer Conversation Center and a unified Operations workspace. It does not connect to production Supabase, an AI API, Website, Verify, delivery services, or staff authentication. It is not a deployed application.

The visitor route now contains five shared-shell mock conversations: **AF AI Assistant**, **Customer Support**, **Delivery Assistant**, **Feedback Assistant**, and **Wholesale Assistant**. Feedback carries the future channel `feedback_private` and `visibility: ['owner', 'admin']` in local configuration only. The wholesale guide keeps its five-step inquiry entirely in browser state and does not submit contact details anywhere.

Conversation Center state is stored under `af-conversation-center:v1` in `localStorage`. It contains each channel's messages, unread count, updated time, draft, conversation status and optional wholesale inquiry, plus the last-opened conversation and simulated staff availability. **Reset Demo Data** is rendered only in development builds.

## Conversation Center

The visitor screen fills the viewport with a compact conversation list and one shared chat shell. Desktop keeps the list beside the active conversation. Mobile opens on the list, moves into a conversation, and returns with a Back button. The composer accounts for the device safe area and uses dynamic viewport height.

AI answers use the local `mockIntentMatcher`; delivery responses and order references are fixed examples; support availability and staff replies are simulated; feedback never leaves the browser; wholesale inquiry answers are stored only on this device. No assistant calls an LLM or external service.

## Operations preview

The `/ops` route is now a multi-channel Inbox for all five assistants. It includes All / Waiting / Private filters, role previews, staff replies, close/reopen controls, channel routing details, and a responsive list-to-chat layout. Staff cannot see `feedback_private`; Owner and Admin can. This is a client-side permission preview, not production authorization.

The **Automation & Knowledge** page at `/ops/settings` edits multilingual quick replies, welcome/away rules and keyword knowledge articles. Articles support direct answers, clickable choices, or a customer-order lookup. Its current configuration is stored under `af-ops-automation:v1` in `localStorage`; the UI clearly marks that these editable rules are not yet connected to the new assistant conversations.

`preview_context` and `preview_settings` are local-only tables. They are not production customer, order, cart or authentication implementations. Product recognition uses an exact allowlist and never fetches arbitrary URLs. Staff settings are excluded from visitor snapshots. User-authored conversation and knowledge content is retained in its original language; selecting an interface language does not machine-translate messages.

Six backend test groups cover persistence, ownership, settings permissions, locale-aware automation, duplicate sends and product-link recognition. Browser checks covered sample login, order/product sharing, originating page display, saved quick-reply editing/insertion, and language/theme switching. Responsive checks use phone-sized frames, not a physical device or mobile keyboard.

## Open it

From this directory, use Node 24 and run:

```text
node scripts/dev.mjs
```

- Conversation Center: http://localhost:5173/
- Operations Inbox: http://localhost:5173/ops

On this computer, the parent folder's `START_PREVIEW.cmd` starts both services. Keep the terminal open. If a preview is already running, use its URLs instead of starting a second copy. Services bind to loopback only; do not expose them via a tunnel.

The Conversation Center and unified Inbox share `af-conversation-center:v1` in the same browser. A visitor message appears in another open Operations tab through the browser storage event. This is local-tab synchronization only, not Realtime or message delivery.

## What works in the Conversation Center

- Five configuration-driven assistants rendered through shared list, header, message, quick-reply and composer components.
- Local intent matching, mock typing indicators, timestamps, unread counts and per-conversation drafts.
- Mock online/offline support, delivery choices, private feedback acknowledgement and a five-step wholesale inquiry.
- Refresh-safe state through `localStorage`, plus a development-only reset control.
- Desktop split view and mobile list-to-chat navigation.

## What works in the Operations preview

- Unified five-channel Inbox with waiting/private filters and shared transcripts.
- Owner / Admin / Staff role preview; private feedback is excluded from Staff navigation.
- Staff replies and close/reopen state, stored in the shared browser demo state.
- Desktop three-column layout and mobile list-to-conversation navigation.
- Editable local quick replies, automatic replies and keyword knowledge articles at `/ops/settings`.

## Preview identity and storage

The Conversation Center has no identity or cookie. Its mock state stays in `localStorage`; the Operations preview reads the same local state. Role selection is stored under `af-ops-role:v1`, and automation settings under `af-ops-automation:v1`.

Three illustrative conversations and two customer fixtures are included. They are marked **Sample**. Fixtures live in `server/store.ts`; they are not a second CRM.

Messages and visitor token hashes live in `.preview-data/support.sqlite` (ignored by Git). Cookie tokens are HttpOnly and SameSite Strict; Secure cannot be required by this plain-HTTP local service. First-visit coordination uses Web Locks where available. Separate browsers have separate visitors. Clearing the visitor cookie loses the ability to restore that visitor.

The local service rejects cross-site writes and validates ownership. It is deliberately blocked when `NODE_ENV=production`, on Vercel, or without `SUPPORT_PREVIEW=1`. It has no production credentials.

## Implementation boundaries

- `app/page.tsx`: visitor route; `app/ops/page.tsx`: Inbox preview route.
- `components/assistant-chat/`: shared Conversation Center UI.
- `lib/assistant-chat/`: assistant/channel configuration, mock intent matching, types and local storage adapter.
- `hooks/use-assistant-center.ts`: local conversation and mock workflow state.
- `components/assistant-ops/`: unified Inbox and local automation/knowledge settings shell.
- `components/support/support-settings.tsx`: reusable settings editor retained for the Operations automation page.
- `hooks/use-support.ts`: synchronization and pending-message lifecycle.
- `lib/support/client.ts`: local transport adapter; later replace with the audited Supabase/API implementation.
- `server/`: local-only HTTP/SQLite adapter, separate from the client bundle.
- `tests/support.test.ts`: persistence, identity, ownership, roles, idempotency, presence, HTTP and committed-event tests.

The Sites-generated Vinext scaffold is retained for local rendering. Vite proxies `/preview-api` to the loopback data service on port 4318. The build compiles both pages, but does not package this local backend for a production host. Production API pagination, durable abuse controls, real staff sessions, Supabase RLS and private Realtime must be implemented before deployment.

The future integration remains the audited plan: independent Chat app plus the existing Flower Database `/manage` Operations module, reusing `customer_profiles.user_id` and `admin_profiles.user_id`. This preview does not move or modify those repositories, and its `/ops` preview path is not the final production route.

## Checks

```text
node --test tests/*.test.ts
node node_modules/typescript/bin/tsc --noEmit
node node_modules/oxlint/bin/oxlint app/page.tsx app/layout.tsx components/assistant-chat components/support/visitor-terminal.tsx hooks/use-assistant-center.ts lib/assistant-chat tests/assistant-center.test.ts
node node_modules/vinext/dist/cli.js build
```

No Supabase migration, Vercel configuration, domain, credential, or production customer was changed.

## Floating chat widget

`/widget` renders the reusable `FloatingChat` surface for a desktop, bottom-right
chat experience. It shares the Conversation Center messages, drafts, keyword
matching, quick replies and browser persistence. The route is suitable as the
source of a fixed iframe served by `https://chat.alienfarmers.org/widget`; this
repository intentionally does not change the Public page that will host it.

The widget posts `{ type: 'alien-farmers-chat:state', open: boolean }` to its
parent window so the host can resize the iframe between launcher and expanded
dimensions. A trusted parent may send
`{ type: 'alien-farmers-chat:command', action: 'open' | 'close' }` back to the
iframe. No message or customer content is included in these events.

The component supports dark and light palettes, persisted open state, unread
badges, Escape-to-close with focus restoration, a non-modal dialog, loading,
error and empty states, quick actions, and compact viewport limits.

### Validation performed on 2026-09-07

Nine test groups pass, including the five-channel configuration, feedback visibility metadata, mock intent coverage, persistence, isolation, concurrent-send deduplication, and committed live events. TypeScript, focused lint, and the production compilation pass.

Desktop and 390 × 844 responsive layouts were inspected. The local `responsive-check.html` page renders both apps in phone-sized frames; list-to-conversation and visitor-details transitions were tested there. This is a breakpoint check, not testing a physical phone or its software keyboard. Independent visitor ownership is covered by HTTP tests; browser QA used separate tabs in one browser.
