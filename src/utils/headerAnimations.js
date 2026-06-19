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

export function initLogoHover(logoEl) {
  if (prefersReducedMotion() || !logoEl) return () => {};

  const onEnter = () => {
    animate(logoEl, { scale: 1.05, duration: 300, ease: 'outQuad' });
  };

  const onLeave = () => {
    animate(logoEl, { scale: 1, duration: 300, ease: 'outQuad' });
  };

  logoEl.addEventListener('mouseenter', onEnter);
  logoEl.addEventListener('mouseleave', onLeave);

  return () => {
    logoEl.removeEventListener('mouseenter', onEnter);
    logoEl.removeEventListener('mouseleave', onLeave);
  };
}
