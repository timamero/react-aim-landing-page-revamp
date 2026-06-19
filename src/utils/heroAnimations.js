import { animate, stagger } from 'animejs';

const SVG_ANIMATED_PARTS = [
  'HUGE-COIN',
  'HOLD-COIN',
  'SMALL-COINS-PILE',
  'TALL-COIN-PILE-',
  'MEDIUM-COIN-PILE',
  'LITTLE-COIN-PILE',
  'BILLS',
  'GREEN-CHARACTER',
  'ORANGE-CHARACTER',
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
      return `<svg${cleaned} class="hero__illustration-svg" aria-hidden="true" focusable="false">`;
    });
}

function initHeroLoad(contentEl) {
  return animate(contentEl.children, {
    translateY: [40, 0],
    opacity: [0, 1],
    duration: 500,
    delay: stagger(100),
    ease: 'outQuart',
  });
}

function initIllustrationEntrance(illustrationEl) {
  return animate(illustrationEl, {
    opacity: [0, 1],
    scale: [0.94, 1],
    duration: 700,
    delay: 200,
    ease: 'outQuart',
  });
}

function initSvgPartAnimations(illustrationEl) {
  const parts = SVG_ANIMATED_PARTS.flatMap((id) => {
    const el = illustrationEl.querySelector(`[id="${id}"]`);
    return el ? [el] : [];
  });

  if (!parts.length) return () => {};

  const coinParts = parts.filter((el) => el.id !== 'GREEN-CHARACTER' && el.id !== 'ORANGE-CHARACTER');
  const characterParts = parts.filter(
    (el) => el.id === 'GREEN-CHARACTER' || el.id === 'ORANGE-CHARACTER',
  );

  const animations = [];

  if (coinParts.length) {
    animations.push(
      animate(coinParts, {
        translateY: [-6, 6],
        duration: 2800,
        delay: stagger(180, { from: 'center' }),
        alternate: true,
        loop: true,
        ease: 'inOutQuad',
      }),
    );
  }

  if (characterParts.length) {
    animations.push(
      animate(characterParts, {
        translateY: [0, -8],
        duration: 3200,
        delay: stagger(400),
        alternate: true,
        loop: true,
        ease: 'inOutSine',
      }),
    );
  }

  return () => animations.forEach((animation) => animation.pause());
}

function initIllustrationScrollRotation(visualEl) {
  const rotator = visualEl.querySelector('.hero__illustration-rotator');
  if (!rotator) return () => {};

  let active = true;

  const visibilityObserver = new IntersectionObserver(
    ([entry]) => {
      active = entry.isIntersecting;
    },
    { threshold: 0 },
  );
  visibilityObserver.observe(visualEl);

  const onScroll = () => {
    if (!active) return;
    const progress = Math.min(window.scrollY / window.innerHeight, 1);
    rotator.style.transform = `rotate(${progress * 6}deg)`;
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  return () => {
    visibilityObserver.disconnect();
    window.removeEventListener('scroll', onScroll);
    rotator.style.transform = '';
  };
}

export function initHeroAnimations({ contentEl, visualEl, illustrationEl }) {
  if (prefersReducedMotion() || !contentEl || !visualEl) return () => {};

  const loadAnimation = initHeroLoad(contentEl);
  const entranceAnimation = illustrationEl ? initIllustrationEntrance(illustrationEl) : null;
  const pauseSvgParts = illustrationEl ? initSvgPartAnimations(illustrationEl) : () => {};
  const removeScroll = initIllustrationScrollRotation(visualEl);

  return () => {
    loadAnimation.pause();
    entranceAnimation?.pause();
    pauseSvgParts();
    removeScroll();
  };
}
