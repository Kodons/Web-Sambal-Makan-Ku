import React, { useState, useEffect } from 'react';
import { FaFire } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Navbar = () => {
    const [isActive, setIsActive] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.nav
            className={`navbar is-fixed-top ${isScrolled ? 'has-shadow is-white' : ''}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ backgroundColor: isScrolled ? 'rgba(255,255,255,0.8)' : 'transparent', backdropFilter: isScrolled ? 'blur(10px)' : 'none' }}
        >
            <div className="container">
                <div className="navbar-brand">
                    {/* PERUBAHAN: Kelas 'has-underline-hover' dihapus dari logo */}
                    <a className="navbar-item" href="#">
                        <FaFire className="has-text-danger is-size-4 mr-2" />
                        <span className="has-text-weight-bold is-size-4">Sambal Teman Ku</span>
                    </a>
                    <a role="button" className={`navbar-burger ${isActive ? 'is-active' : ''}`} onClick={() => setIsActive(!isActive)}>
                        <span></span><span></span><span></span>
                    </a>
                </div>
                <div className={`navbar-menu ${isActive ? 'is-active' : ''}`}>
                    <div className="navbar-end">
                        <a href="#tentang" className="navbar-item has-text-weight-semibold has-underline-hover">Tentang Kami</a>
                        <a href="#produk" className="navbar-item has-text-weight-semibold has-underline-hover">Produk</a>
                        <a href="#kontak" className="navbar-item has-text-weight-semibold has-underline-hover">Kontak</a>
                        <div className="navbar-item">
                            <a href="#kontak" className="button is-danger is-rounded has-text-weight-bold">
                                <strong>Pesan Sekarang</strong>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;