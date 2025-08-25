import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import '../styles/CartSidebar.css'; 

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const CartSidebar = ({ isOpen, onClose }) => {
    const { cartItems, addToCart, removeFromCart, deleteFromCart } = useCart();

    const subtotal = cartItems.reduce((sum, item) => sum + item.harga * item.quantity, 0);

    const handleCheckout = () => {
        window.location.href = '/checkout';
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="cart-sidebar-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.div
                        className="cart-sidebar"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                        <header className="cart-sidebar-header">
                            <h2 className="title is-4 has-text-black">Keranjang Anda</h2>
                            <button className="delete" aria-label="close" onClick={onClose}></button>
                        </header>

                        <section className="cart-sidebar-body">
                            {cartItems.length > 0 ? (
                                cartItems.map(item => (
                                    <div key={item.id} className="cart-item">
                                        <img
                                            src={`${BACKEND_URL}${item.imageUrl}`}
                                            alt={item.name}
                                            className="cart-item-image"
                                        />
                                        <div className="cart-item-details">
                                            <p className="has-text-weight-bold has-text-black">{item.name}</p>
                                            <p className='has-text-black'>Rp {item.harga.toLocaleString('id-ID')}</p>
                                            <div className="cart-item-actions">
                                                <button className="button is-small" onClick={() => removeFromCart(item.id)}><FaMinus /></button>
                                                <span className="mx-2 has-text-black">{item.quantity}</span>
                                                <button className="button is-small" onClick={() => addToCart(item)}><FaPlus /></button>
                                                <button className="button is-danger is-small is-outlined ml-auto" onClick={() => deleteFromCart(item.id)}>
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>Keranjang Anda masih kosong.</p>
                            )}
                        </section>

                        {cartItems.length > 0 && (
                            <footer className="cart-sidebar-footer">
                                <div className="is-flex is-justify-content-space-between mb-4">
                                    <p className="has-text-weight-bold has-text-black">Subtotal:</p>
                                    <p className="has-text-weight-bold title is-5 has-text-black">Rp {subtotal.toLocaleString('id-ID')}</p>
                                </div>
                                <button
                                    className="button is-danger is-fullwidth has-text-weight-bold"
                                    onClick={handleCheckout}
                                >
                                    Lanjut ke Checkout
                                </button>
                            </footer>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartSidebar;