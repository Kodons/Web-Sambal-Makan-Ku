import React from 'react';
import { motion } from 'framer-motion';
import { FaPepperHot, FaLeaf, FaTrophy, FaHandshake, FaShippingFast, FaBoxOpen } from 'react-icons/fa';

const features = [
    { icon: <FaPepperHot/>, title: "100% Cabai Segar", description: "Dipilih langsung dari petani lokal terbaik untuk kualitas pedas yang maksimal." },
    { icon: <FaLeaf/>, title: "Tanpa Pengawet", description: "Kami percaya pada kekuatan bahan alami untuk menjaga rasa dan kualitas." },
    { icon: <FaTrophy/>, title: "Resep Warisan", description: "Racikan bumbu turun-temurun yang menciptakan cita rasa khas tak terlupakan." },
    { icon: <FaHandshake/>, title: "Produksi Higienis", description: "Dibuat di lingkungan yang bersih dan terstandarisasi untuk keamanan Anda." },
    { icon: <FaShippingFast/>, title: "Pengiriman Cepat", description: "Pesanan Anda kami proses dan kirimkan secepat mungkin ke seluruh Indonesia." },
    { icon: <FaBoxOpen/>, title: "Kemasan Aman", description: "Setiap botol dikemas dengan segel dan bubble wrap tebal agar aman di perjalanan." },
];

const KeunggulanSection = () => {
    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 }}};
    const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }};

    return (
        <section id="tentang" className="section is-large">
            <div className="container has-text-centered">
                <h2 className="title is-2">Kenapa Sambal Teman Ku?</h2>
                <p className="subtitle is-5 has-text-grey mb-6">Enam pilar utama yang membuat kami istimewa.</p>
                <motion.div 
                    className="columns is-centered is-multiline"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    {features.map((feature, index) => (
                        <motion.div key={index} variants={itemVariants} className="column is-one-third-desktop is-half-tablet">
                            <span className="icon has-text-danger" style={{ fontSize: '3rem' }}>
                                {feature.icon}
                            </span>
                            <h3 className="title is-4 mt-4">{feature.title}</h3>
                            {/* PERUBAHAN: Kelas diubah menjadi is-size-5 */}
                            <p className="is-size-5">{feature.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default KeunggulanSection;