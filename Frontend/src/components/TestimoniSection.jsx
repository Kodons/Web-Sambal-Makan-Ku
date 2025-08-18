import React from 'react';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import { FaStar, FaUser } from 'react-icons/fa';

const fetcher = (url) => fetch(url).then((res) => res.json());

const TestimoniSection = () => {
    const { data: testimonials, error, isLoading } = useSWR(
        `${import.meta.env.VITE_BACKEND_URL}/api/testimoni`,
        fetcher
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    const renderContent = () => {
        if (isLoading) return <p>Memuat testimoni...</p>;
        if (error) return <p>Terjadi kesalahan saat memuat data.</p>;
        if (!testimonials || testimonials.length === 0) {
            return <p className="subtitle is-5 has-text-grey">Belum ada testimoni dari pelanggan.</p>;
        }
        
        return (
            <motion.div
                className="columns is-multiline is-centered"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                {testimonials.map((testimoni) => (
                    <motion.div
                        key={testimoni.id}
                        className="column is-one-third-desktop is-half-tablet is-flex"
                        variants={itemVariants}
                        whileHover={{ scale: 1.03, y: -5 }} // Efek interaktif saat hover
                    >
                        {/* Struktur kartu testimoni baru */}
                        <div className="testimonial-grid-card">
                            <div className="has-text-warning mb-4">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <span key={i} className="icon is-small">
                                        <FaStar style={{ color: i < testimoni.rating ? '#ffdd57' : '#dbdbdb' }} />
                                    </span>
                                ))}
                            </div>

                            <p className="quote-text mb-5">
                                "{testimoni.quote}"
                            </p>

                            <div className="media">
                                <figure className="media-left">
                                    <p className="image is-48x48">
                                        <span className="icon is-large has-text-grey-light" style={{ width: '48px', height: '48px', border: '2px solid #dbdbdb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <FaUser size="1.5em" />
                                        </span>
                                    </p>
                                </figure>
                                <div className="media-content">
                                    <p className="title is-6 mb-0">{testimoni.name}</p>
                                    <p className="subtitle is-7 has-text-grey">{testimoni.title}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        );
    };

    return (
        <section id="testimoni" className="section is-large has-background-white">
            <div className="container has-text-centered">
                <div className="has-text-centered mb-6">
                    <h2 className="title is-2 has-text-black">Apa Kata Mereka?</h2>
                    <p className="subtitle is-5 has-text-grey">Testimoni asli dari para Juara penikmat sambal kami.</p>
                </div>
                {renderContent()}
            </div>
        </section>
    );
};

export default TestimoniSection;