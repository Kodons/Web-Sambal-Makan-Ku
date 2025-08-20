import React from 'react';
import { motion } from 'framer-motion';

const HeroSection = () => {
    return (
        <section
            className="hero is-fullheight is-bold"
            style={{ position: 'relative', overflow: 'hidden' }}>
            <video
                autoPlay loop muted playsInline
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: 0,
                }}>
                <source src="/videos/sambal-video.mp4" type="video/mp4" />
                Maaf, browser Anda tidak mendukung background video.
            </video>

            <div className="hero-body" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1, position: 'relative' }}>
                <div className="container has-text-centered">
                    <motion.h1
                        className="title is-1 has-text-white has-text-weight-black"
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, type: 'spring' }}>
                        Ledakan Rasa di Setiap Cocolan
                    </motion.h1>
                    <motion.h2
                        className="subtitle is-4 has-text-light"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}>
                        Rasakan sensasi pedas otentik dari Sambal Teman Makan Ku, dibuat sepenuh hati dengan resep warisan nusantara.
                    </motion.h2>
                    <motion.a
                        href="#produk"
                        className="button is-danger is-rounded is-large has-text-weight-bold"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}>
                        Lihat Varian
                    </motion.a>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;