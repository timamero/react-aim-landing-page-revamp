## Description

**Component/Section:** [e.g., HeroSection, Features, Pricing Cards]

**What does this PR do?**
[Brief description of the changes. Reference the project specifications where applicable.]

**Specification Reference:** [Link or reference to relevant section in PROJECT_SPECS.md]

**Architecture Reference:** [If applicable, reference relevant section in ARCHITECTURE.md. If new pattern, link to ADR discussion]

---

## Type of Change

- [ ] New component/section
- [ ] Refactoring existing code
- [ ] Bug fix
- [ ] Style/animation improvements
- [ ] Responsive design update

---

## Development Process

**AI-Assisted:**

- [ ] Yes
- [ ] No

**If AI-assisted, describe:**

- Initial prompt: [Brief description]
- Number of iterations: [e.g., 1st generation, 1 refinement]
- Issues found and fixed: [List any verification failures and how they were addressed]

---

## Verification Checklist

### Code Quality

- [ ] Code follows AI Guidelines (CQ-1 through CQ-7)
- [ ] Prettier passes (`prettier --check`)
- [ ] ESLint passes (`eslint --fix`)
- [ ] No console errors or warnings
- [ ] No dead code or debug statements
- [ ] Component naming is clear and descriptive

### HTML & Semantics

- [ ] Semantic HTML used (header, nav, main, section, article, footer where appropriate)
- [ ] All images have descriptive alt text
- [ ] Form labels properly associated with inputs
- [ ] Heading hierarchy is correct (no skipped levels)

### Responsiveness

- [ ] Mobile layout (375px) tested and clean
- [ ] Tablet layout (768px) tested
- [ ] Desktop layout (1024px+) tested
- [ ] Touch targets sufficient on mobile (48px minimum)
- [ ] Images are responsive

### Design System Compliance

- [ ] Colors match palette (primary blue, navy, teal accent, etc.)
- [ ] Spacing follows scale (8px, 12px, 16px, 24px, 32px, 48px, 64px, 80px)
- [ ] Typography matches design system
- [ ] CSS uses design tokens/variables

### Animations

- [ ] Animations perform smoothly (60fps on mobile)
- [ ] `prefers-reduced-motion` respected
- [ ] Anime.js usage follows ARCHITECTURE.md patterns
- [ ] Animation timing appropriate (200-800ms)
- [ ] Animations serve a purpose (don't distract)

### Accessibility

- [ ] WCAG 2.1 AA compliant
- [ ] Color contrast meets standards (4.5:1 text, 3:1 UI)
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] ARIA attributes used appropriately (not overused)

### Performance

- [ ] Lighthouse score maintained at 85+
- [ ] Images optimized (compressed, correct format)
- [ ] No performance regressions
- [ ] Bundle size impact assessed
- [ ] Animations don't cause layout shifts

### Security

- [ ] No sensitive data in code
- [ ] User inputs sanitized (if applicable)
- [ ] No XSS vulnerabilities

---

## Screenshots / Demo

**Desktop View:**
[Attach screenshot or demo link]

**Mobile View:**
[Attach screenshot or demo link]

**Animation/Interaction Demo:**
[If applicable, describe or link to demo of animations]

---

## Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## Lighthouse Audit

**Before:** [Screenshot or scores]
**After:** [Screenshot or scores]

- Performance: \_\_\_/100
- Accessibility: \_\_\_/100
- Best Practices: \_\_\_/100
- SEO: \_\_\_/100

---

## Additional Notes

[Any other context, decisions, or considerations]

---

## Deployment Checklist

- [ ] No breaking changes to existing components
- [ ] All new dependencies are necessary and documented
- [ ] Environment variables (if any) are documented
- [ ] Ready for production deployment

---

## Reviewer Notes

**Suggested Review Focus:**
[Highlight areas you'd like reviewers to pay special attention to]

**Questions for Reviewers:**
[Any specific questions or concerns?]

---

## Self-Review Checklist (Complete Before Requesting Review)

- [ ] I have reviewed my own code
- [ ] I have verified all checklist items above
- [ ] I have tested on multiple viewports
- [ ] I have run linting and formatting tools
- [ ] I have run Lighthouse audit
- [ ] Code follows established architectural patterns
- [ ] If AI-assisted, I have verified output thoroughly
- [ ] Commit messages are clear and descriptive
- [ ] No sensitive information exposed
