import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3001/api/produk')
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setIsLoading(false);
            })
            .catch(() => {
                toast.error("Gagal memuat data produk.");
                setIsLoading(false);
            });
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Anda yakin ingin menghapus produk ini?')) {
            await fetch(`http://localhost:3001/api/produk/${id}`, { method: 'DELETE' });
            setProducts(products.filter(p => p.id !== id));
            toast.success('Produk berhasil dihapus!');
        }
    };

    if (isLoading) {
        return <progress className="progress is-small is-primary" max="100"></progress>;
    }

    return (
        <div>
            <div className="level">
                <div className="level-left">
                    <h1 className="title">Manajemen Produk</h1>
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
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td>{product.name}</td>
                                <td>{product.level}</td>
                                <td>
                                    <Link to={`/produk/edit/${product.id}`} className="button is-small is-info">
                                        Edit
                                    </Link>
                                    <button onClick={() => handleDelete(product.id)} className="button is-small is-danger ml-2">
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default ProductList;