import React, { useState, useEffect, useRef } from 'react';
import './Hero.css';
import { translations } from '../translations';

const Hero = ({ lang }) => {
    const t = translations[lang].hero;
    const videoRef = useRef(null);
    const [hasPlayed, setHasPlayed] = useState(() => {
        return sessionStorage.getItem('arken_intro_played') === 'true';
    });

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleLoadedMetadata = () => {
            if (hasPlayed) {
                // 이미 재생한 경우 마지막 프레임으로 이동
                video.currentTime = video.duration;
            } else {
                // 첫 방문이면 자동재생
                video.play().catch(() => {
                    // 자동재생 실패 시 무시
                });
            }
        };

        video.addEventListener('loadedmetadata', handleLoadedMetadata);

        // 이미 로드된 경우 바로 실행
        if (video.readyState >= 1) {
            handleLoadedMetadata();
        }

        return () => {
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        };
    }, [hasPlayed]);

    const handleVideoEnd = () => {
        sessionStorage.setItem('arken_intro_played', 'true');
        setHasPlayed(true);
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
                    <video
                        ref={videoRef}
                        className="hero-video"
                        muted
                        playsInline
                        onEnded={handleVideoEnd}
                    >
                        <source src="/arken_logo.mp4" type="video/mp4" />
                    </video>
                </div>
            </div>
        </section>
    );
};

export default Hero;
