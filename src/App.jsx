import Header from './components/common/Header';
import HeroSection from './components/sections/HeroSection';

function App() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <section id="about" style={{ minHeight: '50vh', padding: '2rem' }}>
          <h2>About placeholder</h2>
        </section>
        <section id="features" style={{ minHeight: '50vh', padding: '2rem' }}>
          <h2>Features placeholder</h2>
        </section>
        <section id="pricing" style={{ minHeight: '50vh', padding: '2rem' }}>
          <h2>Pricing placeholder</h2>
        </section>
        <section id="cta" style={{ minHeight: '50vh', padding: '2rem' }}>
          <h2>CTA placeholder</h2>
        </section>
      </main>
    </>
  );
}

export default App;
