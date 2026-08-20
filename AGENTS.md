# Project: 2.5D Scroll-Story Portfolio

## What this is
A single-page portfolio built as a scroll-driven cinematic story. A character walks
toward a modern minimalist house, opens the door, walks down a corridor, and enters
rooms — each room is a portfolio section. Six scenes total.

## Non-negotiable constraints
1. **2.5D ONLY.** Layered 2D images with parallax depth + CSS 3D transforms.
   NEVER use Three.js, react-three-fiber, Babylon, or any WebGL 3D library.
2. **Performance is a hard requirement.**
   - Total page weight (initial load) < 1.2 MB
   - Total site assets < 3 MB
   - Lighthouse Performance >= 90 on mobile
   - LCP < 2.0s on Fast 3G
   - Animate ONLY `transform` and `opacity`. Never animate width/height/top/left/filter.
3. **All text content is real DOM.** Skill names, project titles, diagram labels,
   and contact details must be HTML elements styled with Tailwind, positioned in 3D
   space over the image layers. NEVER bake text into a generated image.
4. **Images are environment only** — walls, floors, doors, building, character.
5. Every animation is driven by scroll progress, never by time-based autoplay.
6. Respect `prefers-reduced-motion`: fall back to simple fade-between-scenes.
7. TypeScript strict mode. No `any`.

## Tech stack (do not substitute)
React 18, Vite, TypeScript, Tailwind CSS, GSAP 3 + ScrollTrigger, Lenis, sharp.

## Colour tokens
--sand-50 #E6DFD2 | --sand-200 #CBBFAB | --sand-400 #A4937A
--ink-600 #4A453F | --navy-800 #1B2133 | --navy-900 #0F1422

## Animation rules (from the storyboard)
- Smooth easing between sections (power2.inOut)
- Door motion synced to scroll progress, never independent
- Character walk cycle continuous and natural
- Content fades and slides with spatial depth
- Lighting direction stays consistent across all scenes
- Preserve strong depth layering at all times

## Asset rules
- Source images: 2560px wide max
- Ship AVIF with WebP fallback, at 1920 / 1280 / 768 breakpoints
- Scene 1 assets eager-loaded and preloaded; scenes 2-6 lazy-loaded
- Every image needs explicit width/height to prevent CLS

## Definition of done for any task
The dev server runs, the browser has been opened, the scroll has been tested end to
end, and a screenshot or recording proves it works. Do not report success without
browser verification.