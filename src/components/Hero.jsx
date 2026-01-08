import React, { useState, useEffect, useRef } from 'react';
import './Hero.css';
import { translations } from '../translations';

const Hero = ({ lang }) => {
    const t = translations[lang].hero;
    const [showVideo, setShowVideo] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        // 세션에서 이미 재생했는지 확인
        const hasPlayed = sessionStorage.getItem('arken_intro_played');
        if (!hasPlayed) {
            setShowVideo(true);
        }
    }, []);

    const handleVideoEnd = () => {
        // 마지막 프레임 유지 - videoEnded만 표시하고 동영상은 그대로 둠
        sessionStorage.setItem('arken_intro_played', 'true');
    };

    return (
        <section id="home" className="hero">
            <div className="hero-bg" style={{ backgroundImage: "url('/src/assets/hero-bg-network.png')" }}>
                <div className="hero-overlay"></div>
            </div>
            <div className="hero-container">
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
                <div className="hero-video-wrapper">
                    {showVideo && (
                        <video
                            ref={videoRef}
                            className="hero-video"
                            autoPlay
                            muted
                            playsInline
                            onEnded={handleVideoEnd}
                        >
                            <source src="/arken_logo.mp4" type="video/mp4" />
                        </video>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Hero;
