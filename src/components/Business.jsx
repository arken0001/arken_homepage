import React from 'react';
import './Business.css';
import { translations } from '../translations';
import kosnovaBI from '../assets/kosnova-logo.png';
import komoshnikBI from '../assets/komoshnik-logo.png';
import ausResearchBI from '../assets/aus_research_v3.png';
import playgroundBI from '../assets/playground-bi.png';

const Business = ({ lang }) => {
    const t = translations[lang].business;

    // Merge technical config with translated strings
    const sectorConfigs = [
        {
            id: '01',
            bg: '/src/assets/sector-bg-01.png',
            color: '#004a80', // Blue
            items: [
                { isBrand: true, link: 'http://kasanova.kr', logo: kosnovaBI },
                { isBrand: true, link: 'https://www.google.com/search?q=komoshnik', logo: komoshnikBI },
                { isBrand: true, link: 'https://cafe.naver.com/gfhdut', logo: ausResearchBI }
            ]
        },
        {
            id: '02',
            bg: '/src/assets/sector-bg-02.png',
            color: '#001f3f', // Navy
            items: [
                { isBrand: true, link: 'http://sellermanager.kr' },
                { isBrand: true, link: 'http://playground.co.kr', logo: playgroundBI },
                {}
            ]
        },
        {
            id: '03',
            bg: '/src/assets/sector-bg-03.png',
            color: '#1a1a1a', // Dark Grey
            items: [{ link: '/dev-server-manager/manual.html', isBrand: true }, {}, {}]
        }
    ];

    const sectors = t.sectors.map((sector, sIdx) => ({
        ...sector,
        ...sectorConfigs[sIdx],
        items: sector.items.map((item, iIdx) => ({
            ...item,
            ...sectorConfigs[sIdx].items[iIdx]
        }))
    }));

    return (
        <section id="business" className="business">
            <div className="business-bg-decor">
                <div className="business-glow-1"></div>
                <div className="business-glow-2"></div>
            </div>

            <div className="section-header">
                <h2>{t.title}</h2>
                <p>{t.subtitle}</p>
            </div>

            <div className="container">
                <div className="org-chart">
                    {sectors.map((sector) => (
                        <div className="org-sector" key={sector.id} style={{ '--sector-color': sector.color }}>
                            <div className="org-header-card" style={{ backgroundImage: `url(${sector.bg})` }}>
                                <div className="org-header-overlay">
                                    <span className="org-node-tag">DIVISION {sector.id}</span>
                                    <h3 className="org-node-title">{sector.title}</h3>
                                    <p className="org-node-subtitle">{sector.subtitle}</p>
                                </div>
                            </div>

                            <div className="org-connector">
                                <div className="vertical-line"></div>
                                <p className="org-sector-desc">{sector.desc}</p>
                                <div className="horizontal-branch"></div>
                            </div>

                            <div className="org-children-grid">
                                {sector.items.map((item, idx) => (
                                    <div key={idx} className="org-child-card">
                                        <div className="card-accent-line"></div>
                                        {item.logo && (
                                            <div className="org-child-logo">
                                                <img src={item.logo} alt={item.name} />
                                            </div>
                                        )}
                                        <div className="org-child-header">
                                            <div className="title-status-group">
                                                {item.link ? (
                                                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="org-child-link">
                                                        <h4>{item.name}</h4>
                                                        <span className="link-arrow">↗</span>
                                                    </a>
                                                ) : (
                                                    <h4>{item.name}</h4>
                                                )}
                                                {item.status && (
                                                    <span className={`status-node ${item.status === '운영중' || item.status === 'Active' || item.status === 'Активно' ? 'active' : 'dev'}`}>
                                                        {item.status}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <p className="org-child-detail">{item.detail}</p>
                                        {item.features && (
                                            <div className="org-child-features">
                                                {item.features.map((f, fIdx) => (
                                                    <span key={fIdx} className="feature-node">{f}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Business;
