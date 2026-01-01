import React from 'react';
import './Hero.css';

const Hero = () => {
    return (
        <section id="home" className="hero">
            <div className="hero-bg" style={{ backgroundImage: "url('/src/assets/hero-bg-network.png')" }}>
                {/* Placeholder for now, can be replaced with generated asset */}
                <div className="hero-overlay"></div>
            </div>
            <div className="container hero-content">
                <h1 className="hero-title">
                    Connecting Markets.<br />
                    <span className="highlight">Coding Future.</span>
                </h1>
                <div className="hero-divider"></div>
                <p className="hero-subtitle">
                    글로벌 정착 생태계, 온라인 셀러 솔루션, 전문 소프트웨어 개발.<br />
                    국가와 기술의 경계를 허무는 <strong>Bridge OS Company</strong>, 아켄입니다.
                </p>
                <div className="hero-buttons">
                    <a href="#business" className="btn btn-primary">Our Services</a>
                    <a href="#contact" className="btn btn-outline">Contact Us</a>
                </div>
            </div>
        </section>
    );
};

export default Hero;
