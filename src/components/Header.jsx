import React, { useState } from 'react';
import logo from '../assets/arken-new-ci.png';
import './Header.css';
import { translations } from '../translations';

const Header = ({ lang, setLang }) => {
  const [scrolled, setScrolled] = useState(false);
  const t = translations[lang].nav;

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="logo">
          <img src={logo} alt="ARKEN" className="logo-img" />
          <span className="logo-text">ARKEN Co., Ltd.</span>
        </div>
        <nav className="nav">
          <ul>
            <li><a href="#home">{t.home}</a></li>
            <li><a href="#about">{t.about}</a></li>
            <li><a href="#business">{t.business}</a></li>
            <li><a href="#contact">{t.contact}</a></li>
          </ul>
        </nav>
        <div className="lang-switch">
          <span className={lang === 'RU' ? 'active' : ''} onClick={() => setLang('RU')}>RU</span>
          <span className="divider">|</span>
          <span className={lang === 'KO' ? 'active' : ''} onClick={() => setLang('KO')}>KO</span>
          <span className="divider">|</span>
          <span className={lang === 'EN' ? 'active' : ''} onClick={() => setLang('EN')}>EN</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
