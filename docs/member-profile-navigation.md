# Member profile navigation

`components/member-profile-navigation.tsx` is the reusable account control for ALIEN FARMERS navigation bars.

## Add it to a page

Render it at the far right of the page header:

```tsx
<MemberProfileNavigation
  locale={locale}
  unreadMessageCount={unreadMessageCount}
  unreadNotificationCount={unreadNotificationCount}
  onSessionChange={setMemberProfile}
/>
```

- Signed out: a white alien opens a compact sign-in/register popover directly below the navigation; it has no page overlay or background blur.
- Signed in: a current-orders shopping bag, the combined messages-and-notifications bell, and the avatar are shown. The avatar opens `https://member.alienfarmers.org`; a green alien is used when no avatar exists.
- The orders badge loads the member's real order list and counts only `new`, `confirmed`, `payment_received`, `preparing`, and `shipped`. Completed, cancelled, and issue orders are excluded. A host may override the result with `orderCount`.
- The shopping bag and bell currently open the member center root because that application does not yet expose dedicated order or notification deep links.
- Registration shows separate `YYYY`, `MM`, and `DD` fields with fixed separators, auto-advances between segments, and retains the calendar picker. It requires password confirmation and provides independent password visibility controls for both login and registration.
- Any other sign-in/register control can open the same panel with `openMemberAuth('login')` or `openMemberAuth('register')`.
- Chat keeps its original first-entry choice between member access and anonymous use. Choosing member access opens this real account popover; choosing anonymous use keeps the existing browser-local behavior.
- The default API base is `/api/member`. Each host must provide a same-origin proxy with the same contract; never expose member tokens to browser JavaScript. Production member cookies use the `.alienfarmers.org` parent domain, so authenticated navigation between official Chat, Member Center, storefront, and other member-enabled subdomains keeps the same session. Preview and localhost cookies remain host-only.
- `unreadMessageCount` and `unreadNotificationCount` are added for the bell badge. Chat supplies its browser-local unread conversation count and, unless the host overrides the value, loads the authenticated member notification API's unread total.
