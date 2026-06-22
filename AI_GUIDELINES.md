## 0 — AI Guidelines for Website Development

### Finance App Landing Page (Revamp)

These guidelines enable effective AI-assisted development through a human-in-the-loop, iterative workflow. The process follows a cycle of AI generation, human verification, refinement, testing, and integration. **MUST** rules are enforced checkpoints; **SHOULD** rules are strongly recommended; **CONSIDER** rules are situational best practices.

### Phase 1: Planning & Specifications

- Define clear requirements, constraints, and design goals
- Create detailed specifications for AI to understand scope
- Establish project-specific guidelines (this document)

### Phase 2: Iterative Development Cycle

For each feature or component:

1. **Generation (AI):** Generate code based on detailed specifications and these guidelines
2. **Verification (Human):** Review generated code against the checklists and standards
3. **Decision:** Either accept, request regeneration with updated specs, or manually refactor
4. **Refinement:** Apply manual refactoring or request AI improvements iteratively
5. **Testing (Human):** Validate functionality, performance, and accessibility
6. **Integration:** Merge verified code into main codebase with clear commit message

**Key Principle:** AI assists, human verifies. Always review, never blindly accept.

## 1 — Effective AI Prompting

When requesting AI to generate or refactor code:

- **SP-1 (MUST)** Provide clear, detailed specifications including layout, functionality, and constraints
- **SP-2 (MUST)** Reference these guidelines explicitly: "Follow the project's AI Guidelines document"
- **SP-3 (SHOULD)** Include existing code snippets for context and consistency
- **SP-4 (SHOULD)** Specify design system details (colors, spacing, typography, breakpoints)
- **SP-5 (SHOULD)** List explicit requirements (accessibility, browser support, performance targets)
- **SP-6 (CONSIDER)** Provide examples of similar components or styles in the codebase
- **SP-7 (SHOULD NOT)** Make vague requests; specificity reduces iteration cycles

### Prompting Templates

Refer to the file [prompt-templates.md](./prompt-templates.md)

## 2 — Before Development

- **BP-1 (MUST)** Provide AI with detailed component requirements, including layout, responsiveness, and interactions.
- **BP-2 (MUST)** Specify design system details (colors, spacing, typography) to ensure consistency.
- **BP-3 (SHOULD)** Identify responsive breakpoints and mobile-first requirements upfront.
- **BP-4 (CONSIDER)** Document any animation or interaction requirements clearly before requesting code.

## 3 — Web Development Standards

- **WD-1 (MUST)** Follow semantic HTML principles and ensure proper accessibility attributes (alt text, ARIA labels, heading hierarchy).
- **WD-2 (MUST)** Implement responsive design patterns that work across all device sizes (mobile-first approach).
- **WD-3 (SHOULD)** Optimize for Core Web Vitals (LCP, FID, CLS) through image optimization and efficient animations.
- **WD-4 (SHOULD)** Use progressive enhancement principles - ensure content is readable without JavaScript.
- **WD-5 (MUST)** Validate all user inputs (contact forms, email subscriptions) on the client side.
- **WD-6 (SHOULD)** Implement proper error states for forms and interactions (e.g., failed submissions).

## 4 — Code Quality & Styling

- **CQ-1 (MUST)** Keep component code clean and readable; avoid excessive nesting and long functions.
- **CQ-2 (MUST)** Use consistent naming conventions for classes, variables, and components across all files.
- **CQ-3 (SHOULD)** Use CSS utility classes or CSS modules for styling to avoid naming conflicts.
- **CQ-4 (MUST)** Extract repeated styles into reusable CSS variables or utility classes.
- **CQ-5 (CONSIDER)** Use CSS-in-JS sparingly; prefer external stylesheets for landing pages.
- **CQ-6 (SHOULD)** Avoid deep nesting in CSS; keep selectors simple and maintainable.
- **CQ-7 (SHOULD NOT)** Add comments except for critical design decisions; let code be self-documenting.

## 5 — Component Architecture

- **CA-1 (SHOULD)** Keep components focused on a single responsibility (header, hero, feature section, footer, etc.).
- **CA-2 (MUST)** Use clear, descriptive component names that match their purpose (e.g., `HeroSection`, `FeatureCard`, `CTAButton`).
- **CA-3 (SHOULD)** Extract reusable components (buttons, cards, sections) to reduce duplication.
- **CA-4 (SHOULD)** Use props for component flexibility (text, images, links) to support reusability.
- **CA-5 (MUST)** Implement proper prop defaults and validation for optional props.
- **CA-6 (SHOULD)** Separate UI components from layout components for clarity.

- **TS-1 (SHOULD)** Test critical user flows manually across different browsers and devices.
- **TS-2 (SHOULD)** Verify responsive behavior at key breakpoints (mobile 375px, tablet 768px, desktop 1024px+).
- **TS-3 (SHOULD)** Test accessibility with keyboard navigation and screen reader simulation.
- **TS-4 (CONSIDER)** Add unit tests for complex utility functions or form validation logic.
- **TS-5 (MUST)** Verify form submissions work correctly and display appropriate success/error messages.
- **TS-6 (SHOULD)** Test cross-browser compatibility (Chrome, Firefox, Safari, Edge).

## 6 — Animations & Interactions

- **AI-1 (MUST)** Use anime.js for consistent, performant animations across the site.
- **AI-2 (SHOULD)** Verify all animations perform smoothly (60fps) on mobile devices.
- **AI-3 (SHOULD)** Implement animations that enhance UX, not distract from it.
- **AI-4 (CONSIDER)** Use CSS animations for simple transitions; reserve JavaScript animations for complex sequences.
- **AI-5 (MUST)** Test animations with `prefers-reduced-motion` media query for accessibility compliance.

## 7 — Verification & Review

This section is critical to the AI-assisted workflow. Every AI-generated code must pass these verification gates.

### Initial Verification Checklist (Before Acceptance)

- **VR-1 (MUST)** HTML uses semantic elements and includes accessibility attributes (alt text, ARIA labels)
- **VR-2 (MUST)** Responsive design implemented correctly at mobile (375px), tablet (768px), desktop (1024px+)
- **VR-3 (MUST)** Styling follows design system (colors, spacing, typography match specifications)
- **VR-4 (MUST)** No console errors or warnings; code passes linting without issues
- **VR-5 (MUST)** Form inputs (if any) are validated client-side; error messages are user-friendly
- **VR-6 (SHOULD)** Code is clean, readable, and maintainable; no dead code or unnecessary comments
- **VR-7 (SHOULD)** Security considerations met (inputs sanitized, no sensitive data exposed)
- **VR-8 (SHOULD)** Performance is acceptable (images optimized, no rendering bottlenecks)

### Decision Tree After Verification

```
Does code pass all MUST checks?
├─ YES: Accept and move to testing phase
└─ NO: Choose one approach:
    ├─ Minor fixes needed: Request AI refinement with specific feedback
    ├─ Major issues: Request AI regeneration with updated specifications
    └─ Structural problems: Manual refactor or request architectural review from AI
```

### When to Regenerate vs. Refactor

- **Regenerate (AI):** When specifications weren't clear, entire component structure is wrong, or multiple verification checks fail
- **Refactor (Manual):** When code is mostly good but needs minor adjustments, spacing tweaks, or edge case handling
- **Refactor (AI-Assisted):** When issues are systematic (e.g., all media queries off, or naming conventions inconsistent)

## 8 — Performance & Optimization

- **PO-1 (MUST)** Optimize all images for web (use WebP with fallbacks, responsive sizes).
- **PO-2 (MUST)** Lazy-load images below the fold to improve initial page load.
- **PO-3 (SHOULD)** Keep JavaScript bundle size minimal; avoid unnecessary dependencies.
- **PO-4 (SHOULD)** Implement proper caching strategies for static assets.
- **PO-5 (SHOULD)** Monitor and maintain good Lighthouse scores (85+).
- **PO-6 (CONSIDER)** Use a CDN for image and asset delivery if performance is critical.

## 9 — Security & Privacy

- **SP-1 (MUST)** Sanitize all user inputs from forms to prevent XSS attacks.
- **SP-2 (SHOULD)** Use HTTPS everywhere and implement proper CORS policies.
- **SP-3 (SHOULD)** Never expose sensitive data in client-side code, logs, or environment files.
- **SP-4 (SHOULD)** Implement rate limiting on form submissions to prevent spam.
- **SP-5 (MUST)** Validate all form inputs on both client and server side.

## 10 — Code Organization

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

## 11 — Tooling & Quality Gates

- **TQ-1 (MUST)** `prettier --check` passes on all files.
- **TQ-2 (MUST)** `eslint --fix` passes with zero warnings.
- **TQ-3 (SHOULD)** Use pre-commit hooks to enforce formatting and linting.
- **TQ-4 (SHOULD)** Run Lighthouse audits before deployment.

## 12 — Git & Deployment

- Git commits, pull requests, and merging will be done manually.

## 13 — AI Code Verification & Acceptance

This section formalizes the verification process every AI-generated component must pass.

### Code Review Checklist (Required Before Merging)

**HTML & Accessibility**

- [ ] Uses semantic HTML (header, nav, main, section, article, footer, etc.)
- [ ] All images have descriptive alt text
- [ ] Form labels properly associated with inputs
- [ ] Heading hierarchy is correct (no skipped levels)
- [ ] ARIA attributes used appropriately (not overused)
- [ ] Keyboard navigation works throughout component

**Responsive Design**

- [ ] Mobile layout (375px) is clean and readable
- [ ] Tablet layout (768px) looks appropriate
- [ ] Desktop layout (1024px+) follows design system
- [ ] Media queries use correct breakpoints
- [ ] Touch targets are sufficient on mobile (48px minimum)
- [ ] Images are responsive (srcset or CSS sizing)

**Styling & Design System**

- [ ] Colors match design system specifications
- [ ] Spacing uses defined scale (4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px)
- [ ] Typography matches design system (font sizes, weights, line heights)
- [ ] CSS uses design tokens (variables) consistently
- [ ] No magic numbers in CSS
- [ ] No inline styles (except dynamic values)

**Code Quality**

- [ ] Component name is descriptive and matches file name
- [ ] No dead code, console logs, or debug statements
- [ ] Props have clear, descriptive names
- [ ] Code is readable without extensive comments
- [ ] No unnecessary nesting or overly complex selectors

**Performance & Accessibility**

- [ ] Images are optimized (compressed, correct format)
- [ ] Animations test well with `prefers-reduced-motion`
- [ ] Animations are smooth (60fps) on mobile devices
- [ ] No performance red flags (avoid transform expensive properties on every frame)
- [ ] Lighthouse score maintained at 85+

**Security & Validation**

- [ ] Form inputs are validated
- [ ] Error messages are user-friendly and helpful
- [ ] No sensitive data in code or console
- [ ] XSS vulnerabilities addressed

### Verification Sign-Off

Before accepting AI-generated code, a human reviewer must:

1. ✅ Run through the checklist above
2. ✅ Test responsiveness on multiple devices
3. ✅ Test keyboard navigation
4. ✅ Verify accessibility with screen reader
5. ✅ Run linting and Prettier
6. ✅ Run Lighthouse audit
7. ✅ Make decision: Accept / Regenerate / Refactor

## 14 — Project-Specific Guidelines

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

## 15 — Productivity Shortcuts

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

## 16 — The Human-in-the-Loop Philosophy

These guidelines exist to enable **efficient AI-assisted development without sacrificing code quality**.

### Core Principles

1. **AI accelerates, humans verify:** AI generates code quickly; humans ensure it meets standards
2. **Iterative, not one-shot:** Expect to regenerate or refactor; this is normal and expected
3. **Detailed specs reduce iterations:** Clear specifications lead to better first-generation code
4. **Verification is non-negotiable:** Every checklist item matters; don't skip for speed
5. **Smart regeneration:** If code fails verification, regenerate with updated specs rather than struggling through refactoring
6. **Security and accessibility first:** Never trade quality on these for speed
7. **Documentation matters:** Clear commit messages and code help future refactoring

### Expected Workflow

- **Week 1:** Establish guidelines, create project specs, set up folder structure (40% AI, 60% human)
- **Week 2-3:** Generate components iteratively, verify, refine (70% AI, 30% human)
- **Week 4:** Polish, optimize, final testing (30% AI, 70% human)

### Success Metrics

- ✅ All code passes verification checklist
- ✅ Lighthouse scores maintained at 85+
- ✅ Zero accessibility violations
- ✅ Clean Git history with descriptive commits
- ✅ Code is maintainable by someone unfamiliar with the project
- ✅ Development was faster than solo development without sacrificing quality
