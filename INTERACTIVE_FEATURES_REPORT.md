# Interactive Features Implementation Report

## 1. Component Separation
-   **Loader (`InitialLoader.tsx`)**: Handles initial entry flow. Independent component.
-   **Sphere (`Sphere3D.tsx`)**: Handles visual engagement in Hero. Client-side on ly.
-   **Chatbot (`ChatWidget.tsx`)**: Handles main logic.
-   **State (`useChatStore.ts`)**: Decoupled Zustand store connects them all without prop drilling.

## 2. State Flow
1.  **Loading**: `InitialLoader` checks `sessionStorage`. If new session, shows animation (1.5s).
2.  **Ready**: Loader unmounts. `HeroSection` mounts `Sphere3D` (lazy loaded).
3.  **Interaction**:
    -   User clicks Sphere.
    -   `useChatStore.onOpen(true)` fires.
    -   `ChatWidget` slides up.
    -   `Sphere3D` de-emphasizes (shrinks to 0.9x, slows rotation) to focus attention on chat.

## 3. Mounting Strategy (Safe for Next.js)
-   **Sphere**: Wrapped in `dynamic(() => import(...), { ssr: false })`. This guarantees **NO hydration mismatches** strictly following the "Absolute Rules".
-   **Loader**: Uses `if (!isClient) return null` guard. Ensures it only renders on the browser after hydration is confirmed.

## 4. Performance & Safety Safeguards
-   **WebGL**: Sphere is hidden on mobile (`hidden lg:block`). CSS fallback label exists.
-   **Animation**: Used `requestAnimationFrame` (via R3F useFrame). Animation speed reduces when chat is open to save GPU cycles.
-   **Theme**: Fully reactive. Used `useTheme()` hook to swap material colors instantly without remounting the canvas.
-   **Storage**: Used `sessionStorage` (not `localStorage`) so the welcome animation is fresh for every tab/session but doesn't spam on refresh.

## 5. Accessibility
-   **Loader**: Disappears completely (unmounts) so it cannot block screen readers after loading.
-   **Sphere**: Has a text label "Click to Interact" for clarity.
-   **Keyboard**: Chat widget is fully focusable.

## 6. Validation Checklist
-   [x] No Hydration Warnings (SSR: false used).
-   [x] No CLS (Fixed height containers).
-   [x] Mobile Safe (Hidden on mobile).
-   [x] Theme Toggle Works (Reactive props).
-   [x] Session persistence (Loader works as intended).

## 7. Design Explanation (Viva Ready)
"I implemented a **Chatbot-First** user experience. Instead of a static resume, the site greets the user as an AI agent. The **3D Sphere** serves as a 'brain' visualization—it's not just eye candy; it's the persistent physical representation of the AI. Clicking it wakes the agent. Technical-wise, I separated the 3D context from the main thread using dynamic imports to ensure the site's First Contentful Paint (FCP) remains near-instant on all devices."
