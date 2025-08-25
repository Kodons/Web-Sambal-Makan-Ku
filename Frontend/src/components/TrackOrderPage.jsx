import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaSearch } from 'react-icons/fa';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const OrderStatus = ({ order }) => {
    const getStatusInfo = (status) => {
        switch (status) {
            case 'PENDING':
                return { color: 'is-warning', message: 'Pesanan Anda sedang menunggu verifikasi pembayaran oleh admin.' };
            case 'APPROVED':
                return { color: 'is-success', message: 'Pembayaran telah dikonfirmasi! Pesanan Anda sedang disiapkan untuk pengiriman.' };
            case 'CANCELLED':
                return { color: 'is-danger', message: `Pesanan dibatalkan. Alasan: ${order.adminNotes || 'Tidak ada alasan spesifik.'}` };
            default:
                return { color: 'is-light', message: 'Status tidak diketahui.' };
        }
    };

    const { color, message } = getStatusInfo(order.status);

    return (
        <div className="box mt-6 animate__animated animate__fadeIn">
            <h2 className="title is-4">Hasil Lacak Pesanan</h2>
            <p><strong>Nomor Pesanan:</strong> {order.serialNumber}</p>
            <p><strong>Nama Pelanggan:</strong> {order.customerName}</p>
            <div className={`notification ${color} mt-4`}>
                <p className="has-text-weight-bold">Status: {order.status}</p>
                <p>{message}</p>
            </div>
        </div>
    );
};

const TrackOrderPage = () => {
    const [serialNumber, setSerialNumber] = useState('');
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!serialNumber.trim()) {
            toast.error("Harap masukkan nomor pesanan Anda.");
            return;
        }
        setIsLoading(true);
        setOrder(null);
        setError('');

        try {
            const response = await fetch(`${BACKEND_URL}/api/orders/track/${serialNumber.trim()}`);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Terjadi kesalahan');
            }
            setOrder(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="section" style={{ paddingTop: '8rem', minHeight: '80vh' }}>
            <div className="container">
                <div className="columns is-centered">
                    <div className="column is-half">
                        <h1 className="title has-text-centered">Lacak Pesanan Anda</h1>
                        <p className="subtitle is-6 has-text-centered">Masukkan nomor pesanan yang Anda dapatkan setelah checkout.</p>
                        <form onSubmit={handleSubmit}>
                            <div className="field has-addons">
                                <div className="control is-expanded has-icons-left">
                                    <input
                                        className="input is-medium"
                                        type="text"
                                        placeholder="Contoh: TMK-20250825-XXXX"
                                        value={serialNumber}
                                        onChange={e => setSerialNumber(e.target.value)}
                                    />
                                    <span className="icon is-small is-left">
                                        <FaSearch />
                                    </span>
                                </div>
                                <div className="control">
                                    <button type="submit" className={`button is-danger is-medium ${isLoading ? 'is-loading' : ''}`} disabled={isLoading}>
                                        Lacak
                                    </button>
                                </div>
                            </div>
                        </form>

                        {error && <p className="has-text-danger has-text-centered mt-4">{error}</p>}
                        {order && <OrderStatus order={order} />}

                    </div>
                </div>
            </div>
        </section>
    );
};

export default TrackOrderPage;
