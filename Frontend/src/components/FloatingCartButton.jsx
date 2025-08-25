import React from 'react';
import { FaCartShopping } from 'react-icons/fa6';
import { useCart } from '../context/CartContext';
import '../styles/FloatingCartButton.css';

// MODIFIKASI: Tambahkan prop onCartClick
const FloatingCartButton = ({ onCartClick }) => {
    const { cartItems } = useCart();
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        totalItems > 0 && (
            <button className="floating-cart-btn" onClick={onCartClick} aria-label="Lihat Keranjang">
                <FaCartShopping size="1.5em" />
                <span className="cart-item-count">
                    {totalItems}
                </span>
            </button>
        )
    );
};

export default FloatingCartButton;