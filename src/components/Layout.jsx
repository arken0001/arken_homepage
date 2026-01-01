import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, lang, setLang }) => {
    return (
        <div className="layout">
            <Header lang={lang} setLang={setLang} />
            <main className="main-content">
                {children}
            </main>
            <Footer lang={lang} />
        </div>
    );
};

export default Layout;
