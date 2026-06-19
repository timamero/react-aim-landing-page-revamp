import { useEffect, useRef } from 'react';
import Button from '../common/Button';
import heroSvgRaw from '../../assets/images/two-people-pile-of-money.svg?raw';
import { initHeroAnimations, prepareHeroSvg } from '../../utils/heroAnimations';

const heroSvgMarkup = prepareHeroSvg(heroSvgRaw);

function HeroSection() {
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const visualRef = useRef(null);
  const illustrationRef = useRef(null);

  useEffect(() => {
    return initHeroAnimations({
      contentEl: contentRef.current,
      visualEl: visualRef.current,
      illustrationEl: illustrationRef.current,
      heroEl: heroRef.current,
    });
  }, []);

  return (
    <section id="hero" className="hero" ref={heroRef} aria-labelledby="hero-heading">
      <div className="hero__background" aria-hidden="true">
        <div className="hero__shape hero__shape--1" />
        <div className="hero__shape hero__shape--2" />
        <div className="hero__shape hero__shape--3" />
      </div>

      <div className="container hero__layout">
        <div className="hero__content" ref={contentRef}>
          <h1 id="hero-heading">Take control of your financial future</h1>
          <p className="hero__subheadline">
            Aim makes it simple to invest, save, and plan for the goals that matter most to
            you. Whether you&apos;re saving for a home, retirement, or just building wealth,
            we&apos;ve got the tools to get you there.
          </p>
          <div className="hero__actions">
            <Button variant="primary" size="large" type="button" disabled>
              Get Started Free
            </Button>
            <Button variant="text" href="#how-it-works">
              Watch How It Works →
            </Button>
          </div>
        </div>

        <div className="hero__visual" ref={visualRef} aria-hidden="true">
          <div className="hero__illustration">
            <div className="hero__illustration-rotator">
              <div
                ref={illustrationRef}
                className="hero__illustration-inner"
                dangerouslySetInnerHTML={{ __html: heroSvgMarkup }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
