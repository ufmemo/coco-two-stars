# Mobile MVP - Two Stars Game

## Essential Mobile Fixes (MVP)

### 1. Make Board Fit Mobile Screens

- [ ] Replace fixed `50px` cell size with responsive calculation
- [ ] In `CellBlock` styled component: use `width: calc((100vw - 80px) / 12)`
- [ ] Cap maximum cell size at `50px` for desktop
- [ ] Update star icon size to `1.5em` to scale with cells

### 2. Fix Layout on Small Screens

- [ ] Add mobile breakpoint in `App.tsx`: `@media (max-width: 768px)`
- [ ] Reduce padding: `AppContainer` to `10px`, `BoardContainer` to `6px`
- [ ] Stack controls vertically on mobile with `flex-direction: column`

### 3. Optimize Touch Interaction

- [ ] Add `touch-action: manipulation` to `CellBlock`
- [ ] Increase minimum touch target to `44px` (add padding if needed)
- [ ] Update viewport meta: `user-scalable=no, maximum-scale=1`

### 4. Quick CSS Improvements

- [ ] Add `box-sizing: border-box` to root CSS
- [ ] Use `clamp(16px, 4vw, 24px)` for win message font size
- [ ] Reduce win message padding on mobile

## Test Checklist

- [ ] Game playable on iPhone SE (320px width)
- [ ] No horizontal scrolling required
- [ ] Touch targets easy to tap
- [ ] Text readable without zooming

---

_Target: Functional mobile experience in ~2 hours_
