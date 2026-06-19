import { animate, stagger } from 'animejs';

const COIN_PARTS = [
  'HUGE-COIN',
  'HOLD-COIN',
  'SMALL-COINS-PILE',
  'TALL-COIN-PILE-',
  'MEDIUM-COIN-PILE',
  'LITTLE-COIN-PILE',
];

const MAX_MOUSE_PULL = 18;
const BASE_COIN_SCALE = 0.28;
const COIN_SCALE_STAGGER = 0.035;

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

function initIllustrationMouseFollow(visualEl) {
  const target = visualEl.querySelector('.hero__illustration-rotator');
  if (!target) return () => {};

  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!canHover) return () => {};

  let rafId = null;
  let pullX = 0;
  let pullY = 0;

  const applyTransform = () => {
    rafId = null;
    target.style.transform = `translate(${pullX}px, ${pullY}px)`;
  };

  const onMouseMove = (event) => {
    const rect = visualEl.getBoundingClientRect();
    const relativeX = (event.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (event.clientY - rect.top) / rect.height - 0.5;

    pullX = relativeX * MAX_MOUSE_PULL * 2;
    pullY = relativeY * MAX_MOUSE_PULL * 2;

    if (!rafId) {
      rafId = requestAnimationFrame(applyTransform);
    }
  };

  const onMouseLeave = () => {
    pullX = 0;
    pullY = 0;
    if (!rafId) {
      rafId = requestAnimationFrame(applyTransform);
    }
  };

  visualEl.addEventListener('mousemove', onMouseMove);
  visualEl.addEventListener('mouseleave', onMouseLeave);

  return () => {
    visualEl.removeEventListener('mousemove', onMouseMove);
    visualEl.removeEventListener('mouseleave', onMouseLeave);
    if (rafId) cancelAnimationFrame(rafId);
    target.style.transform = '';
  };
}

function getHeroScrollProgress(heroEl) {
  const rect = heroEl.getBoundingClientRect();
  const scrolled = Math.max(-rect.top, 0);
  const range = rect.height * 0.9;
  return Math.min(scrolled / range, 1);
}

function initCoinScrollScale(illustrationEl, heroEl) {
  const coins = COIN_PARTS.flatMap((id) => {
    const el = illustrationEl.querySelector(`[id="${id}"]`);
    return el ? [el] : [];
  });

  if (!coins.length || !heroEl) return () => {};

  let active = true;

  const visibilityObserver = new IntersectionObserver(
    ([entry]) => {
      active = entry.isIntersecting;
    },
    { threshold: 0 },
  );
  visibilityObserver.observe(heroEl);

  const onScroll = () => {
    if (!active) return;

    const progress = getHeroScrollProgress(heroEl);

    coins.forEach((coin, index) => {
      const scale = 1 + progress * (BASE_COIN_SCALE + index * COIN_SCALE_STAGGER);
      coin.style.transform = `scale(${scale})`;
      coin.style.transformBox = 'fill-box';
      coin.style.transformOrigin = 'center';
    });
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  return () => {
    visibilityObserver.disconnect();
    window.removeEventListener('scroll', onScroll);
    coins.forEach((coin) => {
      coin.style.transform = '';
      coin.style.transformBox = '';
      coin.style.transformOrigin = '';
    });
  };
}

export function initHeroAnimations({ contentEl, visualEl, illustrationEl, heroEl }) {
  if (prefersReducedMotion() || !contentEl || !visualEl) return () => {};

  const loadAnimation = initHeroLoad(contentEl);
  const entranceAnimation = illustrationEl ? initIllustrationEntrance(illustrationEl) : null;
  const removeMouseFollow = initIllustrationMouseFollow(visualEl);
  const removeCoinScale = illustrationEl ? initCoinScrollScale(illustrationEl, heroEl) : () => {};

  return () => {
    loadAnimation.pause();
    entranceAnimation?.pause();
    removeMouseFollow();
    removeCoinScale();
  };
}
