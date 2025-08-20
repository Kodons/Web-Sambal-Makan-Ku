import React from 'react';
import { FaWhatsapp, FaBox, FaMotorcycle } from 'react-icons/fa';

const HowToOrder = () => {
    return (
        <section className="section is-medium has-background-dark has-text-light">
            <div className="container has-text-centered">
                <h2 className="title is-2 has-text-white">Cara Pesan, Gampang Banget!</h2>
                <p className="subtitle is-5 has-text-grey-light mb-6">Hanya butuh 3 langkah mudah untuk menikmati Sambal Teman Makan Ku.</p>

                <div className="columns is-centered steps-container">

                    {/* Langkah 1: Hubungi via WA */}
                    <div className="column is-3 step-item">
                        <div className="icon-wrapper mb-4">
                            <span className="icon is-large has-text-success" style={{
                                width: '100px', height: '100px', border: '3px solid #48c774',
                                borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <FaWhatsapp size="3em" />
                            </span>
                        </div>
                        <h3 className="title is-4 has-text-white">1. Hubungi WhatsApp</h3>
                        <p>Klik tombol "Pesan Sekarang" dan kirim format pesanan Anda ke admin kami.</p>
                    </div>

                    {/* Langkah 2: Konfirmasi & Pembayaran */}
                    <div className="column is-3 step-item">
                         <div className="icon-wrapper mb-4">
                            <span className="icon is-large has-text-info" style={{
                                width: '100px', height: '100px', border: '3px solid #3e8ed0',
                                borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <FaBox size="3em" />
                            </span>
                        </div>
                        <h3 className="title is-4 has-text-white">2. Konfirmasi Pesanan</h3>
                        <p>Admin akan mengkonfirmasi total pesanan dan ongkos kirim. Lakukan pembayaran.</p>
                    </div>

                    {/* Langkah 3: Tunggu & Nikmati */}
                    <div className="column is-3 step-item">
                         <div className="icon-wrapper mb-4">
                            <span className="icon is-large has-text-warning" style={{
                                width: '100px', height: '100px', border: '3px solid #ffdd57',
                                borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <FaMotorcycle size="3em" />
                            </span>
                        </div>
                        <h3 className="title is-4 has-text-white">3. Tunggu & Nikmati</h3>
                        <p>Pesanan Anda langsung kami kemas dan kirim. Tinggal tunggu sambal tiba di rumah!</p>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default HowToOrder;