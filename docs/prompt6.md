## Prompt 6 — Polish final do MVP

```
Review the entire Kahoot Aevo project and apply final MVP polish:

1. **Error handling:**
   - Add loading.tsx and error.tsx to all game routes
   - Handle edge cases: room full, room not found, game already started, host disconnected
   - Show friendly error messages with "Try Again" actions

2. **Responsiveness:**
   - Ensure all pages work on mobile (375px) — this is the PRIMARY device for players
   - Answer cards must be large tap targets (min 48px height)
   - Room code must be easily readable from a distance (for projection)
   - Desktop layout (1280px) for the host/projector view

3. **Accessibility & UX:**
   - Color-coded answers also have shape icons (for color-blind players)
   - Keyboard navigation support (1-2-3-4 for answer selection)
   - Haptic feedback hooks (navigator.vibrate) on answer selection
   - Screen reader labels on interactive elements

4. **Performance:**
   - Ensure all animations use transform/opacity only (GPU-accelerated)
   - Lazy load the confetti component
   - Add proper React.memo on answer cards and leaderboard rows

5. **Metadata & SEO:**
   - Add metadata (title, description, og:image) to layout.tsx and key pages
   - Add a fun favicon and PWA manifest for mobile "Add to Home Screen"

6. **Project documentation:**
   - Add a 404 not-found.tsx page with a fun "quiz not found" theme
   - Remove all console.log statements
   - Ensure TypeScript has no errors (run tsc --noEmit mentally)
   - Add a README.md with: overview, how to install, how to run, how to create a room, tech stack

List every file you create or modify.
```

---
