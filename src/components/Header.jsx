import React, { useState } from 'react';
import logo from '../assets/arken-new-ci.png';
import './Header.css';

const Header = () => {
  const [lang, setLang] = useState('KO');
  const [scrolled, setScrolled] = useState(false);

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
        </div>
        <nav className="nav">
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#business">Business</a></li>
            <li><a href="#contact">Contact</a></li>
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
