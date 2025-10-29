# effects-vdom optimized

Changes:
- Batched dispatch with requestAnimationFrame
- Keyed diffing in patch
- Memoized render via shallow equality
- Custom effects via EffectLike { run(): any }

Usage:
- npm i
- npm run build
- npm run dev
- open public/index.html
