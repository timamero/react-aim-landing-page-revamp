# Prompt Templates

## Architecture Decisions

### Prompt: Project-wide architecture decision

Exploration first

```
Given the specifications in PROJECT_SPECS.md and constraints (Vite, React, anime.js, vanilla CSS,
no state management), explore 2-3 architectural approaches for:

- Scroll animation management across all sections
- Component composition patterns
- CSS organization strategy

Show trade-offs in terms of maintainability, performance, and code reusability.
```

Generate report

```
Based on the exploration above, create an ARCHITECTURE.md document
that documents our decisions. Use this format:

## [Decision Name]

**Decision:** [What we chose]
**Rationale:** [Why this approach]
**Trade-offs:** [What we gave up]
**Implementation Pattern:** [Code example or pattern to follow]
**Applies to:** [Which components/sections]

Include sections for:
- Scroll Animation Management
- Component Composition
- CSS Organization Strategy
- State Management (confirming no global state)
```

### Prompt: Component-specific only when needed

Exploration first

```
Given the architecture approach we've chosen [reference decision],
explore implementation options for [Header/HeroSection/Testimonials Carousel].
What are the key architectural decisions specific to this component?
```

Generate report if needed

```
This component has a unique architectural need: [describe it]

Add a new section to ARCHITECTURE.md called "[Component Name] Pattern"
following the established format.
```

### Considerations

Components worth exploring individually:

- HeroSection (complex animations)
- Testimonials (carousel/interaction pattern)
- Pricing (interactivity)

Components that follow patterns:

- Header/Footer (standard nav patterns)
- Features/Cards (simple, reusable)
- CTA Section (straightforward)

## Code Generation

```
You are building the [HeroSection] component.

Reference these documents:
- PROJECT_SPECS.md (for requirements)
- AI_GUIDELINES.md (for code quality standards)
- ARCHITECTURE.md (for architectural patterns)

Generate the [HeroSection] following these established patterns...
```
