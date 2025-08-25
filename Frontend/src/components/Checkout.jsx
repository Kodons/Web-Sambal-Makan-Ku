import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { QRCodeCanvas } from 'qrcode.react';
import { generateDynamicQris } from '../utils/qris';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Checkout = () => {
    const { cartItems, clearCart } = useCart();
    const navigate = useNavigate();

    // State untuk data pelanggan
    const [customerName, setCustomerName] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [paymentProofFile, setPaymentProofFile] = useState(null);

    // State untuk alur checkout
    const [staticQrisData, setStaticQrisData] = useState('');
    const [dynamicQrisString, setDynamicQrisString] = useState('');
    const [step, setStep] = useState(1); // 1 untuk form data, 2 untuk pembayaran
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Ambil data QRIS statis dari backend saat komponen dimuat
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/api/settings`);
                const data = await response.json();
                if (data && data.qrisStaticData) {
                    setStaticQrisData(data.qrisStaticData);
                } else {
                    toast.error("Metode pembayaran QRIS belum diatur oleh admin.");
                }
            } catch (error) {
                console.error("Gagal mengambil data settings:", error);
                toast.error("Gagal memuat metode pembayaran.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    // Redirect jika keranjang kosong
    useEffect(() => {
        if (cartItems.length === 0 && !isSubmitting) {
            navigate('/');
        }
    }, [cartItems, navigate, isSubmitting]);

    const subtotal = cartItems.reduce((sum, item) => sum + item.harga * item.quantity, 0);
    const shippingCost = 15000;
    const totalAmount = subtotal + shippingCost;

    // Fungsi untuk lanjut ke tahap pembayaran
    const handleProceedToPayment = (e) => {
        e.preventDefault();
        if (!customerName.trim() || !customerAddress.trim() || !customerPhone.trim()) {
            toast.error("Harap isi semua data pengiriman dengan lengkap.");
            return;
        }
        try {
            const dynamicString = generateDynamicQris(staticQrisData, totalAmount);
            setDynamicQrisString(dynamicString);
            setStep(2);
        } catch (error) {
            console.error(error);
            toast.error("Gagal membuat kode QR pembayaran.");
        }
    };

    // Fungsi untuk mengirim pesanan
    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        if (!paymentProofFile) {
            toast.error("Mohon unggah bukti pembayaran Anda.");
            return;
        }
        setIsSubmitting(true);

        try {
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

            navigate('/pesanan-berhasil', { state: { order: newOrderData } });
            clearCart();
            toast.success('Pesanan berhasil dibuat! Terima kasih.');

        } catch (error) {
            console.error("Error saat checkout:", error);
            toast.error(error.message || "Terjadi kesalahan saat mengirim pesanan.");
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <section className="section" style={{ paddingTop: '8rem', textAlign: 'center' }}>Memuat halaman checkout...</section>;
    }

    return (
        <section className="section" style={{ paddingTop: '6rem' }}>
            <div className="container">

                {/* TAHAP 1: FORM DATA PENGIRIMAN */}
                {step === 1 && (
                    <form onSubmit={handleProceedToPayment}>
                        <h1 className="title">Langkah 1: Data Pengiriman</h1>
                        <div className="columns">
                            <div className="column is-two-thirds">
                                <div className="box">
                                    <h2 className="subtitle">Isi Data Anda</h2>
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

                            <div className="column">
                                <div className="box">
                                    <h2 className="subtitle">Rincian Pesanan</h2>
                                    <p>Subtotal: <strong>Rp {subtotal.toLocaleString('id-ID')}</strong></p>
                                    <p>Ongkos Kirim: <strong>Rp {shippingCost.toLocaleString('id-ID')}</strong></p>
                                    <hr />
                                    <p className="title is-4">Total Bayar: Rp {totalAmount.toLocaleString('id-ID')}</p>
                                    <button type="submit" className="button is-danger is-fullwidth mt-5" disabled={!staticQrisData}>
                                        Lanjutkan ke Pembayaran
                                    </button>
                                    {!staticQrisData && <p className="help is-danger mt-2">Metode pembayaran QRIS sedang tidak tersedia.</p>}
                                </div>
                            </div>
                        </div>
                    </form>
                )}

                {/* TAHAP 2: PEMBAYARAN & UPLOAD BUKTI */}
                {step === 2 && (
                    <form onSubmit={handleSubmitOrder}>
                        <h1 className="title">Langkah 2: Pembayaran</h1>
                        <div className="columns is-centered">
                            <div className="column is-half">
                                <div className="box has-text-centered">
                                    <h2 className="subtitle">Silakan Scan QRIS Dinamis</h2>
                                    <p>Nominal pembayaran sebesar <strong>Rp {totalAmount.toLocaleString('id-ID')}</strong> akan terisi secara otomatis di aplikasi Anda.</p>
                                    <div className="my-4">
                                        <QRCodeCanvas
                                            value={dynamicQrisString}
                                            size={256}
                                            style={{ margin: 'auto', borderRadius: '8px', border: '1px solid #dbdbdb' }}
                                        />
                                    </div>
                                    <hr />
                                    <h2 className="subtitle mt-5">Unggah Bukti Pembayaran</h2>
                                    <p className="is-size-7 mb-3">Setelah scan berhasil, unggah screenshot bukti pembayaran di sini.</p>
                                    <div className="field">
                                        <div className="control">
                                            <input className="input" type="file" accept="image/*" onChange={e => setPaymentProofFile(e.target.files[0])} required />
                                        </div>
                                    </div>
                                    <button type="submit" className={`button is-danger is-fullwidth mt-4 ${isSubmitting ? 'is-loading' : ''}`} disabled={isSubmitting}>
                                        Kirim Bukti & Selesaikan Pesanan
                                    </button>
                                    <button type="button" className="button is-text mt-2" onClick={() => setStep(1)}>
                                        Kembali ke Form Data
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </section>
    );
};

export default Checkout;