import React from 'react';
import './Business.css';
import subBrands from '../assets/new-sub-brands.png'; // Updated asset

const Business = () => {
    const sectors = [
        {
            id: '01',
            title: 'Global Settlement',
            subtitle: '글로벌 정착 생태계',
            desc: '"국경 없는 삶을 위한 기술적 토대와 따뜻한 조력을 제공합니다."',
            hasImage: true,
            imageBg: '/src/assets/sector-bg-01.png',
            items: [
                {
                    name: 'KOSNOVA',
                    detail: '러시아어권 사용자를 위한 한국 생활 정보 광장',
                    status: '개발중',
                    link: 'http://kasanova.kr',
                    isBrand: true
                },
                {
                    name: 'KOMOSHNIK',
                    detail: 'OCR 번역, 비자, 위치 기반 스마트 정착 도우미',
                    status: '개발중',
                    link: 'https://www.google.com/search?q=komoshnik',
                    isBrand: true
                },
                {
                    name: '호주살이연구소',
                    detail: '워킹홀리데이 및 현지 정착민 가이드 N카페',
                    status: '운영중',
                    link: 'https://cafe.naver.com/gfhdut',
                    isBrand: true
                }
            ]
        },
        {
            id: '02',
            title: 'E-Commerce Solution',
            subtitle: '온라인 셀러 솔루션',
            desc: '"실제 셀러의 경험을 코딩하여 가장 강력한 비즈니스 툴을 만듭니다."',
            hasImage: true,
            imageBg: '/src/assets/sector-bg-02.png',
            items: [
                {
                    name: 'Seller Tools',
                    detail: '마켓 통합 관리, 주문 자동화 운영 운영 소프트웨어',
                    status: '개발중',
                    link: 'http://sellermanager.kr',
                    isBrand: true
                },
                {
                    name: 'Playground',
                    detail: 'N카페 운영 도우미',
                    status: '개발중',
                    link: 'http://playground.co.kr',
                    isBrand: true
                },
                { name: 'Direct Operation', detail: '글로벌 마켓 직접 운영을 통한 데이터 축적' }
            ]
        },
        {
            id: '03',
            title: 'Custom Coding',
            subtitle: '소프트웨어 개발 & 코딩',
            desc: '"풍부한 레퍼런스와 자체 서비스 개발 역량으로 최적의 솔루션을 지속 공급합니다."',
            hasImage: true,
            imageBg: '/src/assets/sector-bg-03.png',
            items: [
                { name: 'Solution Portfolio', detail: '그동안 수행해온 수많은 웹사이트 제작 및 비즈니스 자동화 프로그램 개발 성과.' },
                { name: 'Continuous Tech', detail: '자체 플랫폼(Kosnova, Komoshnik 등) 개발로 검증된 최신 기술 스택 적용.' },
                { name: 'Custom Engineering', detail: 'AI OCR 연동, 자동화 봇, 데이터 매니지먼트 시스템 등 맞춤형 개발 및 유지보수.' }
            ]
        }
    ];

    return (
        <section id="business" className="business">
            <div className="container">
                <div className="section-header">
                    <h2>Our Business</h2>
                    <p>Connecting Markets through Code</p>
                </div>
                <div className="business-grid">
                    {sectors.map((sector) => (
                        <div className="sector-card" key={sector.id}>
                            {sector.hasImage && (
                                <div className="card-image-bg" style={{ backgroundImage: `url(${sector.imageBg})` }}>
                                    <div className="card-overlay">
                                        <div className="card-header-overlay">
                                            <span className="sector-num">{sector.id}</span>
                                            <h3>{sector.title}</h3>
                                            <h4>{sector.subtitle}</h4>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {!sector.hasImage && (
                                <div className="card-header-simple">
                                    <span className="sector-num">{sector.id}</span>
                                    <h3>{sector.title}</h3>
                                    <h4>{sector.subtitle}</h4>
                                </div>
                            )}

                            <div className="card-content-wrapper">
                                <p className="sector-quote">{sector.desc}</p>
                                <ul className="sector-list">
                                    {sector.items.map((item, idx) => (
                                        <li key={idx} className={item.isBrand ? 'brand-item' : ''}>
                                            <div className="item-content">
                                                {item.link ? (
                                                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="item-link">
                                                        <strong>{item.name}</strong>
                                                        <span className="link-icon">↗</span>
                                                    </a>
                                                ) : (
                                                    <strong>{item.name}</strong>
                                                )}
                                                {item.status && (
                                                    <span className={`status-badge ${item.status === '운영중' ? 'active' : 'dev'}`}>
                                                        {item.status}
                                                    </span>
                                                )}
                                            </div>
                                            <span>{item.detail}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Business;
