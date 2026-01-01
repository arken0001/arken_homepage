import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer" id="contact">
            <div className="container">
                <div className="footer-layout">
                    <div className="footer-left">
                        <h3>ARKEN Co., Ltd. <span style={{ fontSize: '0.7em', fontWeight: '400', marginLeft: '8px' }}>주식회사 아켄</span></h3>
                        <p className="footer-slogan">Connecting Markets. Coding Future.</p>
                    </div>
                    <div className="footer-right">
                        <h4>CONTACT</h4>
                        <div className="contact-info">
                            <div className="contact-row">
                                <span className="label">E-mail:</span>
                                <span className="value">bhwoo@arken.co.kr</span>
                            </div>
                            <div className="contact-row">
                                <span className="label">Addr:</span>
                                <span className="value">18468 경기도 화성시 동탄대로 643 센테라IT타워 715호</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} ARKEN. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
