# AI Guidelines for Website Development

## Finance App Landing Page (Revamp)

These guidelines ensure maintainability, performance, security, and code quality when using AI to assist development. **MUST** rules are required; **SHOULD** rules are strongly recommended; **CONSIDER** rules are situational best practices.

---

## 1 — Before Development

- **BP-1 (MUST)** Provide AI with detailed component requirements, including layout, responsiveness, and interactions.
- **BP-2 (MUST)** Specify design system details (colors, spacing, typography) to ensure consistency.
- **BP-3 (SHOULD)** Identify responsive breakpoints and mobile-first requirements upfront.
- **BP-4 (CONSIDER)** Document any animation or interaction requirements clearly before requesting code.

---

## 2 — Web Development Standards

- **WD-1 (MUST)** Follow semantic HTML principles and ensure proper accessibility attributes (alt text, ARIA labels, heading hierarchy).
- **WD-2 (MUST)** Implement responsive design patterns that work across all device sizes (mobile-first approach).
- **WD-3 (SHOULD)** Optimize for Core Web Vitals (LCP, FID, CLS) through image optimization and efficient animations.
- **WD-4 (SHOULD)** Use progressive enhancement principles - ensure content is readable without JavaScript.
- **WD-5 (MUST)** Validate all user inputs (contact forms, email subscriptions) on the client side.
- **WD-6 (SHOULD)** Implement proper error states for forms and interactions (e.g., failed submissions).

---

## 3 — Code Quality & Styling

- **CQ-1 (MUST)** Keep component code clean and readable; avoid excessive nesting and long functions.
- **CQ-2 (MUST)** Use consistent naming conventions for classes, variables, and components across all files.
- **CQ-3 (SHOULD)** Use CSS utility classes or CSS modules for styling to avoid naming conflicts.
- **CQ-4 (MUST)** Extract repeated styles into reusable CSS variables or utility classes.
- **CQ-5 (CONSIDER)** Use CSS-in-JS sparingly; prefer external stylesheets for landing pages.
- **CQ-6 (SHOULD)** Avoid deep nesting in CSS; keep selectors simple and maintainable.
- **CQ-7 (SHOULD NOT)** Add comments except for critical design decisions; let code be self-documenting.

---

## 4 — Component Architecture

- **CA-1 (SHOULD)** Keep components focused on a single responsibility (header, hero, feature section, footer, etc.).
- **CA-2 (MUST)** Use clear, descriptive component names that match their purpose (e.g., `HeroSection`, `FeatureCard`, `CTAButton`).
- **CA-3 (SHOULD)** Extract reusable components (buttons, cards, sections) to reduce duplication.
- **CA-4 (SHOULD)** Use props for component flexibility (text, images, links) to support reusability.
- **CA-5 (MUST)** Implement proper prop defaults and validation for optional props.
- **CA-6 (SHOULD)** Separate UI components from layout components for clarity.

---

## 5 — Animations & Interactions

- **AI-1 (MUST)** Use anime.js for consistent, performant animations across the site.
- **AI-2 (SHOULD)** Verify all animations perform smoothly (60fps) on mobile devices.
- **AI-3 (SHOULD)** Implement animations that enhance UX, not distract from it.
- **AI-4 (CONSIDER)** Use CSS animations for simple transitions; reserve JavaScript animations for complex sequences.
- **AI-5 (MUST)** Test animations with `prefers-reduced-motion` media query for accessibility compliance.

---

## 6 — Testing Strategy

- **TS-1 (SHOULD)** Test critical user flows manually across different browsers and devices.
- **TS-2 (SHOULD)** Verify responsive behavior at key breakpoints (mobile 375px, tablet 768px, desktop 1024px+).
- **TS-3 (SHOULD)** Test accessibility with keyboard navigation and screen reader simulation.
- **TS-4 (CONSIDER)** Add unit tests for complex utility functions or form validation logic.
- **TS-5 (MUST)** Verify form submissions work correctly and display appropriate success/error messages.
- **TS-6 (SHOULD)** Test cross-browser compatibility (Chrome, Firefox, Safari, Edge).

---

## 7 — Performance & Optimization

- **PO-1 (MUST)** Optimize all images for web (use WebP with fallbacks, responsive sizes).
- **PO-2 (MUST)** Lazy-load images below the fold to improve initial page load.
- **PO-3 (SHOULD)** Keep JavaScript bundle size minimal; avoid unnecessary dependencies.
- **PO-4 (SHOULD)** Implement proper caching strategies for static assets.
- **PO-5 (SHOULD)** Monitor and maintain good Lighthouse scores (85+).
- **PO-6 (CONSIDER)** Use a CDN for image and asset delivery if performance is critical.

---

## 8 — Security & Privacy

- **SP-1 (MUST)** Sanitize all user inputs from forms to prevent XSS attacks.
- **SP-2 (SHOULD)** Use HTTPS everywhere and implement proper CORS policies.
- **SP-3 (SHOULD)** Never expose sensitive data in client-side code, logs, or environment files.
- **SP-4 (SHOULD)** Implement rate limiting on form submissions to prevent spam.
- **SP-5 (MUST)** Validate all form inputs on both client and server side.

---

## 9 — Code Organization

- **CO-1 (MUST)** Use a clear folder structure:

```
src/
  components/
    common/           # Reusable components (Button, Card, etc.)
    sections/         # Page sections (Hero, Features, CTA, Footer, etc.)
  styles/
    globals.css       # Global styles and CSS variables
    variables.css     # Design tokens (colors, spacing, typography)
  utils/              # Utility functions (form validation, helpers)
  assets/             # Images, icons, fonts
```

- **CO-2 (MUST)** Create one component per file for clarity and maintainability.
- **CO-3 (SHOULD)** Use barrel exports (`index.js`) for clean imports.
- **CO-4 (SHOULD)** Store design tokens (colors, spacing) in CSS variables for consistency.

---

## 10 — Tooling & Quality Gates

- **TQ-1 (MUST)** `prettier --check` passes on all files.
- **TQ-2 (MUST)** `eslint --fix` passes with zero warnings.
- **TQ-3 (SHOULD)** Use pre-commit hooks to enforce formatting and linting.
- **TQ-4 (SHOULD)** Run Lighthouse audits before deployment.

---

## 11 — Git & Deployment

- **GD-1 (MUST)** Use Conventional Commits format: `<type>: <description>`
  - Types: `feat`, `fix`, `style`, `refactor`, `perf`, `docs`
  - Example: `feat: add animated feature cards` or `fix: improve hero section responsiveness`
- **GD-2 (SHOULD NOT)** Reference AI tools in commit messages; focus on the change itself.
- **GD-3 (MUST)** Use feature branches for all changes before merging to main.
- **GD-4 (SHOULD)** Include manual testing verification before merging.

---

## AI Code Generation Checklist

Before accepting AI-generated code, verify:

1. **HTML Structure**: Semantic elements used? Accessibility attributes present?
2. **Responsiveness**: Mobile-first approach? Media queries at correct breakpoints?
3. **Styling**: Follows design system? CSS variables used? No inline styles (except dynamic)?
4. **Performance**: Images optimized? No unnecessary re-renders? Animations smooth?
5. **Accessibility**: Keyboard navigation works? Color contrast sufficient? Alt text present?
6. **Browser Compatibility**: Works across major browsers?
7. **Code Quality**: Clean, readable, maintainable? No dead code or console logs?
8. **Security**: User inputs validated? No sensitive data exposed?

---

## Project-Specific Guidelines

### Design System

- Use consistent spacing scale: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px
- Maintain consistent typography hierarchy (no more than 3 font sizes)
- Define a limited color palette with semantic naming

### Animations

- Use anime.js for coordinated animations across multiple elements
- Keep animations under 500ms for UI feedback, under 1s for decorative elements
- Always test with `prefers-reduced-motion` enabled

### Forms

- Provide clear validation feedback (error messages, success states)
- Ensure form labels are properly associated with inputs
- Test with keyboard-only navigation

### Mobile-First Development

- Start with mobile (375px) viewport
- Add features/complexity at tablet (768px) and desktop (1024px+) breakpoints
- Test touch interactions on actual devices

---

## Productivity Shortcuts

### XFRESH

```
Understand all BEST PRACTICES in this guide.
Your code MUST ALWAYS follow these web development standards.
Focus on performance, accessibility, and user experience.
```

### XBUILD

```
Implement your plan following these steps:
1. Create/update components with proper semantic HTML
2. Implement responsive styles with mobile-first approach
3. Ensure accessibility compliance (ARIA, keyboard nav, color contrast)
4. Test on mobile, tablet, and desktop viewports
5. Run prettier, eslint, and Lighthouse audits
6. Verify performance impact
```

### XAUDIT

```
You are a SENIOR FRONTEND ARCHITECT performing a thorough code review.
Analyze every major change using:
1. HTML semantic structure and accessibility
2. Responsive design implementation (mobile-first)
3. CSS organization and maintainability
4. Performance implications
5. Cross-browser compatibility
6. Security considerations
```

### XPERF

```
Analyze performance implications of your changes:
1. Image optimization and lazy-loading
2. CSS/JS bundle size impact
3. Animation smoothness (60fps)
4. Core Web Vitals impact
5. Mobile performance considerations
Suggest optimizations if needed.
```

### XTEST

```
Create a comprehensive testing checklist:
- Happy path on desktop, tablet, mobile
- Form submission with valid/invalid inputs
- Keyboard navigation and screen reader testing
- Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- Animation smoothness and accessibility
Sort by user impact.
```
