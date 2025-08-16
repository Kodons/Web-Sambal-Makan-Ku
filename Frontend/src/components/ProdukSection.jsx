import React, { useState, useEffect } from 'react'; // 1. Impor useState & useEffect
import { motion } from 'framer-motion';
import { FaPepperHot } from 'react-icons/fa6';

const ProdukSection = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        async function fetchProducts() {
            try {
                // PERUBAHAN: Gunakan import.meta.env.VITE_BACKEND_URL
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/produk`);
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Gagal mengambil data produk:", error);
            }
        }
        fetchProducts();
    }, []);

    return (
        <section id="produk" className="section is-medium has-background-light is-flex is-flex-direction-column is-justify-content-center" style={{ minHeight: '100vh' }}>
            <div className="container has-text-centered">
                <h2 className="title is-2 has-text-black">Varian Jawara Kami</h2>
                <p className="subtitle is-5 has-text-grey mb-6">Pilih tingkat kepedasan favoritmu.</p>
                <motion.div
                    className="columns is-centered is-multiline"
                // ... (properti animasi tidak berubah) ...
                >
                    {/* 4. Lakukan looping pada state 'products', bukan array statis lagi */}
                    {products.map((product) => (
                        <motion.div
                            key={product.id} // Gunakan ID dari database sebagai key
                            // ... (properti animasi tidak berubah) ...
                            className="column is-one-third-desktop is-half-tablet"
                        >
                            <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <div className="card-image">
                                    <figure className="image is-4by3">
                                        {/* PERHATIKAN: Path gambar mungkin perlu disesuaikan (lihat penjelasan di bawah) */}
                                        <img
                                            src={`${import.meta.env.VITE_BACKEND_URL}${product.imageUrl}`}
                                            alt={product.name}
                                            style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                                        />
                                    </figure>
                                </div>
                                <div className="card-content has-text-centered" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                    <p className="title is-4">{product.name}</p>
                                    <p className="subtitle is-6 mb-4">{product.description}</p>
                                    <div className="is-flex is-justify-content-center mb-4">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <span key={i} className="icon is-small mx-1">
                                                <FaPepperHot className={i < product.level ? 'has-text-danger' : 'has-text-grey-lighter'} />
                                            </span>
                                        ))}
                                    </div>
                                    <a href="#" className="button is-danger is-fullwidth is-outlined has-text-weight-bold" style={{ marginTop: 'auto' }}>
                                        Pesan Ini
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default ProdukSection;