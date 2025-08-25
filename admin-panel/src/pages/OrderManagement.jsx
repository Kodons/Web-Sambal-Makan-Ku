import React, { useState, useEffect, useRef } from 'react';
import { useSWRConfig } from 'swr';
import toast from 'react-hot-toast';
import { FaSearch } from 'react-icons/fa';
import { fetchWithAuth } from '../utils/api';
import OrderDetailModal from './OrderDetail';
import Pagination from '../components/Pagination';

function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

const OrderManagemen = () => {
    const { mutate } = useSWRConfig();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const ordersPerPage = 10;

    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const searchInputRef = useRef(null);

    useEffect(() => {
        setIsLoading(true);
        const endpoint = `/api/admin/orders?page=${currentPage}&limit=${ordersPerPage}&search=${debouncedSearchTerm}`;

        fetchWithAuth(endpoint)
            .then(response => {
                setOrders(response.data);
                setTotalPages(Math.ceil(response.total / ordersPerPage));
            })
            .catch(error => toast.error("Gagal memuat data pesanan: " + error.message))
            .finally(() => setIsLoading(false));
    }, [currentPage, debouncedSearchTerm]);

    useEffect(() => {
        if (!isLoading && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isLoading]);

    const refreshData = () => {
        mutate(`/api/admin/orders?page=${currentPage}&limit=${ordersPerPage}&search=${debouncedSearchTerm}`);
    };

    const getStatusTagColor = (status) => {
        switch (status) {
            case 'PENDING': return 'is-warning';
            case 'APPROVED': return 'is-success';
            case 'CANCELLED': return 'is-danger';
            default: return 'is-light';
        }
    };

    if (isLoading && orders.length === 0) {
        return <progress className="progress is-small is-primary" max="100"></progress>;
    }

    return (
        <div>
            {selectedOrder && (
                <OrderDetailModal
                    order={selectedOrder}
                    onClose={() => {
                        setSelectedOrder(null);
                        refreshData();
                    }}
                />
            )}

            <div className="level mb-5">
                <div className='level-left'>
                    <div className="level-item">
                        <div className="field">
                            <div className="control has-icons-left">
                                <input
                                    ref={searchInputRef}
                                    className="input"
                                    type="text"
                                    placeholder="Cari nama, ID, atau serial number..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <span className="icon is-small is-left">
                                    <FaSearch />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="level-right">
                    <div className="level-item">
                        <h1 className="title is-4">Riwayat Pesanan</h1>
                    </div>
                </div>
            </div>

            <div className="box">
                <table className="table is-fullwidth is-striped is-hoverable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Serial Number</th>
                            <th>Tanggal</th>
                            <th>Nama Pelanggan</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>#{order.id}</td>
                                <td><strong>{order.serialNumber}</strong></td>
                                <td>{new Date(order.createdAt).toLocaleDateString('id-ID')}</td>
                                <td>{order.customerName}</td>
                                <td>Rp {order.totalAmount.toLocaleString('id-ID')}</td>
                                <td>
                                    <span className={`tag ${getStatusTagColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="button is-small is-info"
                                        onClick={() => setSelectedOrder(order)}>
                                        Detail
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {orders.length === 0 && !isLoading && <p className="has-text-centered">Tidak ada pesanan yang cocok dengan pencarian Anda.</p>}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={page => setCurrentPage(page)}
            />
        </div>
    );
};

export default OrderManagemen;