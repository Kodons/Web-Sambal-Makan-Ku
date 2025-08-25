import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const DetailOrder = () => {
    const location = useLocation();
    const { order } = location.state || {};

    if (!order) {
        return (
            <section className="section has-text-centered">
                <p>Data pesanan tidak ditemukan. Silakan kembali ke halaman utama.</p>
                <Link to="/" className="button is-primary mt-4">Kembali ke Beranda</Link>
            </section>
        );
    }

    return (
        <section className="section" style={{ paddingTop: '6rem' }}>
            <div className="container">
                <div className="box has-text-centered">
                    <span className="icon is-large has-text-success">
                        <FaCheckCircle size="3em" />
                    </span>
                    <h1 className="title is-3 mt-4">Pesanan Berhasil Dibuat!</h1>
                    <p className="subtitle is-5">Terima kasih telah berbelanja. Pesanan Anda akan segera kami proses setelah pembayaran diverifikasi.</p>
                    
                    <div className="notification is-warning is-light my-5">
                        Nomor Pesanan Anda: <strong className="is-size-4">{order.serialNumber}</strong>
                        <p>Harap simpan nomor ini untuk referensi.</p>
                    </div>

                    <div className="content has-text-left">
                        <h2 className="title is-4">Rincian Pesanan</h2>
                        <p><strong>Nama:</strong> {order.customerName}</p>
                        <p><strong>Alamat:</strong> {order.customerAddress}</p>
                        <p><strong>No. HP:</strong> {order.customerPhone}</p>
                        
                        <h3 className="title is-5 mt-5">Barang yang Dipesan:</h3>
                        <table className="table is-fullwidth">
                            <tbody>
                                {order.orderItems.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.product.name} x {item.quantity}</td>
                                        <td className="has-text-right">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        <hr />
                        <p><strong>Subtotal:</strong> Rp {(order.totalAmount - order.shippingCost).toLocaleString('id-ID')}</p>
                        <p><strong>Ongkos Kirim:</strong> Rp {order.shippingCost.toLocaleString('id-ID')}</p>
                        <p className="has-text-weight-bold is-size-5">Total Pembayaran: Rp {order.totalAmount.toLocaleString('id-ID')}</p>
                    </div>

                    <Link to="/" className="button is-primary is-medium mt-5">
                        Kembali ke Halaman Utama
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default DetailOrder;