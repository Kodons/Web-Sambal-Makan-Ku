import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchWithAuth } from '../utils/api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const BannerList = () => {
    const MySwal = withReactContent(Swal);
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

    const handleDelete = (id) => {
        MySwal.fire({
            title: 'Anda Yakin?',
            text: "Banner yang sudah dihapus tidak dapat dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                fetchWithAuth(`/api/admin/banners/${id}`, { method: 'DELETE' })
                    .then(() => {
                        toast.success('Banner berhasil dihapus!');
                        setBanners(prevBanners => prevBanners.filter(banners => banners.id !== id));
                    })
                    .catch(error => {
                        toast.error(error.message);
                    });
            }
        });
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