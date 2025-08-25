import React from 'react';
import { useSWRConfig } from 'swr';
import toast from 'react-hot-toast';
import { fetchWithAuth } from '../utils/api'; // Sesuaikan path

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const OrderDetail = ({ order, onClose }) => {
    const { mutate } = useSWRConfig();

    if (!order) return null;

    const handleApprove = async () => {
        if (window.confirm('Yakin ingin menyetujui pesanan ini?')) {
            try {
                await fetchWithAuth(`/api/admin/orders/${order.id}/approve`, {
                    method: 'PUT',
                    body: JSON.stringify({ adminNotes: 'Pembayaran dikonfirmasi.' })
                });
                toast.success('Pesanan berhasil disetujui!');
                mutate('/api/admin/orders'); // Refresh daftar pesanan
                onClose(); // Tutup modal
            } catch (error) {
                toast.error('Gagal menyetujui pesanan.');
            }
        }
    };

    const handleCancel = async () => {
        const reason = prompt('Harap masukkan alasan pembatalan pesanan ini:');
        if (reason) {
            try {
                await fetchWithAuth(`/api/admin/orders/${order.id}/cancel`, {
                    method: 'PUT',
                    body: JSON.stringify({ adminNotes: reason })
                });
                toast.success('Pesanan berhasil dibatalkan.');
                mutate('/api/admin/orders'); // Refresh daftar pesanan
                onClose(); // Tutup modal
            } catch (error) {
                toast.error('Gagal membatalkan pesanan.');
            }
        }
    };

    return (
        <div className="modal is-active">
            <div className="modal-background" onClick={onClose}></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Detail Pesanan #{order.id}</p>
                    <button className="delete" aria-label="close" onClick={onClose}></button>
                </header>
                <section className="modal-card-body">
                    <div className="content">
                        <strong>Pelanggan:</strong> {order.customerName}<br />
                        <strong>No. HP:</strong> {order.customerPhone}<br />
                        <strong>Alamat:</strong> {order.customerAddress}<br />
                        <strong>Tanggal:</strong> {new Date(order.createdAt).toLocaleString('id-ID')}<br />
                        <strong>Status:</strong> <span className={`tag ${order.status === 'PENDING' ? 'is-warning' : order.status === 'APPROVED' ? 'is-success' : 'is-danger'}`}>{order.status}</span>
                        <hr />
                        <strong>Produk Dipesan:</strong>
                        <ul>
                            {order.orderItems.map(item => (
                                <li key={item.id}>
                                    {item.product.name} x {item.quantity} - @ Rp {item.price.toLocaleString('id-ID')}
                                </li>
                            ))}
                        </ul>
                        <hr/>
                        <p>Subtotal: Rp { (order.totalAmount - order.shippingCost).toLocaleString('id-ID') }</p>
                        <p>Ongkir: Rp { order.shippingCost.toLocaleString('id-ID') }</p>
                        <p><strong>Total: Rp {order.totalAmount.toLocaleString('id-ID')}</strong></p>
                        <hr />
                        <strong>Bukti Pembayaran:</strong>
                        <figure className="image is-4by3">
                            <img src={`${BACKEND_URL}${order.paymentProofUrl}`} alt="Bukti Pembayaran" />
                        </figure>
                    </div>
                </section>
                <footer className="modal-card-foot">
                    {order.status === 'PENDING' && (
                        <>
                            <button className="button is-success" onClick={handleApprove}>Setujui Pesanan</button>
                            <button className="button is-danger" onClick={handleCancel}>Tolak / Batalkan</button>
                        </>
                    )}
                    <button className="button" onClick={onClose}>Tutup</button>
                </footer>
            </div>
        </div>
    );
};

export default OrderDetail;