import React from 'react';
import './Footer.css';
import { translations } from '../translations';

const Footer = ({ lang }) => {
    const t = translations[lang].footer;
    return (
        <footer className="footer" id="contact">
            <div className="container">
                <div className="footer-layout">
                    <div className="footer-left">
                        <h3>
                            {t.companyName}
                            {t.companyNameSub && <span className="company-sub">{t.companyNameSub}</span>}
                        </h3>
                        <p className="footer-slogan">{t.slogan}</p>
                    </div>
                    <div className="footer-right">
                        <h4>{t.contactLabel}</h4>
                        <div className="contact-info">
                            <div className="contact-row">
                                <span className="label">E-mail:</span>
                                <span className="value">bhwoo@arken.co.kr</span>
                            </div>
                            <div className="contact-row">
                                <span className="label">{t.addrLabel}</span>
                                <span className="value">{t.addrValue}</span>
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
