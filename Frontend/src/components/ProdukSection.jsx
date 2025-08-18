import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPepperHot } from 'react-icons/fa6';

// Komponen terpisah untuk satu kartu produk (agar lebih rapi)
const ProductCard = ({ product }) => (
    <motion.div
        key={product.id}
        className="column is-one-quarter-desktop is-half-tablet"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
    >
        <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="card-image">
                <figure className="image is-4by3">
                    <img
                        src={`${import.meta.env.VITE_BACKEND_URL}${product.imageUrl}`}
                        alt={product.name}
                        style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                    />
                </figure>
            </div>
            <div className="card-content" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, textAlign: 'left' }}>
                <p className="title is-5">{product.name}</p>
                <p className="subtitle is-6">{product.description}</p>
            </div>
            <footer className="card-footer">
                <div className="card-footer-item">
                    <a href="#" className="button is-danger is-outlined"><span>Pesan Ini</span></a>
                </div>
                <div className="card-footer-item">
                    <div className="is-flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className="icon is-small">
                                <FaPepperHot className={i < product.level ? 'has-text-danger' : 'has-text-grey-lighter'} />
                            </span>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    </motion.div>
);


const ProdukSection = () => {
    const [allProducts, setAllProducts] = useState([]); // Menyimpan SEMUA produk
    const [isLoading, setIsLoading] = useState(true);

    // PERUBAHAN 1: Tambahkan state untuk pagination
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 4; // Tampilkan 4 produk per halaman

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/produk`);
                const data = await response.json();
                setAllProducts(data);
            } catch (error) {
                console.error("Gagal mengambil data produk:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchProducts();
    }, []);

    // PERUBAHAN 2: Logika untuk memotong data sesuai halaman saat ini
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = allProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(allProducts.length / productsPerPage);

    // Fungsi untuk ganti halaman
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (isLoading) {
        return <section className="section is-medium"><progress className="progress is-small is-primary"></progress></section>;
    }

    return (
        <section
            id="produk"
            className="section has-background-light is-flex is-align-items-center"
            style={{
                minHeight: '100vh'
            }}>
            <div className="container has-text-centered">
                <h2 className="title is-2 has-text-black">Varian Jawara Kami</h2>
                <p className="subtitle is-5 has-text-grey mb-6">Pilih tingkat kepedasan favoritmu.</p>

                {allProducts.length > 0 ? (
                    <>
                        <motion.div className="columns is-centered is-multiline">
                            {/* Tampilkan hanya produk untuk halaman saat ini */}
                            {currentProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </motion.div>

                        {/* PERUBAHAN 3: Tampilkan pagination jika halaman lebih dari 1 */}
                        {totalPages > 1 && (
                            <nav className="pagination is-centered is-rounded mt-6 product-pagination" role="navigation" aria-label="pagination">
                                <ul className="pagination-list">
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <li key={i + 1}>
                                            <a
                                                className={`pagination-link ${currentPage === i + 1 ? 'is-current' : ''}`}
                                                aria-label={`Goto page ${i + 1}`}
                                                onClick={() => paginate(i + 1)}
                                            >
                                                {i + 1}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        )}
                    </>
                ) : (
                    <p>Saat ini belum ada produk yang tersedia.</p>
                )}
            </div>
        </section>

    );
};

export default ProdukSection;