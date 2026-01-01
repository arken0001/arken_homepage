import React from 'react';
import './Hero.css';
import { translations } from '../translations';

const Hero = ({ lang }) => {
    const t = translations[lang].hero;
    return (
        <section id="home" className="hero">
            <div className="hero-bg" style={{ backgroundImage: "url('/src/assets/hero-bg-network.png')" }}>
                {/* Placeholder for now, can be replaced with generated asset */}
                <div className="hero-overlay"></div>
            </div>
            <div className="container hero-content">
                <h1 className="hero-title">
                    {t.title}<br />
                    <span className="highlight">{t.highlight}</span>
                </h1>
                <div className="hero-divider"></div>
                <p className="hero-subtitle">
                    {t.subtitle1}<br />
                    {t.subtitle2}
                </p>
                <div className="hero-buttons">
                    <a href="#business" className="btn btn-primary">{t.btnPrimary}</a>
                    <a href="#contact" className="btn btn-outline">{t.btnOutline}</a>
                </div>
            </div>
        </section>
    );
};

export default Hero;
