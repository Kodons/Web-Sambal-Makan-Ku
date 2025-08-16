import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BACKEND_URL = 'http://localhost:3001';

const BannerList = () => {
    const [banners, setBanners] = useState([]);

    useEffect(() => {
        fetch(`${BACKEND_URL}/api/popup-banners`)
            .then(res => res.json())
            .then(data => setBanners(data));
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Anda yakin ingin menghapus banner ini?')) {
            await fetch(`${BACKEND_URL}/api/popup-banners/${id}`, {
                method: 'DELETE',
            });
            setBanners(banners.filter(b => b.id !== id));
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