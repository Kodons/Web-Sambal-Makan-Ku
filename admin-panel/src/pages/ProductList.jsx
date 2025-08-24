import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaSearch } from 'react-icons/fa';
import { FaPepperHot } from 'react-icons/fa6';
import Pagination from '../components/Pagination';
import { fetchWithAuth } from '../utils/api';

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

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const productsPerPage = 10;

    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const searchInputRef = useRef(null);

    useEffect(() => {
        setIsLoading(true);
        fetchWithAuth(`/api/admin/produk?page=${currentPage}&limit=${productsPerPage}&search=${debouncedSearchTerm}`)
            .then(response => {
                setProducts(response.data);
                setTotalPages(Math.ceil(response.total / productsPerPage));
            })
            .catch(error => toast.error(error.message))
            .finally(() => setIsLoading(false));
    }, [currentPage, debouncedSearchTerm]);

    useEffect(() => {
        if (!isLoading && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isLoading]);

    const handleDelete = async (id) => {
        if (window.confirm('Anda yakin ingin menghapus produk ini?')) {
            try {
                await fetchWithAuth(`/api/admin/produk/${id}`, { method: 'DELETE' });
                toast.success('Produk berhasil dihapus!');
                const response = await fetchWithAuth(`/api/admin/produk?page=${currentPage}&limit=${productsPerPage}&search=${debouncedSearchTerm}`);
                setProducts(response.data);
                setTotalPages(Math.ceil(response.total / productsPerPage));
            } catch (error) {
                toast.error(error.message);
            }
        }
    };

    if (isLoading && products.length === 0) {
        return <progress className="progress is-small is-primary" max="100"></progress>;
    }

    return (
        <div>
            <div className="level mb-5">
                <div className="level-left">
                    <div className="field">
                        <div className="control has-icons-left">
                            <input
                                ref={searchInputRef}
                                className="input"
                                type="text"
                                placeholder="Cari produk..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <span className="icon is-small is-left">
                                <FaSearch />
                            </span>
                        </div>
                    </div>
                </div>
                <div className="level-right">
                    <Link to="/produk/baru" className="button is-primary">
                        + Tambah Produk Baru
                    </Link>
                </div>
            </div>

            <div className="box">
                <table className="table is-fullwidth is-striped is-hoverable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nama</th>
                            <th>Level Pedas</th>
                            <th>Harga</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td>{product.name}</td>
                                <td>
                                    <div className="is-flex">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <span key={i} className="icon is-small">
                                                <FaPepperHot className={i < product.level ? 'has-text-danger' : 'has-text-grey-lighter'} />
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td>
                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(product.harga)}
                                </td>
                                <td>
                                    <Link to={`/produk/edit/${product.id}`} className="button is-small is-info">Edit</Link>
                                    <button onClick={() => handleDelete(product.id)} className="button is-small is-danger ml-2">Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={page => setCurrentPage(page)}
            />
        </div>
    );
};

export default ProductList;
