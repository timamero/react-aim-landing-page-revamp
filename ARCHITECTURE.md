# Aim Landing Page — Architecture Decisions

This document records the architectural decisions for the Aim fintech landing page revamp. It complements [PROJECT_SPECS.md](./PROJECT_SPECS.md) and [AI_GUIDELINES.md](./AI_GUIDELINES.md).

**Stack constraints:** Vite, React, anime.js, vanilla CSS, no global state management.

**Chosen approach summary:**

| Layer | Decision | Pattern name |
|-------|----------|--------------|
| Scroll animations | Central Observer Registry | Animation Director |
| Component composition | Layout Primitives + Data | Shell & Content Split |
| CSS organization | Tokens + Utilities + Blocks | Layered CSS |
| State management | No global state | Local UI state only |

---

## Scroll Animation Management

**Decision:** Central Observer Registry — a single `IntersectionObserver` in `src/utils/scrollAnimations.js` that reads `data-animate` attributes and applies shared anime.js presets.

**Rationale:**

- `PROJECT_SPECS.md` defines uniform scroll-reveal timing across sections (600ms, `easeOutQuad`, 100ms stagger, `translateY: 40px → 0`, `opacity: 0 → 1`).
- One observer minimizes memory and CPU overhead on mobile, supporting the 60fps and `< 200kb` bundle targets.
- Animation rules live in one module, making global tweaks (duration, easing, reduced-motion) a single edit.
- Aligns with the existing `scrollAnimations.js` scaffold and AI guideline AI-1 (anime.js for coordinated animations).

**Trade-offs:**

- Imperative DOM queries (`querySelectorAll`) are less idiomatic than per-component hooks.
- Section-specific animation sequences require explicit escape hatches (`data-animate`, `data-animate-delay`, `data-animate-stagger`).
- Unit testing requires DOM/integration setup rather than isolated hook tests.
- Hero load animations and continuous loops (shape drift, badge pulse) are **not** handled by the central registry — those use dedicated per-section logic.

**Implementation Pattern:**

```js
// src/utils/scrollAnimations.js
import anime from 'animejs';

const PRESETS = {
  'fade-up': {
    translateY: [40, 0],
    opacity: [0, 1],
    duration: 600,
    easing: 'easeOutQuad',
  },
};

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function initScrollAnimations() {
  if (prefersReducedMotion()) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const preset = PRESETS[el.dataset.animate];
        if (!preset) return;

        const stagger = Number(el.dataset.animateStagger) || 0;
        const delay = Number(el.dataset.animateDelay) || 0;
        const targets = el.dataset.animateChildren ? el.children : el;

        anime({
          targets,
          ...preset,
          delay: stagger ? anime.stagger(stagger, { start: delay }) : delay,
        });

        observer.unobserve(el);
      });
    },
    { threshold: 0.15 },
  );

  document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));
}
```

```jsx
// src/App.jsx — initialize once on mount
import { useEffect } from 'react';
import { initScrollAnimations } from './utils/scrollAnimations';

function App() {
  useEffect(() => {
    initScrollAnimations();
  }, []);

  return (/* ... */);
}
```

```jsx
// Markup convention — apply to animatable containers, not every child
<section id="features">
  <div data-animate="fade-up" data-animate-children data-animate-stagger="100">
    {/* cards */}
  </div>
</section>
```

**Exceptions (per-section logic, outside the registry):**

| Animation type | Handler | Location |
|----------------|---------|----------|
| Hero load stagger | Direct `anime()` on mount | `HeroSection.jsx` |
| Continuous shape drift/pulse | Looping `anime()` | `HeroSection.jsx` |
| "Most Popular" badge pulse | CSS keyframe or looping `anime()` | `Pricing.jsx` / `animations.css` |
| Testimonials carousel | `setInterval` or CSS transition | `Testimonials.jsx` |
| Header scroll shadow | Scroll event or `IntersectionObserver` on sentinel | `Header.jsx` |
| Button/link hover glow | CSS transition or `anime()` on `mouseenter` | `Button.jsx` / `animations.css` |

**Applies to:** All section scroll reveals — `HowItWorks`, `Features`, `Pricing`, `Testimonials`, `CTASection`, `Footer` column fade-ins. Hero section uses the registry only for below-fold elements; load animations are handled locally.

---

## Component Composition

**Decision:** Layout Primitives + Data — reusable layout shells (`SectionShell`, shared `Card`/`Button`/`Badge`) compose the page; section content lives in `src/data/` as plain JS exports.

**Rationale:**

- Six of eight sections are list/grid-driven (HowItWorks steps, Features, Pricing tiers, Testimonials), making a data-mapping pattern natural.
- Separating content from markup lets copy updates happen without touching component structure (content guidelines in specs require real, benefit-focused copy).
- `SectionShell` enforces consistent section spacing, max-width, and heading hierarchy across the page.
- Satisfies AI guidelines CA-3 (extract reusable components) and CA-4 (props for flexibility) without introducing state management.
- `App.jsx` remains a readable flat assembly of sections.

**Trade-offs:**

- Adds a `src/data/` directory not in the original scaffold — requires discipline to keep data shapes consistent.
- Bespoke sections (Hero, CTA) do not map cleanly to data arrays and remain self-contained.
- Risk of over-abstraction if every section is forced into the same shell shape.
- No runtime content switching — data is static imports, not fetched.

**Implementation Pattern:**

```
src/
  data/
    howItWorks.js
    features.js
    pricing.js
    testimonials.js
    footer.js
  components/
    common/
      SectionShell.jsx
      Header.jsx
      Footer.jsx
      Button.jsx
      Card.jsx
      Badge.jsx
    sections/
      HeroSection.jsx      # bespoke — no data file
      HowItWorks.jsx
      Features.jsx
      Pricing.jsx
      Testimonials.jsx
      CTASection.jsx       # bespoke — no data file
```

```js
// src/data/features.js
export const features = [
  {
    icon: 'target',
    title: 'Smart Goal Planning',
    description:
      "Break down your big financial dreams into achievable milestones. Aim's goal-tracking tools help you stay motivated and on track.",
  },
  // ...
];
```

```jsx
// src/components/common/SectionShell.jsx
function SectionShell({ id, title, subtitle, children, className = '' }) {
  return (
    <section id={id} className={`section ${className}`.trim()}>
      <div className="container">
        {title && <h2 className="section__title">{title}</h2>}
        {subtitle && <p className="section__subtitle">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}

export default SectionShell;
```

```jsx
// src/components/sections/Features.jsx
import SectionShell from '../common/SectionShell';
import Card from '../common/Card';
import { features } from '../../data/features';

function Features() {
  return (
    <SectionShell id="features" title="Everything you need to achieve your goals">
      <div className="grid-2" data-animate="fade-up" data-animate-children data-animate-stagger="100">
        {features.map((feature) => (
          <Card key={feature.title} {...feature} />
        ))}
      </div>
    </SectionShell>
  );
}

export default Features;
```

```jsx
// src/App.jsx — flat page assembly
function App() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <HowItWorks />
        <Features />
        <Pricing />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
```

**Applies to:**

| Component | Pattern |
|-----------|---------|
| `SectionShell` | All data-driven sections |
| `src/data/howItWorks.js` | `HowItWorks.jsx` |
| `src/data/features.js` | `Features.jsx` |
| `src/data/pricing.js` | `Pricing.jsx` |
| `src/data/testimonials.js` | `Testimonials.jsx` |
| `src/data/footer.js` | `Footer.jsx` (link columns) |
| `HeroSection.jsx` | Bespoke — layout and content inline |
| `CTASection.jsx` | Bespoke — single CTA block |
| `Header.jsx` | Bespoke — navigation config can be a small `navLinks` constant in-file or `src/data/navigation.js` |

---

## CSS Organization Strategy

**Decision:** Tokens + Utilities + Blocks — three CSS layers: design tokens in `variables.css`, layout utilities and resets in `globals.css`, shared animations in `animations.css`, and component-specific visual rules in `styles/blocks/`.

**Rationale:**

- Enforces the design system (colors, spacing scale, typography, breakpoints) via CSS custom properties — no magic numbers (CQ-4).
- Layout utilities (`.container`, `.section`, `.grid-2`, `.grid-3`) eliminate repeated grid/container code across six sections.
- Component blocks contain only unique visuals (e.g. `.pricing-card--highlighted`, `.hero__shapes`).
- Single global import in `main.jsx` keeps the bundle predictable; no CSS-in-JS overhead.
- `animations.css` centralizes keyframes and `prefers-reduced-motion` overrides (AI-5, specs accessibility requirements).

**Trade-offs:**

- JSX carries more class names than a pure BEM-monolith approach.
- Requires discipline to decide utility vs. block for each style rule.
- Component blocks in `styles/blocks/` are not co-located with JSX — deleting a component requires manually removing its block file.
- Specificity must stay flat; blocks should not override utilities with high-specificity selectors.

**Implementation Pattern:**

```
src/styles/
  variables.css      # Design tokens only — no selectors beyond :root
  globals.css        # Resets, typography defaults, layout utilities
  animations.css     # Keyframes, transition classes, reduced-motion overrides
  blocks/
    header.css
    hero.css
    how-it-works.css
    features.css
    pricing.css
    testimonials.css
    cta.css
    footer.css
```

```css
/* src/styles/variables.css */
:root {
  /* Colors */
  --color-primary: #0066ff;
  --color-navy: #001a4d;
  --color-accent: #00d4aa;
  --color-bg: #f5f7fa;
  --color-white: #ffffff;
  --color-text: #1a1a2e;
  --color-text-secondary: #525252;
  --color-text-tertiary: #8b92a0;
  --color-border: #e0e3eb;

  /* Spacing */
  --space-xs: 8px;
  --space-sm: 12px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
  --space-4xl: 80px;
  --space-5xl: 96px;

  /* Typography */
  --font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-h1: 700 48px/56px var(--font-family);
  --font-h2: 700 36px/44px var(--font-family);
  --font-h3: 600 24px/32px var(--font-family);
  --font-body: 400 16px/24px var(--font-family);

  /* Breakpoints (for reference — use in @media, not in var()) */
  /* mobile: 375px | tablet: 480px | desktop: 1024px | large: 1440px */
}
```

```css
/* src/styles/globals.css — utilities */
.container {
  max-width: 1200px;
  margin-inline: auto;
  padding-inline: var(--space-lg);
}

.section {
  padding-block: var(--space-4xl);
}

.section__title {
  font: var(--font-h2);
  color: var(--color-navy);
  margin-bottom: var(--space-lg);
}

.grid-3 {
  display: grid;
  gap: var(--space-lg);
}

@media (min-width: 1024px) {
  .grid-3 {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

```css
/* src/styles/blocks/pricing.css — unique visuals only */
.pricing-card--highlighted {
  background: #e8f0ff;
  box-shadow: 0 4px 24px rgba(0, 102, 255, 0.12);
}
```

```jsx
// src/main.jsx — import order matters
import './styles/variables.css';
import './styles/globals.css';
import './styles/animations.css';
import './styles/blocks/header.css';
import './styles/blocks/hero.css';
// ... remaining block imports
```

**Class naming rules:**

| Layer | Prefix / pattern | Example | Contains |
|-------|------------------|---------|----------|
| Utility | Semantic, no prefix | `.container`, `.grid-3`, `.section` | Layout, spacing, grids |
| Block | Component name | `.pricing-card`, `.hero__shapes` | Unique visuals, modifiers |
| Modifier | `--` suffix | `.pricing-card--highlighted` | Variants, states |
| Animation | `.animate-` or `[data-animate]` | `.animate-pulse` | Motion classes in `animations.css` |

**Applies to:** All components and sections. Utilities are shared; blocks map one-to-one with section/common components that need unique styling.

---

## State Management

**Decision:** No global state — no Redux, Zustand, Context API, or other app-wide state library. UI state is local to the component that owns it via `useState` and `useRef`.

**Rationale:**

- The landing page is a single-page, mostly static marketing site — no authenticated user, no shared data fetching, no cross-component state synchronization.
- Specs define scroll-to-anchor navigation, carousel rotation, mobile menu toggle, and form validation — all scoped to individual components.
- Avoiding global state keeps the bundle small (PO-3) and reduces complexity for a page that does not need it.
- Aligns with project constraints and progressive enhancement (WD-4): content is readable without JavaScript.

**Trade-offs:**

- Cannot easily share state between distant components (e.g. header active section indicator) without lifting state or DOM-based solutions.
- Prop drilling is possible but unlikely — components are shallow and self-contained.
- If future features require auth, analytics dashboards, or dynamic pricing, global state would need to be introduced deliberately.

**Implementation Pattern:**

```jsx
// Local state only — scoped to the component that needs it

// Header.jsx — mobile menu open/closed
const [menuOpen, setMenuOpen] = useState(false);

// Testimonials.jsx — carousel active slide
const [activeIndex, setActiveIndex] = useState(0);

// Footer.jsx — newsletter form input and validation
const [email, setEmail] = useState('');
const [error, setError] = useState('');

// Header.jsx — scroll shadow (no state needed)
// Use IntersectionObserver on a sentinel element or scroll listener with ref
```

**Allowed state patterns:**

| Pattern | Use case | Example |
|---------|----------|---------|
| `useState` | Toggle, form input, carousel index | Mobile menu, newsletter email |
| `useRef` | DOM reference for anime.js, focus management | Hero shapes, scroll sentinel |
| `useEffect` | Init animations, observers, intervals | `initScrollAnimations`, carousel auto-rotate |
| URL hash | Active nav section | `#features`, `#pricing` — no JS state required |
| CSS `:target` / `:checked` | Simple toggles without JS | Optional progressive enhancement |

**Forbidden:**

- Context API for app-wide state
- External state libraries (Redux, Zustand, Jotai, etc.)
- Lifting state to `App.jsx` unless a concrete cross-component need emerges

**Applies to:** Entire application. If a future requirement (e.g. sticky nav highlighting the active section) needs shared state, prefer DOM-based solutions (`IntersectionObserver` on sections updating a `data-active` attribute) before introducing Context.

---

## File Structure (Target)

```
src/
  components/
    common/
      SectionShell.jsx
      Header.jsx
      Footer.jsx
      Button.jsx
      Card.jsx
      Badge.jsx
    sections/
      HeroSection.jsx
      HowItWorks.jsx
      Features.jsx
      Pricing.jsx
      Testimonials.jsx
      CTASection.jsx
  data/
    howItWorks.js
    features.js
    pricing.js
    testimonials.js
    footer.js
  styles/
    variables.css
    globals.css
    animations.css
    blocks/
      header.css
      hero.css
      how-it-works.css
      features.css
      pricing.css
      testimonials.css
      cta.css
      footer.css
  utils/
    scrollAnimations.js
  assets/
    icons/
    images/
  App.jsx
  main.jsx
```

---

## Related Documents

- [PROJECT_SPECS.md](./PROJECT_SPECS.md) — Design system, section content, animation specs
- [AI_GUIDELINES.md](./AI_GUIDELINES.md) — AI-assisted development workflow and verification gates
- [.github/pull_request_template.md](./.github/pull_request_template.md) — PR checklist (references this document)
