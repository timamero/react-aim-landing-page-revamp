import { createTimeline, stagger } from 'animejs';

const SVG_BACKGROUND_IDS = ['TALL-COIN-PILE-', 'MEDIUM-COIN-PILE', 'BILLS'];
const SVG_FOREGROUND_IDS = [
  'HUGE-COIN',
  'HOLD-COIN',
  'SMALL-COINS-PILE',
  'LITTLE-COIN-PILE',
];

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function prepareHeroSvg(raw) {
  return raw
    .replace(/<\?xml[\s\S]*?\?>\s*/i, '')
    .replace(/<svg([^>]*)>/i, (_match, attrs) => {
      const cleaned = attrs
        .replace(/\s*width="100%"/i, '')
        .replace(/\s*height="100%"/i, '');
      return `<svg${cleaned} class="hero__illustration-svg" aria-hidden="true" focusable="false" overflow="hidden">`;
    });
}

function querySvgPart(illustrationEl, id) {
  return illustrationEl.querySelector(`[id="${id}"]`);
}

function querySvgParts(illustrationEl) {
  const background = SVG_BACKGROUND_IDS.flatMap((id) => {
    const el = querySvgPart(illustrationEl, id);
    return el ? [el] : [];
  });

  const foreground = SVG_FOREGROUND_IDS.flatMap((id) => {
    const el = querySvgPart(illustrationEl, id);
    return el ? [el] : [];
  });

  return {
    background,
    greenCharacter: querySvgPart(illustrationEl, 'GREEN-CHARACTER'),
    orangeCharacter: querySvgPart(illustrationEl, 'ORANGE-CHARACTER'),
    foreground,
  };
}

function createSvgParallaxTimeline(illustrationEl, shapes) {
  const parts = querySvgParts(illustrationEl);
  const hasShapes = shapes.length > 0;
  const hasBackground = parts.background.length > 0;
  const hasForeground = parts.foreground.length > 0;

  const tl = createTimeline({
    defaults: { ease: 'outQuart', duration: 600 },
  });

  if (hasShapes) {
    tl.add(
      shapes,
      {
        opacity: [0, 0.55],
        scale: [0.88, 1],
        duration: 700,
        delay: stagger(120),
      },
      0,
    );
  }

  if (hasBackground) {
    tl.add(
      parts.background,
      {
        opacity: [0, 1],
        scale: [0.92, 1],
        duration: 650,
        delay: stagger(90),
      },
      hasShapes ? '+=80' : 0,
    );
  }

  const characterStart = hasBackground || hasShapes ? '+=100' : 0;

  if (parts.greenCharacter) {
    tl.add(
      parts.greenCharacter,
      {
        opacity: [0, 1],
        translateX: [-48, 0],
        translateY: [28, 0],
        duration: 700,
      },
      characterStart,
    );
  }

  if (parts.orangeCharacter) {
    tl.add(
      parts.orangeCharacter,
      {
        opacity: [0, 1],
        translateX: [48, 0],
        translateY: [28, 0],
        duration: 700,
      },
      parts.greenCharacter ? '<+=100' : characterStart,
    );
  }

  if (hasForeground) {
    const leftForeground = parts.foreground.filter((el) =>
      el.id === 'HOLD-COIN' || el.id === 'SMALL-COINS-PILE',
    );
    const rightForeground = parts.foreground.filter((el) =>
      el.id === 'HUGE-COIN' || el.id === 'LITTLE-COIN-PILE',
    );

    if (leftForeground.length) {
      tl.add(
        leftForeground,
        {
          opacity: [0, 1],
          translateY: [20, 0],
          translateX: [-14, 0],
          duration: 550,
          delay: stagger(100),
        },
        '+=120',
      );
    }

    if (rightForeground.length) {
      tl.add(
        rightForeground,
        {
          opacity: [0, 1],
          translateY: [20, 0],
          translateX: [14, 0],
          duration: 550,
          delay: stagger(100),
        },
        leftForeground.length ? '<' : '+=120',
      );
    }
  }

  return tl;
}

export function initHeroAnimations({ contentEl, illustrationEl, backgroundEl }) {
  if (!contentEl) return () => {};

  const shapes = backgroundEl?.querySelectorAll('.hero__shape') ?? [];

  if (prefersReducedMotion()) return () => {};

  const masterTl = createTimeline({
    defaults: { ease: 'outQuart' },
  });

  masterTl.add(contentEl.children, {
    translateY: [40, 0],
    opacity: [0, 1],
    duration: 500,
    delay: stagger(100),
  });

  if (illustrationEl) {
    const svgTl = createSvgParallaxTimeline(illustrationEl, shapes);
    masterTl.sync(svgTl, '+=150');
  } else if (shapes.length) {
    masterTl.add(
      shapes,
      {
        opacity: [0, 0.55],
        scale: [0.88, 1],
        duration: 700,
        delay: stagger(120),
      },
      '+=150',
    );
  }

  return () => masterTl.pause();
}
