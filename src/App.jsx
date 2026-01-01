import React from 'react';
import Layout from './components/Layout';
import Hero from './components/Hero';
import About from './components/About';
import Business from './components/Business';
import './index.css';

function App() {
  return (
    <Layout>
      <Hero />
      <About />
      <Business />
    </Layout>
  );
}

export default App;
