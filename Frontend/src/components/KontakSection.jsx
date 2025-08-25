import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

const KontakSection = () => {
    const [isMobile, setIsMobile] = useState(false);

    const { data: socialLinks = [] } = useSWR(
        `${import.meta.env.VITE_BACKEND_URL}/api/social-media-links`,
        fetcher
    );

    const { data: settings } = useSWR(
        `${import.meta.env.VITE_BACKEND_URL}/api/settings`,
        fetcher
    );

    const whatsappLink = socialLinks.find(link => link.platform === 'WhatsApp');
    const instagramLink = socialLinks.find(link => link.platform === 'Instagram');

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
                                {settings && settings.mapEmbedUrl ? (
                                    <iframe
                                        className="has-ratio"
                                        width="100%" height="450" style={{ border: 0, borderRadius: '8px' }}
                                        loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade"
                                        src={settings.mapEmbedUrl.match(/src="([^"]+)"/)[1]}
                                    ></iframe>
                                ) : (
                                    <div className="has-text-centered">
                                        <p>Peta lokasi belum diatur oleh admin.</p>
                                    </div>
                                )}
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
                            {whatsappLink && (
                                <div className="buttons is-centered">
                                    <a href={whatsappLink.url} target="_blank" rel="noopener noreferrer" className="button is-success is-large">
                                        <span className="icon"><FaWhatsapp /></span>
                                        <span>WhatsApp</span>
                                    </a>
                                </div>
                            )}

                            {instagramLink && (
                                <div className="buttons is-centered">
                                    <a href={instagramLink.url} target="_blank" rel="noopener noreferrer" className="button is-danger is-large" style={{ background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)', borderColor: 'transparent' }}>
                                        <span className="icon"><FaInstagram /></span>
                                        <span>Instagram</span>
                                    </a>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default KontakSection;