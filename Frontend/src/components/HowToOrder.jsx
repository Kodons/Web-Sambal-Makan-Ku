import React from 'react';
import { FaCartPlus, FaCreditCard, FaBoxOpen } from 'react-icons/fa';

const HowToOrder = () => {
    return (
        <section className="section is-medium has-background-dark has-text-light">
            <div className="container has-text-centered">
                <h2 className="title is-2 has-text-white">Cara Pesan, Gampang Banget!</h2>
                <p className="subtitle is-5 has-text-grey-light mb-6">Hanya butuh 3 langkah mudah untuk menikmati Sambal Teman Makan Ku.</p>

                <div className="columns is-centered steps-container">

                    {/* Langkah 1: Pilih Produk & Tambah ke Keranjang */}
                    <div className="column is-3 step-item">
                        <div className="icon-wrapper mb-4">
                            <span className="icon is-large has-text-success" style={{
                                width: '100px', height: '100px', border: '3px solid #48c774',
                                borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <FaCartPlus size="3em" />
                            </span>
                        </div>
                        <h3 className="title is-4 has-text-white">1. Pilih Produk</h3>
                        <p>Jelajahi varian sambal kami, lalu klik tombol "Beli" untuk menambahkannya ke keranjang belanja Anda.</p>
                    </div>

                    {/* Langkah 2: Checkout & Isi Data */}
                    <div className="column is-3 step-item">
                         <div className="icon-wrapper mb-4">
                            <span className="icon is-large has-text-info" style={{
                                width: '100px', height: '100px', border: '3px solid #3e8ed0',
                                borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <FaCreditCard size="3em" />
                            </span>
                        </div>
                        <h3 className="title is-4 has-text-white">2. Checkout & Bayar</h3>
                        <p>Buka keranjang, lanjutkan ke checkout, dan isi data pengiriman. Lakukan pembayaran dengan scan QRIS dinamis.</p>
                    </div>

                    {/* Langkah 3: Tunggu & Nikmati */}
                    <div className="column is-3 step-item">
                         <div className="icon-wrapper mb-4">
                            <span className="icon is-large has-text-warning" style={{
                                width: '100px', height: '100px', border: '3px solid #ffdd57',
                                borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <FaBoxOpen size="3em" />
                            </span>
                        </div>
                        <h3 className="title is-4 has-text-white">3. Tunggu & Nikmati</h3>
                        <p>Setelah mengunggah bukti bayar, pesanan Anda akan diverifikasi dan dikirim. Tinggal tunggu sambal tiba!</p>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default HowToOrder;