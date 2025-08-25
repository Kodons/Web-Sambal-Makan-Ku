import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Membuat Context
const CartContext = createContext();

// 2. Membuat custom hook untuk mempermudah penggunaan context
export const useCart = () => useContext(CartContext);

// 3. Membuat komponen Provider yang akan membungkus aplikasi
export const CartProvider = ({ children }) => {
    // Inisialisasi state keranjang dari localStorage, atau array kosong jika tidak ada
    const [cartItems, setCartItems] = useState(() => {
        try {
            const localData = localStorage.getItem('cartItems');
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            console.error("Gagal mengambil data keranjang dari localStorage", error);
            return [];
        }
    });

    // Gunakan useEffect untuk menyimpan ke localStorage setiap kali cartItems berubah
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    // Fungsi untuk menambah produk ke keranjang
    const addToCart = (product) => {
        setCartItems(prevItems => {
            const itemExists = prevItems.find(item => item.id === product.id);
            if (itemExists) {
                // Jika produk sudah ada, tambah quantity-nya
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            // Jika produk baru, tambahkan ke keranjang dengan quantity 1
            return [...prevItems, { ...product, quantity: 1 }];
        });
    };

    // Fungsi untuk mengurangi produk dari keranjang
    const removeFromCart = (productId) => {
        setCartItems(prevItems => {
            const itemExists = prevItems.find(item => item.id === productId);
            if (itemExists && itemExists.quantity > 1) {
                // Jika kuantitas lebih dari 1, kurangi 1
                return prevItems.map(item =>
                    item.id === productId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                );
            }
            // Jika kuantitas 1, hapus item dari keranjang
            return prevItems.filter(item => item.id !== productId);
        });
    };
    
    // Fungsi untuk menghapus produk dari keranjang
    const deleteFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    // Fungsi untuk mengosongkan keranjang
    const clearCart = () => {
        setCartItems([]);
    };

    // Data dan fungsi yang akan dibagikan ke seluruh aplikasi
    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        deleteFromCart,
        clearCart,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};