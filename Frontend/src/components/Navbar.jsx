import React, { useState, useEffect } from 'react';
import { FaFire } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Navbar = () => {
    const [isActive, setIsActive] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navClasses = `navbar navbar-pill ${isScrolled ? 'is-scrolled' : ''}`;

    return (
        <div className="navbar-container">
            <motion.nav
                className={navClasses}
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="navbar-brand">
                    <a className="navbar-item brand-logo" href="/">
                        <FaFire className="has-text-danger is-size-4 mr-2" />
                        <span className="has-text-weight-bold is-size-4">Sambal Teman Ku</span>
                    </a>
                    <a
                        role="button"
                        className={`navbar-burger ${isActive ? 'is-active' : ''}`}
                        onClick={() => setIsActive(prev => !prev)}
                        aria-label="menu"
                        aria-expanded={isActive}
                    >
                        <span></span><span></span><span></span>
                    </a>
                </div>
                <div className={`navbar-menu ${isActive ? 'is-active' : ''}`}>
                    <div className="navbar-end">
                        <a href="#tentang" className="navbar-item">Tentang Kami</a>
                        <a href="#produk" className="navbar-item">Produk</a>
                        <a href="#testimoni" className="navbar-item">Testimoni</a>
                        <a href="#kontak" className="navbar-item">Kontak</a>
                        <div className="navbar-item">
                            <a href="#kontak" className="button is-danger is-rounded has-text-weight-bold">
                                <strong>Pesan Sekarang</strong>
                            </a>
                        </div>
                    </div>
                </div>
            </motion.nav>
        </div>
    );
};

export default Navbar;