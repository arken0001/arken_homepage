import React from 'react';
import './About.css';
import { translations } from '../translations';

const About = ({ lang }) => {
    const t = translations[lang].about;
    return (
        <section id="about" className="about">
            <div className="container about-wrapper">
                <div className="about-text">
                    <span className="section-label">{t.label}</span>
                    <h2 style={{ whiteSpace: 'pre-line' }}>
                        {t.title}
                    </h2>
                    <p className="about-desc">
                        {t.desc}
                    </p>
                </div>
                <div className="values-list">
                    {t.values.map((val, idx) => (
                        <div className="value-item" key={idx}>
                            <h3>{val.title}</h3>
                            <p>{val.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default About;
