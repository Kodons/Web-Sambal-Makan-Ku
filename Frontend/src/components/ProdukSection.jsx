import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPepperHot, FaCartShopping } from 'react-icons/fa6';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

// --- Komponen ProductCard (dengan tombol) ---
const ProductCard = ({ product, onAddToCart }) => (
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
                        loading="lazy"
                    />
                </figure>
            </div>
            <div className="card-content" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, textAlign: 'left' }}>
                <p className="title is-5">{product.name}</p>
                <p className="subtitle is-6">{product.description}</p>
                <p className="title is-4 has-text-danger has-text-weight-bold mt-auto pt-4">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(product.harga)}
                </p>
            </div>
            <footer className="card-footer">
                <div className="card-footer-item">
                    <span>Level Pedas:</span>
                    <div className="is-flex ml-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className="icon is-small">
                                <FaPepperHot className={i < product.level ? 'has-text-danger' : 'has-text-grey-lighter'} />
                            </span>
                        ))}
                    </div>
                </div>
                <div className="card-footer-item">
                    <button 
                        className="button is-danger is-fullwidth"
                        onClick={() => onAddToCart(product)}
                    >
                        <span className="icon">
                            <FaCartShopping />
                        </span>
                        <span>Beli</span>
                    </button>
                </div>
            </footer>
        </div>
    </motion.div>
);


// --- Komponen ProdukSection ---
const ProdukSection = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 4;
    const { addToCart } = useCart(); 

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/produk`);
                const responseData = await response.json();
                
                if (Array.isArray(responseData)) {
                    setAllProducts(responseData);
                } else {
                    console.error("Format data tidak sesuai, diharapkan array.", responseData);
                    setAllProducts([]); 
                }
            } catch (error) {
                console.error("Gagal mengambil data produk:", error);
                setAllProducts([]);
            } finally {
                setIsLoading(false);
            }
        }
        fetchProducts();
    }, []);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = allProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(allProducts.length / productsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // BARU: Fungsi ini sekarang memanggil context dan menampilkan notifikasi
    const handleAddToCart = (product) => {
        addToCart(product);
        toast.success(`${product.name} berhasil ditambahkan!`);
    };

    if (isLoading) {
        return <section className="section is-medium"><progress className="progress is-small is-primary"></progress></section>;
    }

    return (
        <section
            id="produk"
            className="section has-background-light is-flex is-align-items-center"
            style={{ minHeight: '100vh' }}
        >
            <div className="container has-text-centered">
                <h2 className="title is-2 has-text-black">Varian Jawara Kami</h2>
                <p className="subtitle is-5 has-text-grey mb-6">Pilih tingkat kepedasan favoritmu.</p>

                {allProducts.length > 0 ? (
                    <>
                        <motion.div className="columns is-centered is-multiline">
                            {currentProducts.map((product) => (
                                <ProductCard 
                                    key={product.id} 
                                    product={product} 
                                    onAddToCart={handleAddToCart} 
                                />
                            ))}
                        </motion.div>
                        
                        {totalPages > 1 && (
                            <nav className="pagination is-centered is-rounded mt-6 product-pagination" role="navigation" aria-label="pagination">
                               <ul className="pagination-list">
                                   {Array.from({ length: totalPages }, (_, i) => (
                                       <li key={i + 1}>
                                           <button
                                               className={`pagination-link ${currentPage === i + 1 ? 'is-current' : ''}`}
                                               aria-label={`Goto page ${i + 1}`}
                                               onClick={() => paginate(i + 1)}
                                           >
                                               {i + 1}
                                           </button>
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
