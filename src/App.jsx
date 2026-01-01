import React from 'react';
import Layout from './components/Layout';
import Hero from './components/Hero';
import About from './components/About';
import Business from './components/Business';
import './index.css';

function App() {
  const [lang, setLang] = React.useState('KO');

  return (
    <Layout lang={lang} setLang={setLang}>
      <Hero lang={lang} />
      <About lang={lang} />
      <Business lang={lang} />
    </Layout>
  );
}

export default App;
