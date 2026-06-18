# Aim - Finance App Landing Page Specifications

## Project Overview

**Name:** Aim  
**Purpose:** Landing page for a modern fintech app designed for young professionals  
**Target Audience:** Ages 25-40, digitally native professionals seeking financial growth  
**Tone:** Professional yet approachable, trustworthy, forward-thinking  
**Design Philosophy:** Modern, clean, spacious. Serious about finance but not stuffy. Empowering without being overwhelming.

---

## Design System

### Color Palette

**Primary Colors:**

- **Primary Blue:** `#0066FF` - Primary actions, key highlights
- **Deep Navy:** `#001A4D` - Text, headings, serious elements
- **Accent Teal:** `#00D4AA` - Secondary actions, success states, complementary highlights
- **Light Gray:** `#F5F7FA` - Backgrounds, card containers
- **White:** `#FFFFFF` - Main background, cards

**Neutral Colors:**

- **Dark Text:** `#1A1A2E` - Primary text
- **Medium Text:** `#525252` - Secondary text, body copy
- **Light Text:** `#8B92A0` - Tertiary text, labels
- **Border:** `#E0E3EB` - Subtle borders, dividers

**Semantic Colors:**

- **Success:** `#00D4AA` (matches accent teal)
- **Warning:** `#FFB81C`
- **Error:** `#FF4444`
- **Info:** `#0066FF` (matches primary blue)

### Typography

**Font Family:** Inter (system fallback: -apple-system, BlinkMacSystemFont, Segoe UI)

**Scale:**

- **H1:** 48px / 56px line-height (Hero titles)
- **H2:** 36px / 44px line-height (Section titles)
- **H3:** 24px / 32px line-height (Card titles, subsections)
- **H4:** 18px / 26px line-height (Component titles)
- **Body Large:** 16px / 24px line-height (Main body text)
- **Body Regular:** 14px / 22px line-height (Secondary text)
- **Body Small:** 12px / 18px line-height (Labels, captions)

**Font Weights:** 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)

### Spacing Scale

8px, 12px, 16px, 24px, 32px, 48px, 64px, 80px, 96px

### Responsive Breakpoints

- **Mobile:** 375px - 479px
- **Tablet:** 480px - 1023px
- **Desktop:** 1024px+
- **Large Desktop:** 1440px+

---

## Pages

The landing page consists of a **single-page design** with multiple sections. Navigation scrolls to anchor links.

### 1. Navigation & Header

**Component:** `Header`

Fixed/sticky navigation bar at the top.

**Content:**

- Logo: "Aim" (text-based, bold)
- Navigation Links: About, Features, Pricing, Get Started
- CTA Button: "Open Account" (Primary Blue, hover effect)

**Behavior:**

- Sticky positioning, slight shadow on scroll
- Mobile: Hamburger menu that slides from right
- Links scroll to respective sections

**Animation:**

- Logo scales slightly on hover (anime.js)
- Navigation items fade in on load (staggered)
- Mobile menu slides in from right (500ms ease)

---

### 2. Hero Section

**Component:** `HeroSection`

Full-viewport hero with strong visual hierarchy.

**Content:**

- **Headline:** "Take control of your financial future"
- **Subheadline:** "Aim makes it simple to invest, save, and plan for the goals that matter most to you. Whether you're saving for a home, retirement, or just building wealth, we've got the tools to get you there."
- **Primary CTA:** "Get Started Free" (Blue button, large)
- **Secondary CTA:** "Watch How It Works" (Text link with arrow)
- **Visual Element:** Abstract geometric shapes in background (teal and blue gradient, subtle animation)

**Layout:**

- Left side: Text content (60% width on desktop)
- Right side: Animated shapes/illustration
- Centered on mobile

**Animation:**

- Hero text elements fade and slide up from bottom on load (staggered timing)
- Background shapes gently drift/pulse (continuous, subtle)
- Buttons have glow effect on hover (anime.js)
- Scroll trigger: shapes rotate slowly as user scrolls

---

### 3. How It Works Section

**Component:** `HowItWorks`

Explains the product value in 3 simple steps.

**Content:**

**Section Title:** "Three simple steps to financial confidence"

**Step 1: Connect**

- Icon: Link/connect icon (teal)
- Headline: "Connect your accounts"
- Body: "Link your bank accounts, investment accounts, and cards to get a complete picture of your financial life. Aim keeps your data secure with enterprise-grade encryption."

**Step 2: Automate**

- Icon: Automation/gears icon (blue)
- Headline: "Automate your savings"
- Body: "Set goals and let Aim automate your savings. From automatic transfers to smart investment recommendations, take the guesswork out of growing your wealth."

**Step 3: Grow**

- Icon: Growth chart icon (teal)
- Headline: "Watch your wealth grow"
- Body: "Get insights into your spending, personalized investment strategies, and progress toward your goals. Aim helps you make smarter financial decisions."

**Layout:**

- Three equal-width cards on desktop
- Vertical stack on mobile
- Icons positioned above text in cards
- Cards have subtle border and light background

**Animation:**

- Cards fade and slide up on scroll (IntersectionObserver)
- Icons scale and rotate on scroll or on hover
- Number counters animate when visible (e.g., "3 steps" animates from 0 to 3)
- Connecting lines between steps animate on scroll

---

### 4. Features Section

**Component:** `Features`

Highlights key product features and differentiators.

**Section Title:** "Everything you need to achieve your goals"

**Features (2-column grid on desktop, 1-column on mobile):**

**Feature 1: Smart Goal Planning**

- Icon: Target icon
- Title: "Smart Goal Planning"
- Description: "Break down your big financial dreams into achievable milestones. Aim's goal-tracking tools help you stay motivated and on track."

**Feature 2: Portfolio Analysis**

- Icon: Chart/graph icon
- Title: "Portfolio Analysis"
- Description: "Get a clear view of how your money is allocated across investments. Understand risk, diversification, and potential returns all in one place."

**Feature 3: Automated Investing**

- Icon: Robot/automation icon
- Title: "Automated Investing"
- Description: "Invest on autopilot with intelligent rebalancing and strategic asset allocation. Less time managing, more time living."

**Feature 4: Spending Insights**

- Icon: Pie chart icon
- Title: "Spending Insights"
- Description: "Understand your spending patterns with detailed analytics. Identify opportunities to save and get personalized recommendations."

**Feature 5: Tax-Efficient Strategies**

- Icon: Calculator icon
- Title: "Tax-Efficient Strategies"
- Description: "Minimize taxes with harvest loss harvesting and strategic withdrawal planning. Keep more of what you earn."

**Feature 6: 24/7 Support**

- Icon: Support/chat icon
- Title: "24/7 Support"
- Description: "Questions? Our financial advisors are here to help anytime. Chat, email, or phone support available round the clock."

**Layout:**

- Feature cards with icon, title, and description
- Icon background circle (light teal)
- Subtle hover effect: shadow increase and slight lift

**Animation:**

- Cards stagger in from bottom on scroll
- Icons rotate slightly on hover
- Cards have smooth shadow transition on hover (anime.js)

---

### 5. Pricing Section

**Component:** `Pricing`

Transparent pricing for different user types.

**Section Title:** "Simple, transparent pricing"
**Subtitle:** "No hidden fees. Cancel anytime."

**Pricing Tiers:**

**Tier 1: Basic**

- Price: "Free"
- Features:
  - Account connections
  - Basic goal tracking
  - Spending analytics
  - Mobile & web access
- CTA: "Get Started"
- Visual: Light background (white)

**Tier 2: Premium**

- Price: "$8.99/month"
- Features:
  - Everything in Basic
  - Automated investing
  - Advanced portfolio analysis
  - Tax optimization tools
  - Priority support
- CTA: "Start Free Trial"
- Visual: Highlighted background (light blue/accent), slight shadow
- Badge: "Most Popular"

**Tier 3: Wealth**

- Price: "$19.99/month"
- Features:
  - Everything in Premium
  - 1-on-1 advisor sessions
  - Comprehensive financial planning
  - Wealth transfer strategies
  - Dedicated account manager
- CTA: "Contact Sales"
- Visual: Dark background (deep navy text on light gray)

**Layout:**

- Three equal-width columns on desktop
- Vertical stack on mobile
- Cards contain feature list with checkmarks
- Pricing clearly displayed

**Animation:**

- Cards fade in on scroll
- "Most Popular" tier scales up slightly (continuous gentle pulse)
- CTA buttons have hover glow effect
- Checkmarks animate on card entry (staggered)

---

### 6. Testimonials Section

**Component:** `Testimonials`

Social proof from real users.

**Section Title:** "Trusted by thousands"

**Testimonials (3 on desktop, 1 per view on mobile carousel):**

**Testimonial 1:**

- Quote: "Aim took the stress out of managing my investments. I finally feel in control of my financial future."
- Author: "Sarah Chen, 28"
- Role: "Product Manager, Tech Startup"
- Avatar: (Profile placeholder)

**Testimonial 2:**

- Quote: "The automated investing feature saved me hours every month. Now I can focus on what matters—building my career."
- Author: "Marcus Johnson, 34"
- Role: "Entrepreneur"
- Avatar: (Profile placeholder)

**Testimonial 3:**

- Quote: "Best financial app I've tried. The insights are actually useful, not just pretty dashboards."
- Author: "Emma Rodriguez, 31"
- Role: "Design Director"
- Avatar: (Profile placeholder)

**Layout:**

- Card-based design with quote, name, role, avatar
- Cards have subtle border and white background
- Carousel on mobile

**Animation:**

- Cards slide in from left/right on scroll
- Testimonials carousel auto-rotates (10s interval) on desktop, swipeable on mobile
- Fade transition between slides (1s)

---

### 7. Call-to-Action Section

**Component:** `CTA`

Final push to convert.

**Section Title:** "Ready to take control?"
**Subtitle:** "Join thousands of young professionals who are building real wealth with Aim."
**Primary CTA:** "Open Your Account" (Large blue button)
**Secondary Text:** "No credit card required. Takes 5 minutes."

**Layout:**

- Centered text
- Large buttons
- Light background with subtle accent color border

**Animation:**

- Text fades in from top
- Buttons fade in with slight scale effect
- Button has pulsing glow on hover (continuous)

---

### 8. Footer

**Component:** `Footer`

Navigation and company information.

**Content:**

**Column 1: Aim**

- Logo
- "Making financial planning accessible to everyone."

**Column 2: Product**

- Features
- Pricing
- Security
- Mobile App

**Column 3: Company**

- About Us
- Blog
- Careers
- Contact

**Column 4: Legal**

- Terms of Service
- Privacy Policy
- Cookie Policy
- Security

**Column 5: Social**

- Twitter
- LinkedIn
- Instagram
- Facebook

**Bottom:**

- Copyright: "© 2024 Aim, Inc. All rights reserved."
- Newsletter signup: "Get financial tips and updates" (email input + subscribe button)

**Layout:**

- Multi-column grid on desktop
- Stacked on mobile
- Dark background (Deep Navy)
- White text

**Animation:**

- Columns fade in on scroll
- Links have underline animation on hover (anime.js)

---

## Component Library

### Reusable Components

**Button**

- Variants: Primary (blue), Secondary (teal), Text (underline)
- States: Default, hover (glow/scale), active, disabled
- Sizes: Small, medium, large
- Animation: Smooth hover effects (anime.js)

**Card**

- Base card with optional border, shadow
- Hover state: Shadow increase, subtle lift
- Animation: Fade in on scroll

**Icon Button**

- Icon + optional label
- Hover states with rotation/scale

**Badge**

- Text + background color
- Used for "Most Popular" labels, status indicators

**Input/Form Fields**

- Text input with label and error state
- Smooth focus animations
- Error message display

**Section Container**

- Max-width wrapper
- Padding/margin management
- Background color options

**Grid/Flex Utilities**

- Responsive grid system
- Flex layouts for alignment

---

## Animation Strategy

### Principles

- **Purpose-driven:** Animations enhance UX, not distract
- **Performance:** 60fps target, use transform/opacity
- **Accessibility:** Respect `prefers-reduced-motion` setting
- **Timing:** Animations 200-800ms depending on purpose
- **Library:** anime.js for complex animations

### Key Animation Types

**Scroll Animations (On-Scroll Reveal)**

- Cards, sections fade and slide up as user scrolls
- Elements use IntersectionObserver to trigger
- Easing: easeOutQuad (0.25, 0.46, 0.45, 0.94)
- Duration: 600ms

**Hover Animations**

- Buttons: Scale + glow (anime.js)
- Cards: Shadow lift + scale
- Links: Underline reveal
- Duration: 300ms

**Load Animations (Page Load)**

- Hero elements stagger in from top/bottom
- Timing: Each element 100ms apart
- Duration: 500ms per element
- Easing: easeOutQuart

**Continuous Animations**

- Background shapes drift/pulse
- "Most Popular" badge pulse
- Duration: 2-4s, loop
- Easing: easeInOutQuad

**Micro-interactions**

- Form validation: checkmark animation
- Number counters: digit roll up
- Toggle switches: smooth transition

### Animation Specifications

**Hero Section Shapes:**

```
- Rotate: 0° to 360° over 8s (loop)
- Opacity: 0.5 to 0.8 pulse over 3s
- Scale: 1 to 1.05 over 2s (ease in/out)
```

**Section Cards (On Scroll):**

```
- translateY: 40px to 0
- opacity: 0 to 1
- Duration: 600ms
- Easing: easeOutQuad
- Stagger: 100ms between cards
```

**Button Hover (Glow):**

```
- Box shadow: none to (0 0 20px rgba(0, 102, 255, 0.5))
- Scale: 1 to 1.05
- Duration: 300ms
- Easing: easeOutQuad
```

**Navigation on Scroll:**

```
- Background: transparent to rgba(255, 255, 255, 0.95)
- Shadow: none to 0 2px 12px rgba(0, 0, 0, 0.1)
- Duration: 300ms (smooth transition)
```

---

## Responsive Design

### Mobile-First Approach

**Mobile (375px - 479px):**

- Single column layout
- Full-width cards
- Hamburger navigation
- Touch-friendly button sizes (48px min)
- Font sizes scaled down appropriately
- Padding/margins adjusted for mobile

**Tablet (480px - 1023px):**

- Two-column grids where appropriate
- Increased padding
- Some elements still stack vertically

**Desktop (1024px+):**

- Full multi-column layouts
- Maximum widths imposed (1200px-1440px)
- Hover states visible

### Media Queries

```css
/* Mobile: 375px - 479px */
/* Tablet: 480px - 1023px */
@media (min-width: 480px) {
}
@media (min-width: 768px) {
}
@media (min-width: 1024px) {
}
@media (min-width: 1440px) {
}
```

---

## Accessibility Requirements

- ✅ WCAG 2.1 AA compliance
- ✅ Semantic HTML (header, nav, main, section, article, footer)
- ✅ Alt text for all images/icons
- ✅ Proper heading hierarchy (no skipped levels)
- ✅ Color contrast: 4.5:1 for text, 3:1 for UI components
- ✅ Keyboard navigation fully functional
- ✅ Focus indicators visible
- ✅ Form labels properly associated with inputs
- ✅ ARIA attributes where necessary
- ✅ `prefers-reduced-motion` respected (disable animations)

---

## Performance Targets

- **Lighthouse Score:** 85+
- **Core Web Vitals:**
  - LCP (Largest Contentful Paint): < 2.5s
  - FID (First Input Delay): < 100ms
  - CLS (Cumulative Layout Shift): < 0.1
- **Bundle Size:** < 200kb (gzipped)
- **Time to Interactive:** < 3s
- **Image Optimization:** WebP with fallbacks, lazy loading for below-fold

---

## Content Guidelines

### Tone

- Professional but warm
- Jargon-free or explained clearly
- Empowering, not condescending
- Action-oriented
- Trustworthy and confident

### Voice

- Second person ("you," "your")
- Active voice preferred
- Short sentences and paragraphs
- Benefits-focused, not feature-focused
- Specific and concrete (avoid vague claims)

### Body Copy Standards

- No lorem ipsum
- Real, meaningful content
- Benefit statements for features
- Social proof in testimonials
- Clear CTAs with action language

---

## File Structure

```
src/
  components/
    common/
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
  styles/
    globals.css
    variables.css
    animations.css
  utils/
    scrollAnimations.js
  assets/
    icons/
    images/
```

---

## Success Criteria

✅ Landing page accurately represents Aim's brand and value proposition  
✅ Modern, clean design that appeals to young professionals  
✅ All animations perform smoothly at 60fps on mobile  
✅ Responsive and functional across all breakpoints  
✅ WCAG 2.1 AA accessible  
✅ Lighthouse score 85+  
✅ Form conversion tracking enabled  
✅ Clear path to account signup  
✅ All copy authentic and benefit-focused  
✅ Mobile and desktop experiences feel native, not scaled
