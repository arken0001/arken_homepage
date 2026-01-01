import React from 'react';
import './About.css';

const About = () => {
    return (
        <section id="about" className="about">
            <div className="container about-wrapper">
                <div className="about-text">
                    <span className="section-label">WHO WE ARE</span>
                    <h2>
                        Connecting Markets,<br />
                        Creating Value.
                    </h2>
                    <p className="about-desc">
                        아켄은 한·러·호 3개 주요 시장을 잇는 Cross-border Gateway입니다.<br />
                        정착민과 온라인 셀러를 위한 기술적 토대를 만들고, 성장을 돕습니다.
                    </p>
                </div>
                <div className="values-list">
                    <div className="value-item">
                        <h3>Connection</h3>
                        <p>국가와 시장을 연결하는 가교</p>
                    </div>
                    <div className="value-item">
                        <h3>Commerce</h3>
                        <p>비즈니스 성공을 위한 솔루션</p>
                    </div>
                    <div className="value-item">
                        <h3>Community</h3>
                        <p>정보와 경험을 나누는 광장</p>
                    </div>
                    <div className="value-item">
                        <h3>Confidence</h3>
                        <p>기술력으로 쌓아가는 신뢰</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
