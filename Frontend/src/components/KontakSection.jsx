import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';

const KontakSection = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const finalState = { opacity: 1, x: 0 };

    return (
        <section
            id="kontak"
            className="section is-flex is-align-items-center is-justify-content-center"
            style={{
                minHeight: '100vh',
                paddingTop: '80px'
            }}
        >
            <div className="container">
                <div className="has-text-centered mb-6">
                    <h2 className="title is-2">Temukan & Hubungi Kami</h2>
                    <p className="subtitle is-5 has-text-grey">Kami siap melayani pesanan Anda.</p>
                </div>
                <div className="columns is-vcentered">
                    <div className="column is-two-thirds">
                        <motion.div
                            initial={isMobile ? finalState : { opacity: 0, x: -50 }}
                            whileInView={finalState}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <figure className="image is-16by9">
                                <iframe
                                    className="has-ratio"
                                    width="100%" height="450" style={{ border: 0, borderRadius: '8px' }}
                                    loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944.829462876395!2d116.09329287589532!3d-8.612366191433292!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dcdbf0c199bca5d%3A0x21f1ee0ab70d17ad!2sJl.%20Sunan%20Drajat%20III%2C%20Jempong%20Baru%2C%20Kec.%20Sekarbela%2C%20Kota%20Mataram%2C%20Nusa%20Tenggara%20Bar.%2083116!5e0!3m2!1sid!2sid!4v1755139064674!5m2!1sid!2sid"
                                ></iframe>
                            </figure>
                        </motion.div>
                    </div>
                    <div className="column has-text-centered">
                        <motion.div
                            initial={isMobile ? finalState : { opacity: 0, x: 50 }}
                            whileInView={finalState}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <h3 className="title is-4">Hubungi kami melalui:</h3>
                            <div className="buttons is-centered">
                                <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="button is-success is-large">
                                    <span className="icon"><FaWhatsapp /></span>
                                    <span>WhatsApp</span>
                                </a>
                            </div>
                            <div className="buttons is-centered">
                                <a href="https://instagram.com/namaproduk" target="_blank" rel="noopener noreferrer" className="button is-danger is-large" style={{ background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)', borderColor: 'transparent' }}>
                                    <span className="icon"><FaInstagram /></span>
                                    <span>Instagram</span>
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default KontakSection;