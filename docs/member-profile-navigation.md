# Member profile navigation

`components/member-profile-navigation.tsx` is the reusable account control for ALIEN FARMERS navigation bars.

## Add it to a page

Render it at the far right of the page header:

```tsx
<MemberProfileNavigation
  locale={locale}
  unreadCount={unreadCount}
  onSessionChange={setMemberProfile}
/>
```

- Signed out: a white alien opens a compact sign-in/register popover directly below the navigation; it has no page overlay or background blur.
- Signed in: the notification bell and unread badge are shown. The avatar opens `https://member.alienfarmers.org`; a green alien is used when no avatar exists.
- Any other sign-in/register control can open the same panel with `openMemberAuth('login')` or `openMemberAuth('register')`.
- Chat keeps its original first-entry choice between member access and anonymous use. Choosing member access opens this real account popover; choosing anonymous use keeps the existing browser-local behavior.
- The default API base is `/api/member`. Each host must provide a same-origin proxy with the same contract; never expose member tokens to browser JavaScript.
- `unreadCount` is intentionally supplied by the host application. It is `0` in Chat until the member notification API exists.
