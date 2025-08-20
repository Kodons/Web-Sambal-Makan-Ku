import React, { useState } from 'react';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import { FaStar, FaUser } from 'react-icons/fa';

const fetcher = (url) => fetch(url).then((res) => res.json());

const TestimoniCard = ({ testimoni }) => (
    <div className="box testimonial-ktp-card">
        <article className="media">
            <figure className="media-left is-align-self-center">
                <p className="image is-96x96 avatar-container">
                    <FaUser size="3.5em" className="has-text-grey" />
                </p>
            </figure>
            <div className="media-content" style={{ display: 'flex', flexDirection: 'column' }}>
                <div>
                    <p className="title is-5 mb-0">{testimoni.name}</p>
                    <p className="subtitle is-6 has-text-grey">({testimoni.title})</p>
                </div>
                <div className="content my-4" style={{ flexGrow: 1, overflowY: 'auto', minHeight: '50px' }}>
                    <p className="is-italic">"{testimoni.quote}"</p>
                </div>
                <div className="has-text-warning mt-auto">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className="icon is-small">
                            <FaStar style={{ color: i < testimoni.rating ? '#ffdd57' : '#dbdbdb' }} />
                        </span>
                    ))}
                </div>
            </div>
        </article>
    </div>
);

const TestimoniSection = () => {
    const { data: responseData, error, isLoading } = useSWR(
        `${import.meta.env.VITE_BACKEND_URL}/api/testimoni?all=true`,
        fetcher
    );

    const isMobile = window.innerWidth < 768;

    const [visibleCount, setVisibleCount] = useState(isMobile ? 3 : 6);

    const renderContent = () => {
        if (isLoading) return <p>Memuat testimoni...</p>;
        if (error) return <p>Terjadi kesalahan saat memuat data.</p>;

        const allTestimonials = responseData && responseData.data ? responseData.data : responseData || [];

        if (allTestimonials.length === 0) {
            return <p className="subtitle is-5 has-text-grey has-text-centered">Belum ada testimoni dari pelanggan.</p>;
        }

        return (
            <>
                <motion.div className="columns is-multiline is-centered">
                    {allTestimonials.slice(0, visibleCount).map((testimoni) => (
                        <motion.div
                            key={testimoni.id}
                            className="column is-one-third-desktop is-half-tablet is-flex"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <TestimoniCard testimoni={testimoni} />
                        </motion.div>
                    ))}
                </motion.div>

                {visibleCount < allTestimonials.length && (
                    <div className="has-text-centered mt-6">
                        <button
                            className="button is-danger is-rounded is-medium"
                            onClick={() => setVisibleCount(prevCount => prevCount + (isMobile ? 3 : 6))}
                        >
                            Lihat Lebih Banyak
                        </button>
                    </div>
                )}
            </>
        );
    };

    return (
        <section
            id="testimoni"
            className="section is-flex is-align-items-center has-background-light"
            style={{ minHeight: '100vh' }}
        >
            <div className="container">
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