import { animate, stagger } from 'animejs';

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function initHeaderLoadAnimations(navItemEls) {
  if (prefersReducedMotion() || !navItemEls?.length) return () => {};

  const animation = animate(navItemEls, {
    opacity: [0, 1],
    translateY: [-10, 0],
    duration: 500,
    delay: stagger(100),
    ease: 'outQuad',
  });

  return () => animation.pause();
}

