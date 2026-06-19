import Header from './components/common/Header';

function App() {
  return (
    <>
      <Header />
      <main>
        <section id="hero" style={{ minHeight: '100vh', padding: '2rem' }}>
          <h1>Hero placeholder</h1>
        </section>
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
