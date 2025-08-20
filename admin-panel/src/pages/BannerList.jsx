import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchWithAuth } from '../utils/api';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const BannerList = () => {
    const [banners, setBanners] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchWithAuth('/api/admin/banners')
            .then(data => {
                setBanners(data);
            })
            .catch(error => toast.error(error.message))
            .finally(() => setIsLoading(false));
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Anda yakin ingin menghapus banner ini?')) {
            try {
                await fetchWithAuth(`/api/admin/banners/${id}`, { method: 'DELETE' });
                setBanners(banners.filter(b => b.id !== id));
                toast.success('Banner berhasil dihapus!');
            } catch (error) {
                toast.error(error.message);
            }
        }
    };

    return (
        <div>
            <h1 className="title">Manajemen Banner</h1>
            <Link to="/banners/baru" className="button is-primary mb-4">
                + Tambah Banner Baru
            </Link>
            <table className="table is-fullwidth is-striped is-hoverable">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Preview Gambar</th>
                        <th>Status</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {banners.map(banner => (
                        <tr key={banner.id}>
                            <td>{banner.id}</td>
                            <td>
                                <img src={`${BACKEND_URL}${banner.imageUrl}`} alt="Banner" width="150" />
                            </td>
                            <td>{banner.isActive ?
                                <span className="tag is-success">Aktif</span> :
                                <span className="tag is-danger">Tidak Aktif</span>
                            }</td>
                            <td>
                                <Link to={`/banners/edit/${banner.id}`} className="button is-small is-info">
                                    Edit
                                </Link>
                                <button onClick={() => handleDelete(banner.id)} className="button is-small is-danger ml-2">
                                    Hapus
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BannerList;