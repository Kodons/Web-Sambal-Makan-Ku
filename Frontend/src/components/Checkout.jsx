import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Checkout = () => {
    const { cartItems, clearCart } = useCart();
    const navigate = useNavigate();

    const [settings, setSettings] = useState(null);
    const [customerName, setCustomerName] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [paymentProofFile, setPaymentProofFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/api/settings`);
                const data = await response.json();
                setSettings(data);
            } catch (error) {
                console.error("Gagal mengambil data settings:", error);
                toast.error("Gagal memuat metode pembayaran.");
            }
        };
        fetchSettings();
    }, []);

    // --- PERBAIKAN 1: Tambahkan pengecekan !isLoading ---
    useEffect(() => {
        if (cartItems.length === 0 && !isLoading) {
            // Jangan tampilkan toast di sini karena akan muncul saat pertama kali masuk
            navigate('/');
        }
    }, [cartItems, navigate, isLoading]);


    const subtotal = cartItems.reduce((sum, item) => sum + item.harga * item.quantity, 0);
    const shippingCost = 15000;
    const totalAmount = subtotal + shippingCost;

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        if (!paymentProofFile) {
            toast.error("Mohon unggah bukti pembayaran Anda.");
            return;
        }
        setIsLoading(true);

        try {
            // (Langkah upload dan kirim data pesanan Anda sudah benar)
            const formData = new FormData();
            formData.append('file', paymentProofFile);
            const uploadResponse = await fetch(`${BACKEND_URL}/api/upload-proof`, {
                method: 'POST',
                body: formData,
            });
            const uploadData = await uploadResponse.json();
            if (!uploadResponse.ok) throw new Error(uploadData.error || 'Gagal mengunggah gambar.');
            const paymentProofUrl = uploadData.filePath;

            const orderData = {
                customerName, customerAddress, customerPhone,
                totalAmount, shippingCost, paymentProofUrl,
                items: cartItems.map(item => ({ id: item.id, quantity: item.quantity, harga: item.harga })),
            };

            const orderResponse = await fetch(`${BACKEND_URL}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });
            const newOrderData = await orderResponse.json();
            if (!orderResponse.ok) throw new Error('Gagal membuat pesanan.');

            // --- PERBAIKAN 2: Ubah urutan eksekusi ---
            // 1. Arahkan ke halaman konfirmasi DULU
            navigate('/pesanan-berhasil', { state: { order: newOrderData } });

            // 2. Baru kosongkan keranjang
            clearCart();

            // 3. Tampilkan notifikasi
            toast.success('Pesanan berhasil dibuat! Terima kasih.');

        } catch (error) {
            console.error("Error saat checkout:", error);
            toast.error(error.message || "Terjadi kesalahan saat mengirim pesanan.");
            setIsLoading(false); // Pastikan loading dihentikan jika ada error
        }
    };

    return (
        <section className="section" style={{ paddingTop: '6rem' }}>
            <div className="container">
                <h1 className="title">Checkout</h1>
                <form onSubmit={handleSubmitOrder}>
                    <div className="columns">
                        {/* Kolom Kiri: Form Data Diri & Rincian Pesanan */}
                        <div className="column is-two-thirds">
                            <div className="box">
                                <h2 className="subtitle">Data Pengiriman</h2>
                                <div className="field">
                                    <label className="label">Nama Lengkap</label>
                                    <div className="control"><input className="input" type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} required /></div>
                                </div>
                                <div className="field">
                                    <label className="label">Alamat Lengkap</label>
                                    <div className="control"><textarea className="textarea" value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} required></textarea></div>
                                </div>
                                <div className="field">
                                    <label className="label">Nomor WhatsApp</label>
                                    <div className="control"><input className="input" type="tel" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} required /></div>
                                </div>
                            </div>
                        </div>

                        {/* Kolom Kanan: Rincian & Pembayaran */}
                        <div className="column">
                            <div className="box">
                                <h2 className="subtitle">Rincian & Pembayaran</h2>
                                <div>
                                    <p>Subtotal: <strong>Rp {subtotal.toLocaleString('id-ID')}</strong></p>
                                    <p>Ongkos Kirim: <strong>Rp {shippingCost.toLocaleString('id-ID')}</strong></p>
                                    <hr />
                                    <p className="title is-4">Total Bayar: Rp {totalAmount.toLocaleString('id-ID')}</p>
                                </div>

                                <div className="mt-5 has-text-centered">
                                    <h3 className="subtitle is-5">Silakan scan QRIS di bawah ini:</h3>
                                    {settings && settings.qrisImageUrl ? (
                                        <div>
                                            <img
                                                src={`${BACKEND_URL}${settings.qrisImageUrl}`}
                                                alt="QRIS Pembayaran"
                                                style={{ maxWidth: '250px', margin: 'auto', display: 'block', borderRadius: '8px' }}
                                            />

                                            {/* --- TOMBOL DOWNLOAD BARU --- */}
                                            <a
                                                href={`${BACKEND_URL}${settings.qrisImageUrl}`}
                                                download="QRIS_Pembayaran.webp"
                                                className="button is-link is-small mt-4"
                                            >
                                                <span className="icon">
                                                    {/* Anda bisa menggunakan react-icons atau class Font Awesome */}
                                                    {/* <FaDownload /> */}
                                                    <i className="fas fa-download"></i>
                                                </span>
                                                <span>Download QRIS</span>
                                            </a>
                                        </div>
                                    ) : (
                                        <p>Metode pembayaran sedang tidak tersedia.</p>
                                    )}
                                </div>

                                <div className="field mt-5">
                                    <label className="label">Unggah Bukti Pembayaran</label>
                                    <div className="control">
                                        <input className="input" type="file" accept="image/*" onChange={e => setPaymentProofFile(e.target.files[0])} required />
                                    </div>
                                    <p className="help">Pastikan gambar jelas dan tidak buram.</p>
                                </div>

                                <button type="submit" className={`button is-danger is-fullwidth mt-4 ${isLoading ? 'is-loading' : ''}`} disabled={isLoading || cartItems.length === 0}>
                                    Kirim Bukti & Selesaikan Pesanan
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Checkout;