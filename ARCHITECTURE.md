# Aim Landing Page — Architecture Decisions

This document records the architectural decisions for the Aim fintech landing page revamp. It complements [PROJECT_SPECS.md](./PROJECT_SPECS.md) and [AI_GUIDELINES.md](./AI_GUIDELINES.md).

**Stack constraints:** Vite, React, anime.js 4.4.1, vanilla CSS, no global state management.

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
- Hero load animations and continuous loops (shape drift, tier pulse) are **not** handled by the central registry — those use dedicated per-section logic.

**Implementation Pattern:**

```js
// src/utils/scrollAnimations.js
import { animate } from 'animejs';

const PRESETS = {
  'fade-up': {
    translateY: [40, 0],
    opacity: [0, 1],
    duration: 600,
    easing: 'easeOutQuad',
  },
  'fade-left': {
    translateX: [-40, 0],
    opacity: [0, 1],
    duration: 600,
    easing: 'easeOutQuad',
  },
  'fade-right': {
    translateX: [40, 0],
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

        const staggerMs = Number(el.dataset.animateStagger) || 0;
        const delay = Number(el.dataset.animateDelay) || 0;
        const isChildren = Boolean(el.dataset.animateChildren);

        if (isChildren) {
          Array.from(el.children).forEach((child, i) => {
            const childDelay = staggerMs ? delay + i * staggerMs : delay;
            animate(child, {
              ...preset,
              delay: childDelay,
              onComplete: () => handleOnReveal(child),
            });
          });
        } else {
          animate(el, {
            ...preset,
            delay,
            onComplete: () => handleOnReveal(el),
          });
        }

        observer.unobserve(el);
      });
    },
    { threshold: 0.15 },
  );

  document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));
}

function handleOnReveal(el) {
  const reveal = el.dataset.animateOnReveal;
  if (!reveal || prefersReducedMotion()) return;

  if (reveal === 'checkmarks') {
    el.querySelectorAll('.pricing-card__check').forEach((check, i) => {
      animate(check, {
        scale: [0, 1],
        opacity: [0, 1],
        delay: i * 80,
        duration: 300,
        easing: 'easeOutQuad',
      });
    });
  }
}
```

> **anime.js v4.4.1:** This project uses `animejs@4.4.1`. Import `animate` and `stagger` from `'animejs'` (not the v3 default export). All animation examples in this document target the **4.4.1 API** — use `onComplete` callbacks and easing strings as documented in the installed package, not v3 patterns.

See [Pricing Pattern](#pricing-pattern) for `data-animate-on-reveal` usage.

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
| Hero load stagger | `initHeroLoad()` on mount | `heroAnimations.js` |
| Continuous shape drift/pulse | CSS keyframes | `animations.css` / `hero.css` |
| Hero shape scroll rotation | Passive scroll listener | `heroAnimations.js` |
| Highlighted pricing card pulse | CSS keyframe on inner wrapper | `animations.css` / `pricing.css` |
| Testimonials carousel fade | `useState` + CSS opacity transition | `Testimonials.jsx` |
| Header scroll shadow | Scroll event or `IntersectionObserver` on sentinel | `Header.jsx` |
| Button/link hover glow | CSS transition or `animate()` on `mouseenter` | `Button.jsx` / `animations.css` |

**Registry extensions (still in `scrollAnimations.js`, not exceptions):**

| Extension | Attribute | Used by |
|-----------|-----------|---------|
| Directional scroll presets | `data-animate="fade-left"` or `"fade-right"` | `Testimonials.jsx` |
| Post-reveal stagger | `data-animate-on-reveal="checkmarks"` | `PricingCard.jsx` |

**Applies to:** All section scroll reveals — `AboutSection`, `HowItWorks`, `Features`, `Pricing`, `Testimonials`, `CTASection`, `Footer` column fade-ins. Hero section is fully excluded from the registry; see [HeroSection Pattern](#herosection-pattern). Testimonials scroll reveal uses directional presets; carousel logic is separate — see [Testimonials Pattern](#testimonials-pattern). Pricing checkmark stagger uses `data-animate-on-reveal` — see [Pricing Pattern](#pricing-pattern).

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
- Bespoke sections (Hero, About, CTA) do not map cleanly to data arrays and remain self-contained.
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
    navigation.js           # Header nav links and anchor targets
  components/
    common/
      SectionShell.jsx
      Header.jsx
      Footer.jsx
      Button.jsx
      Card.jsx
      Badge.jsx
      TestimonialCard.jsx
      PricingCard.jsx
    sections/
      HeroSection.jsx      # bespoke — no data file
      AboutSection.jsx     # bespoke — no data file
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

```js
// src/data/navigation.js
export const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Get Started', href: '#cta' },
];

export const headerCta = { label: 'Open Account', disabled: true };
```

Header renders `headerCta` as a `disabled` `Button` — not an anchor. Nav text links (including "Get Started") remain scroll anchors to on-page sections.

```jsx
// src/App.jsx — flat page assembly
function App() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
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
| `src/data/pricing.js` | `Pricing.jsx` + `PricingCard.jsx` |
| `src/data/testimonials.js` | `Testimonials.jsx` + `TestimonialCard.jsx` |
| `src/data/footer.js` | `Footer.jsx` (link columns) |
| `HeroSection.jsx` | Bespoke — layout and content inline |
| `AboutSection.jsx` | Bespoke — mission copy, `id="about"` anchor for Header nav |
| `CTASection.jsx` | Bespoke — `id="cta"` anchor, disabled primary CTA button |
| `Header.jsx` | Bespoke — consumes `src/data/navigation.js` |

**Shared primitive contracts:**

| Component | Purpose | Key props |
|-----------|---------|-----------|
| `Button` | CTAs and actions | `variant` (`primary`, `secondary`, `text`), `size` (`small`, `medium`, `large`), `href?`, `type?`, `disabled?`, `children` |
| `Badge` | Status labels (e.g. "Most Popular") | `children` |
| `Card` | Feature grid items | `icon`, `title`, `description` |
| `PricingCard` | Pricing tier cards | `name`, `price`, `features`, `cta`, `variant`, `ctaVariant?`, `badge?`, `ctaDisabled?` |
| `TestimonialCard` | Testimonial content | `quote`, `author`, `role`, `avatar` |
| `SectionShell` | Section wrapper | `id`, `title?`, `subtitle?`, `children`, `className?` |

Hover glow on buttons is handled inside `Button` via CSS or `animate()` — not by consuming sections.

**CTA placeholder policy:** All signup/account CTAs are **non-functional `disabled` buttons** until real flows exist. This applies to Hero, Header, Pricing, and CTASection. Navigation text links (`href` anchors) and secondary informational links (e.g. "Watch How It Works" → `#how-it-works`) remain functional.

| Location | Element | Behavior |
|----------|---------|----------|
| `HeroSection` | "Get Started Free" | `disabled` `Button` |
| `Header` | "Open Account" | `disabled` `Button` from `headerCta` |
| `PricingCard` | All tier CTAs | `disabled` `Button` (`ctaDisabled: true`) |
| `CTASection` | "Open Your Account" | `disabled` `Button` |
| Nav links | About, Features, Pricing, Get Started | Functional scroll anchors |

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
    about.css
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

.section__subtitle {
  font: var(--font-body);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-xl);
}

.grid-2 {
  display: grid;
  gap: var(--space-lg);
}

@media (min-width: 768px) {
  .grid-2 {
    grid-template-columns: repeat(2, 1fr);
  }
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
import './styles/blocks/about.css';
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
| `useEffect` | Init animations, observers | `initScrollAnimations`, carousel swipe handlers |
| URL hash | Active nav section | `#features`, `#pricing` — no JS state required |
| CSS `:target` / `:checked` | Simple toggles without JS | Optional progressive enhancement |

**Forbidden:**

- Context API for app-wide state
- External state libraries (Redux, Zustand, Jotai, etc.)
- Lifting state to `App.jsx` unless a concrete cross-component need emerges

**Applies to:** Entire application. If a future requirement (e.g. sticky nav highlighting the active section) needs shared state, prefer DOM-based solutions (`IntersectionObserver` on sections updating a `data-active` attribute) before introducing Context.

---

## HeroSection Pattern

**Decision:** Bespoke monolithic component with dedicated `heroAnimations.js` utility — hero is fully excluded from the Central Observer Registry. Load stagger uses anime.js on mount; continuous shape motion uses CSS keyframes; scroll-coupled rotation uses a passive scroll listener gated by viewport visibility. Shared `Button` handles CTA hover glow. Primary CTA ("Get Started Free") is a **disabled placeholder button**; secondary CTA remains a functional anchor link.

**Rationale:**

- `PROJECT_SPECS.md` defines four distinct animation types for Hero (load stagger, continuous drift/pulse, button hover, scroll rotation) with different timing than scroll reveals (500ms/`easeOutQuart` vs. 600ms/`easeOutQuad`).
- The Central Observer Registry fires once at intersection threshold — it cannot drive load choreography or progress-based scroll rotation.
- Extracting animation logic to `heroAnimations.js` mirrors `initScrollAnimations()` and keeps `HeroSection.jsx` focused on markup and refs.
- CSS keyframes for continuous shape loops avoid three concurrent anime.js loops on mobile, supporting the 60fps target (AI-4: CSS for simple transitions, JS for complex sequences).
- Hero is a bespoke section per the Composition decision — no `SectionShell`, no `src/data/hero.js`; copy and layout stay inline.

**Trade-offs:**

- Hero animation logic is isolated from the registry — preset values may drift unless shared constants are extracted later.
- A passive scroll listener adds a small runtime cost, mitigated by detaching when the hero leaves the viewport.
- Monolithic component may grow if shapes become complex; sub-components (`HeroShapes`) are deferred until reuse is needed.
- CSS initial hidden state on text elements requires careful FOUC prevention — final state must be defined in `prefers-reduced-motion` overrides.

**Implementation Pattern:**

```
src/
  components/
    sections/
      HeroSection.jsx       # Markup, refs, single useEffect
    common/
      Button.jsx              # Primary + text CTA, hover glow
  utils/
    heroAnimations.js         # initHeroAnimations + cleanup
  styles/
    blocks/
      hero.css                # Layout, shapes, initial hidden state
    animations.css            # hero-drift, hero-pulse keyframes
```

**Animation ownership:**

| Animation | Trigger | Handler | Timing |
|-----------|---------|---------|--------|
| Text load stagger | Mount | `initHeroLoad()` in `heroAnimations.js` | 500ms, 100ms stagger, `easeOutQuart` |
| Shape drift/pulse | Continuous | CSS keyframes in `animations.css` | 8s rotate, 3s opacity, 2s scale |
| Shape scroll rotation | Scroll progress | `initShapeScrollRotation()` in `heroAnimations.js` | Slow rotation tied to `scrollY` |
| CTA hover glow | Mouse enter/leave | `Button.jsx` | 300ms scale + box-shadow |

```js
// src/utils/heroAnimations.js
import { animate, stagger } from 'animejs';

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function initHeroLoad(contentEl) {
  return animate(contentEl.children, {
    translateY: [40, 0],
    opacity: [0, 1],
    duration: 500,
    delay: stagger(100),
    easing: 'easeOutQuart',
  });
}

function initShapeScrollRotation(shapesEl) {
  // Rotate inner wrappers only — outer .hero__shape keeps CSS drift/pulse animations
  const rotators = shapesEl.querySelectorAll('.hero__shape-rotator');
  let active = true;

  const visibilityObserver = new IntersectionObserver(
    ([entry]) => { active = entry.isIntersecting; },
    { threshold: 0 },
  );
  visibilityObserver.observe(shapesEl);

  const onScroll = () => {
    if (!active) return;
    const progress = Math.min(window.scrollY / window.innerHeight, 1);
    rotators.forEach((rotator, i) => {
      rotator.style.transform = `rotate(${progress * (45 + i * 15)}deg)`;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  return () => {
    visibilityObserver.disconnect();
    window.removeEventListener('scroll', onScroll);
  };
}

export function initHeroAnimations({ contentEl, shapesEl }) {
  if (prefersReducedMotion() || !contentEl || !shapesEl) return () => {};

  const loadAnimation = initHeroLoad(contentEl);
  const removeScroll = initShapeScrollRotation(shapesEl);

  return () => {
    loadAnimation.pause();
    removeScroll();
  };
}
```

```jsx
// src/components/sections/HeroSection.jsx
import { useEffect, useRef } from 'react';
import Button from '../common/Button';
import { initHeroAnimations } from '../../utils/heroAnimations';

function HeroSection() {
  const contentRef = useRef(null);
  const shapesRef = useRef(null);

  useEffect(() => {
    return initHeroAnimations({
      contentEl: contentRef.current,
      shapesEl: shapesRef.current,
    });
  }, []);

  return (
    <section id="hero" className="hero" aria-labelledby="hero-heading">
      <div className="container hero__layout">
        <div className="hero__content" ref={contentRef}>
          <h1 id="hero-heading">Take control of your financial future</h1>
          <p className="hero__subheadline">
            Aim makes it simple to invest, save, and plan for the goals that matter most to you.
          </p>
          <div className="hero__actions">
            <Button variant="primary" size="large" type="button" disabled>Get Started Free</Button>
            <Button variant="text" href="#how-it-works">Watch How It Works →</Button>
          </div>
        </div>
        <div className="hero__shapes" ref={shapesRef} aria-hidden="true">
          <div className="hero__shape hero__shape--1">
            <div className="hero__shape-rotator" />
          </div>
          <div className="hero__shape hero__shape--2">
            <div className="hero__shape-rotator" />
          </div>
          <div className="hero__shape hero__shape--3">
            <div className="hero__shape-rotator" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
```

```css
/* src/styles/blocks/hero.css — layout and initial state */
.hero {
  min-height: 100svh;
  display: flex;
  align-items: center;
}

.hero__layout {
  display: grid;
  gap: var(--space-2xl);
}

@media (min-width: 1024px) {
  .hero__layout {
    grid-template-columns: 3fr 2fr;
    align-items: center;
  }
}

.hero__content > * {
  opacity: 0;
  transform: translateY(40px);
}

@media (prefers-reduced-motion: reduce) {
  .hero__content > * {
    opacity: 1;
    transform: none;
  }
}
```

```css
/* src/styles/animations.css — continuous shape motion */
@keyframes hero-drift {
  to { transform: rotate(360deg); }
}

@keyframes hero-pulse-opacity {
  50% { opacity: 0.8; }
}

/* Drift/pulse on outer shape; scroll rotation targets .hero__shape-rotator */
.hero__shape--1 {
  animation: hero-drift 8s linear infinite, hero-pulse-opacity 3s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .hero__shape { animation: none; opacity: 0.6; }
}
```

**Transform layering:** Outer `.hero__shape` handles CSS drift/pulse. Inner `.hero__shape-rotator` handles scroll-coupled rotation via JS — avoids `transform` conflicts between CSS animations and inline styles.

**Registry boundary:** Hero must not use `data-animate` attributes. The registry and hero init run independently — registering hero elements would apply the wrong easing, duration, and trigger semantics.

**Accessibility requirements:**

- `aria-labelledby="hero-heading"` on `<section>`
- `aria-hidden="true"` on decorative shape container
- `prefers-reduced-motion`: skip all JS animation; CSS shows final text state and static shapes
- Primary CTA: `disabled` button with descriptive label — placeholder until signup flow exists
- Secondary CTA: functional `<a href="#how-it-works">` inside `Button` for progressive enhancement
- `min-height: 100svh` (not `100vh`) to account for mobile browser chrome

**Applies to:** `HeroSection.jsx`, `utils/heroAnimations.js`, `styles/blocks/hero.css`, and shared `Button.jsx` for CTAs. Does not apply to any other section.

---

## Testimonials Pattern

**Decision:** Data-driven section via `SectionShell` + `src/data/testimonials.js` + dedicated `TestimonialCard` — scroll reveal uses Central Observer Registry directional presets (`fade-left` / `fade-right`); mobile carousel uses local `useState(activeIndex)` with CSS opacity transitions (1s), touch swipe, and both dot indicators and prev/next arrow controls. Desktop shows all three cards in a static grid with no carousel behavior and **no auto-rotate**. Carousel logic stays inline in `Testimonials.jsx`; a `useCarousel` hook is deferred until a second carousel is needed.

**Rationale:**

- `PROJECT_SPECS.md` defines two animation systems: scroll-triggered slide-in (left/right) and carousel fade rotation (1s) — these must not conflict.
- Scroll reveal belongs in the registry (uniform 600ms, `easeOutQuad`); carousel fade is a repeated opacity transition better handled by CSS (AI-4).
- Single DOM with CSS layout switch shows all 3 cards on desktop (static grid) and one active card on mobile (carousel) — content stays indexable and scroll reveal fires on all cards.
- Auto-rotate was removed on desktop because a 3-column static grid has no visible rotation target — manual controls and swipe are sufficient.
- `TestimonialCard` is semantically distinct from feature `Card` (`blockquote`, `cite`, avatar) per CA-1.
- Local `useState` for `activeIndex` is explicitly allowed; no global state required.

**Trade-offs:**

- Registry needs directional presets (`fade-left`, `fade-right`) and per-slide `data-animate` wrappers.
- Carousel and scroll reveal both touch `opacity` on mobile — carousel `.is-active` rules must win after scroll reveal completes (see Registry boundary below).
- `aria-hidden` and `tabindex` on inactive mobile slides require breakpoint-aware JS; desktop exposes all slides to assistive tech.
- Inline carousel logic makes `Testimonials.jsx` larger than simpler sections; extracting `useCarousel` is deferred by design.
- Touch swipe threshold (50px) may need tuning to avoid conflicting with vertical page scroll.

**Implementation Pattern:**

```
src/
  data/
    testimonials.js           # quote, author, role, avatar per entry
  components/
    common/
      SectionShell.jsx
      TestimonialCard.jsx     # blockquote, cite, avatar — not feature Card
    sections/
      Testimonials.jsx        # carousel state, swipe, controls
  utils/
    scrollAnimations.js       # fade-left, fade-right presets (see Scroll Animation Management)
  styles/
    blocks/
      testimonials.css        # grid, carousel, controls, card visuals
```

**Animation ownership:**

| Animation | Trigger | Handler | Timing |
|-----------|---------|---------|--------|
| Card scroll reveal | Intersection | Registry `fade-left` / `fade-right` | 600ms, 100ms stagger via `data-animate-delay`, `easeOutQuad` |
| Carousel slide fade | Index change (mobile only) | CSS `.is-active` opacity transition | 1s ease |
| Mobile swipe | Touch gesture | `touchstart` / `touchend` in `Testimonials.jsx` | 50px horizontal threshold |

```js
// src/data/testimonials.js
export const testimonials = [
  {
    quote: 'Aim took the stress out of managing my investments. I finally feel in control of my financial future.',
    author: 'Sarah Chen, 28',
    role: 'Product Manager, Tech Startup',
    avatar: '/assets/images/avatar-sarah.webp',
  },
  // ...
];
```

```jsx
// src/components/common/TestimonialCard.jsx
function TestimonialCard({ quote, author, role, avatar }) {
  return (
    <article className="testimonial-card">
      <blockquote className="testimonial-card__quote">
        <p>{quote}</p>
      </blockquote>
      <footer className="testimonial-card__author">
        <img src={avatar} alt="" className="testimonial-card__avatar" loading="lazy" />
        <cite>{author}</cite>
        <span className="testimonial-card__role">{role}</span>
      </footer>
    </article>
  );
}

export default TestimonialCard;
```

```jsx
// src/components/sections/Testimonials.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import SectionShell from '../common/SectionShell';
import TestimonialCard from '../common/TestimonialCard';
import { testimonials } from '../../data/testimonials';

function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches,
  );
  const carouselRef = useRef(null);

  const goTo = useCallback((index) => {
    const len = testimonials.length;
    setActiveIndex(((index % len) + len) % len);
  }, []);

  const goNext = () => goTo(activeIndex + 1);
  const goPrev = () => goTo(activeIndex - 1);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const onChange = () => setIsMobile(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Touch swipe: mobile only
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let startX = 0;
    const onTouchStart = (e) => { startX = e.touches[0].clientX; };
    const onTouchEnd = (e) => {
      if (!isMobile) return;
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) diff > 0 ? goNext() : goPrev();
    };

    carousel.addEventListener('touchstart', onTouchStart, { passive: true });
    carousel.addEventListener('touchend', onTouchEnd);
    return () => {
      carousel.removeEventListener('touchstart', onTouchStart);
      carousel.removeEventListener('touchend', onTouchEnd);
    };
  }, [isMobile, goNext, goPrev]);

  return (
    <SectionShell id="testimonials" title="Trusted by thousands">
      <div
        className="testimonials__carousel"
        role="region"
        aria-roledescription="carousel"
        aria-label="Customer testimonials"
      >
        <div ref={carouselRef} className="testimonials__track" aria-live="polite">
          {testimonials.map((t, i) => (
            <div
              key={t.author}
              className={`testimonials__slide ${i === activeIndex ? 'is-active' : ''}`}
              data-animate={i % 2 === 0 ? 'fade-left' : 'fade-right'}
              data-animate-delay={i * 100}
              aria-hidden={isMobile && i !== activeIndex ? true : undefined}
              tabIndex={isMobile && i !== activeIndex ? -1 : undefined}
              aria-label={`Testimonial ${i + 1} of ${testimonials.length}`}
            >
              <TestimonialCard {...t} />
            </div>
          ))}
        </div>

        <div className="testimonials__controls">
          <button type="button" className="testimonials__arrow" onClick={goPrev} aria-label="Previous testimonial">
            ←
          </button>
          <div className="testimonials__dots" role="tablist" aria-label="Select testimonial">
            {testimonials.map((t, i) => (
              <button
                key={t.author}
                type="button"
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`Testimonial ${i + 1}`}
                className={`testimonials__dot ${i === activeIndex ? 'is-active' : ''}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
          <button type="button" className="testimonials__arrow" onClick={goNext} aria-label="Next testimonial">
            →
          </button>
        </div>
      </div>
    </SectionShell>
  );
}

export default Testimonials;
```

```css
/* src/styles/blocks/testimonials.css */
.testimonials__track {
  display: grid;
  gap: var(--space-lg);
}

/* Desktop: all cards visible */
@media (min-width: 1024px) {
  .testimonials__track {
    grid-template-columns: repeat(3, 1fr);
  }
  .testimonials__slide {
    opacity: 1;
  }
  .testimonials__controls {
    display: none;
  }
}

/* Mobile: carousel — one active slide */
@media (max-width: 1023px) {
  .testimonials__track {
    position: relative;
  }
  .testimonials__slide {
    opacity: 0;
    position: absolute;
    inset: 0;
    transition: opacity 1s ease;
    pointer-events: none;
  }
  .testimonials__slide.is-active {
    opacity: 1;
    position: relative;
    pointer-events: auto;
  }
}

.testimonials__controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-lg);
  margin-top: var(--space-lg);
}

@media (prefers-reduced-motion: reduce) {
  .testimonials__slide {
    transition: none;
  }
}
```

**Registry boundary:** Scroll reveal uses per-slide `data-animate` wrappers with alternating `fade-left` / `fade-right` and `data-animate-delay` for stagger. On mobile, carousel rotation toggles `.is-active` for opacity only — it must not re-trigger registry or re-apply `translateX` after the initial reveal. After scroll reveal completes, mobile carousel CSS (`.testimonials__slide:not(.is-active) { opacity: 0 }`) takes over visibility; avoid re-animating opacity via JS on slide change.

**Carousel rules:**

| Rule | Decision |
|------|----------|
| Auto-rotate | **No** — manual dot/arrow controls and swipe only |
| Desktop layout | **Static 3-column grid** — all slides visible, controls hidden |
| Mobile layout | **1-up carousel** — swipe + dot/arrow controls |
| `useCarousel` hook | **Deferred** — extract only when a second carousel component is added |

**Accessibility requirements:**

- `role="region"`, `aria-roledescription="carousel"`, `aria-live="polite"` on track
- `aria-hidden` and `tabindex="-1"` on inactive slides **on mobile only**; all slides visible and focusable on desktop
- Dot buttons use `role="tab"`, `aria-selected`; arrow buttons have descriptive `aria-label`
- `prefers-reduced-motion`: instant slide change (no 1s fade)
- Keyboard: arrows and dots are focusable on mobile; no focus trap
- Avatar images use `alt=""` (decorative); author name is in `<cite>`

**Applies to:** `Testimonials.jsx`, `TestimonialCard.jsx`, `src/data/testimonials.js`, `styles/blocks/testimonials.css`, and directional presets in `scrollAnimations.js`. Does not apply to any other section.

---

## Pricing Pattern

**Decision:** Data-driven section via `SectionShell` + `src/data/pricing.js` + dedicated `PricingCard` — tier cards use Central Observer Registry `fade-up` with `data-animate-children`; checkmark stagger fires via extended `data-animate-on-reveal="checkmarks"` hook after card reveal completes; highlighted card pulse uses CSS keyframes on an inner wrapper (desktop only); CTAs use shared `Button` with `Badge` on Premium. No local state. **All tier CTAs are non-functional placeholder buttons** (`disabled`) until signup/sales flows exist.

**Rationale:**

- `PROJECT_SPECS.md` defines three static tiers with distinct visuals, feature checklists, and CTAs — maps cleanly to Composition-B data + `PricingCard` mapping.
- Card fade-in matches Features/HowItWorks (`fade-up`, 600ms, 100ms stagger) — standard registry pattern, no per-section observer.
- Checkmarks must animate after card entry, not at intersection independently — `data-animate-on-reveal` extends the registry once, reusable by other sections later.
- Continuous pulse on highlighted card is a registry exception (like Hero shape drift) — CSS keyframes avoid JS animation loops and transform conflicts with scroll reveal.
- Pulse and scale-up apply on desktop only (`min-width: 1024px`) — mobile shows highlighted styling without motion or enlarged scale.
- Feature `Card` is the wrong abstraction (icon + description vs. price + checklist + CTA) — `PricingCard` satisfies CA-1.
- Placeholder CTAs avoid fake links — buttons render with correct labels and styling but remain `disabled` until real destinations are defined.

**Trade-offs:**

- Registry gains `handleOnReveal` logic — slightly increases shared util complexity for Pricing-specific checkmark selector (`.pricing-card__check`).
- Inner wrapper on highlighted card adds DOM depth to isolate pulse `transform` from registry `translateY`.
- All pricing CTAs must be wired to real flows later — track as known placeholders.
- Three variant skins require disciplined BEM modifiers — new tiers need new CSS block rules.

**Implementation Pattern:**

```
src/
  data/
    pricing.js                  # tiers array: name, price, variant, features, cta, ctaVariant, badge
  components/
    common/
      SectionShell.jsx
      PricingCard.jsx           # article, price, checklist, Badge, Button
      Badge.jsx
      Button.jsx
    sections/
      Pricing.jsx               # SectionShell + grid-3 + data-animate attrs
  utils/
    scrollAnimations.js         # handleOnReveal for data-animate-on-reveal
  styles/
    blocks/
      pricing.css               # card variants, checkmark initial state
    animations.css              # pricing-pulse keyframes
```

**Animation ownership:**

| Animation | Trigger | Handler | Timing |
|-----------|---------|---------|--------|
| Tier card fade-in | Intersection | Registry `fade-up` + `data-animate-children` | 600ms, 100ms stagger, `easeOutQuad` |
| Checkmark stagger | After card reveal | `handleOnReveal('checkmarks')` in `scrollAnimations.js` | 300ms each, 80ms stagger |
| Highlighted card pulse | Continuous | CSS `pricing-pulse` on `.pricing-card__inner` | 3s loop, desktop only |
| CTA hover glow | Mouse enter/leave | `Button.jsx` | 300ms scale + box-shadow |

```js
// src/data/pricing.js
export const tiers = [
  {
    name: 'Basic',
    price: 'Free',
    variant: 'basic',
    features: [
      'Account connections',
      'Basic goal tracking',
      'Spending analytics',
      'Mobile & web access',
    ],
    cta: 'Get Started',
    ctaVariant: 'primary',
    ctaDisabled: true,
  },
  {
    name: 'Premium',
    price: '$8.99/month',
    variant: 'highlighted',
    badge: 'Most Popular',
    features: [
      'Everything in Basic',
      'Automated investing',
      'Advanced portfolio analysis',
      'Tax optimization tools',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    ctaVariant: 'primary',
    ctaDisabled: true,
  },
  {
    name: 'Wealth',
    price: '$19.99/month',
    variant: 'wealth',
    features: [
      'Everything in Premium',
      '1-on-1 advisor sessions',
      'Comprehensive financial planning',
      'Wealth transfer strategies',
      'Dedicated account manager',
    ],
    cta: 'Contact Sales',
    ctaVariant: 'secondary',
    ctaDisabled: true,
  },
];
```

Default in `PricingCard`: `ctaDisabled` defaults to `true` if omitted — all tiers are placeholders unless explicitly enabled.

```jsx
// src/components/common/PricingCard.jsx
import Badge from './Badge';
import Button from './Button';

function PricingCard({ name, price, features, cta, ctaVariant = 'primary', variant, badge, ctaDisabled }) {
  return (
    <article
      className={`pricing-card pricing-card--${variant}`}
      data-animate-on-reveal="checkmarks"
    >
      <div className="pricing-card__inner">
        {badge && <Badge>{badge}</Badge>}
        <h3 className="pricing-card__name">{name}</h3>
        <p className="pricing-card__price">{price}</p>
        <ul className="pricing-card__features">
          {features.map((feature) => (
            <li key={feature} className="pricing-card__feature">
              <span className="pricing-card__check" aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>
        <Button variant={ctaVariant} type="button" disabled={ctaDisabled ?? true}>
          {cta}
        </Button>
      </div>
    </article>
  );
}

export default PricingCard;
```

```jsx
// src/components/sections/Pricing.jsx
import SectionShell from '../common/SectionShell';
import PricingCard from '../common/PricingCard';
import { tiers } from '../../data/pricing.js';

function Pricing() {
  return (
    <SectionShell
      id="pricing"
      title="Simple, transparent pricing"
      subtitle="No hidden fees. Cancel anytime."
    >
      <div className="grid-3" data-animate="fade-up" data-animate-children data-animate-stagger="100">
        {tiers.map((tier) => (
          <PricingCard key={tier.name} {...tier} />
        ))}
      </div>
    </SectionShell>
  );
}

export default Pricing;
```

```css
/* src/styles/blocks/pricing.css */
.pricing-card--basic { background: var(--color-white); }
.pricing-card--highlighted { background: #e8f0ff; box-shadow: 0 4px 24px rgba(0, 102, 255, 0.12); }
.pricing-card--wealth { background: var(--color-bg); color: var(--color-navy); }

.pricing-card__check {
  opacity: 0;
  transform: scale(0);
}

@media (prefers-reduced-motion: reduce) {
  .pricing-card__check {
    opacity: 1;
    transform: none;
  }
}
```

```css
/* src/styles/animations.css */
@keyframes pricing-pulse {
  0%, 100% { transform: scale(1.03); }
  50%      { transform: scale(1.06); }
}

@media (min-width: 1024px) {
  .pricing-card--highlighted .pricing-card__inner {
    animation: pricing-pulse 3s ease-in-out infinite;
  }
}

@media (prefers-reduced-motion: reduce) {
  .pricing-card--highlighted .pricing-card__inner {
    animation: none;
    transform: none;
  }
}
```

**Registry extension:** `data-animate-on-reveal` is placed on each `PricingCard` (`<article>`). The parent `grid-3` uses `data-animate-children` — each child card animates independently with staggered delay; `onComplete` per child calls `handleOnReveal` to trigger that card's checkmark stagger.

**Variant rules:**

| Tier | `variant` | Visual | Pulse / scale |
|------|-----------|--------|---------------|
| Basic | `basic` | White background | None |
| Premium | `highlighted` | Light blue + shadow + badge | Pulse on inner wrapper, desktop only |
| Wealth | `wealth` | Navy text on light gray | None |

**CTA rules:**

| Tier | CTA | Behavior |
|------|-----|----------|
| Basic | "Get Started" | Placeholder `Button` (`disabled`, `type="button"`) |
| Premium | "Start Free Trial" | Placeholder `Button` (`disabled`, `type="button"`) |
| Wealth | "Contact Sales" | Placeholder `Button` (`disabled`, `type="button"`) |

**Accessibility requirements:**

- Heading hierarchy: `SectionShell` `h2` → `PricingCard` `h3`
- Feature list: `<ul>` with text content; checkmark span `aria-hidden="true"`
- All CTAs: `disabled` buttons with descriptive labels — not dead links
- `prefers-reduced-motion`: checkmarks visible immediately; no pulse animation
- Badge "Most Popular" exposed to screen readers via `Badge` component text

**Applies to:** `Pricing.jsx`, `PricingCard.jsx`, `src/data/pricing.js`, `styles/blocks/pricing.css`, `pricing-pulse` in `animations.css`, and `handleOnReveal` in `scrollAnimations.js`. Does not apply to any other section.

---

## About Section

**Decision:** Bespoke section via `SectionShell` with `id="about"` — short mission copy inline (no data file). Scroll reveal uses registry `fade-up` on content wrapper. Sits between `HeroSection` and `HowItWorks` in page order. Provides the `#about` anchor target for Header navigation.

**Rationale:**

- `PROJECT_SPECS.md` Header nav includes an "About" link — requires a corresponding on-page section.
- Content aligns with brand voice from specs/Footer tagline: making financial planning accessible.
- Bespoke like Hero/CTA — single block of copy, not a list-driven section.
- Uses global Composition-B (`SectionShell`) and CSS-C patterns without a dedicated pattern section.

**Implementation Pattern:**

```jsx
// src/components/sections/AboutSection.jsx
import SectionShell from '../common/SectionShell';

function AboutSection() {
  return (
    <SectionShell id="about" title="About Aim">
      <div className="about__content" data-animate="fade-up">
        <p>
          Aim makes financial planning accessible to everyone. We help young professionals
          invest, save, and plan for the goals that matter most — without the complexity
          of traditional finance tools.
        </p>
      </div>
    </SectionShell>
  );
}

export default AboutSection;
```

**Applies to:** `AboutSection.jsx`, `styles/blocks/about.css`. Header consumes `#about` via `navigation.js`.

---

## Pending Section Patterns

The following sections do not yet have dedicated pattern documentation. **Implement using global rules only** (Composition-B, CSS-C, Central Observer Registry, local state where noted) — do not block on additional pattern sections.

| Section | Status | Implement with global rules |
|---------|--------|----------------------------|
| `Header` | Pending | `navigation.js` anchors, sticky shadow, hamburger menu, `useState(menuOpen)`, `headerCta` as `disabled` `Button` |
| `Footer` | Pending | `footer.js` columns, newsletter form + validation, registry fade-in |
| `HowItWorks` | Pending | `howItWorks.js` + `SectionShell` + `grid-3` + `Card`, registry `fade-up` |
| `Features` | Pending | `features.js` + `grid-2` + `Card`, registry `fade-up` |
| `CTASection` | Pending | Bespoke + `id="cta"`, registry `fade-up`, `disabled` "Open Your Account" `Button` |

```jsx
// src/components/sections/CTASection.jsx — minimal shape
function CTASection() {
  return (
    <section id="cta" className="section cta" data-animate="fade-up">
      <div className="container">
        <h2 className="section__title">Ready to take control?</h2>
        <p className="section__subtitle">Join thousands of young professionals who are building real wealth with Aim.</p>
        <Button variant="primary" size="large" type="button" disabled>Open Your Account</Button>
        <p className="cta__reassurance">No credit card required. Takes 5 minutes.</p>
      </div>
    </section>
  );
}
```

**Scaffold cleanup:** Remove or replace Vite default styles (`src/index.css`, `src/App.css`) when wiring `main.jsx` to the layered CSS imports documented above.

**React Strict Mode:** `initScrollAnimations()` and `initHeroAnimations()` should be idempotent (guard against duplicate observers/animations on double mount in development).

**Reduced motion fallback:** `animations.css` must set final visible state for all `[data-animate]` targets when `prefers-reduced-motion: reduce` is active, since `initScrollAnimations()` returns early.

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
      TestimonialCard.jsx
      PricingCard.jsx
    sections/
      HeroSection.jsx
      AboutSection.jsx
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
    navigation.js           # Header nav links and anchor targets
  styles/
    variables.css
    globals.css
    animations.css
    blocks/
      header.css
      hero.css
      about.css
      how-it-works.css
      features.css
      pricing.css
      testimonials.css
      cta.css
      footer.css
  utils/
    scrollAnimations.js
    heroAnimations.js
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
