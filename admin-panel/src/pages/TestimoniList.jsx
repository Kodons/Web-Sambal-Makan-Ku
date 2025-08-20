import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Pagination from '../components/Pagination';
import { fetchWithAuth } from '../utils/api'; // 1. Impor helper

const TestimoniList = () => {
    const [testimonis, setTestimonis] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const testimonialsPerPage = 10;

    useEffect(() => {
        setIsLoading(true);
        // 2. Gunakan fetchWithAuth untuk mengambil data
        fetchWithAuth(`/api/admin/testimoni?page=${currentPage}&limit=${testimonialsPerPage}`)
            .then(response => {
                setTestimonis(response.data);
                setTotalPages(Math.ceil(response.total / testimonialsPerPage));
            })
            .catch(error => toast.error(error.message))
            .finally(() => setIsLoading(false));
    }, [currentPage]);

    const handleDelete = async (id) => {
        if (window.confirm('Anda yakin ingin menghapus testimoni ini?')) {
            try {
                // 3. Gunakan fetchWithAuth untuk menghapus data
                await fetchWithAuth(`/api/admin/testimoni/${id}`, { method: 'DELETE' });
                toast.success('Testimoni berhasil dihapus!');
                // Muat ulang data
                const response = await fetchWithAuth(`/api/admin/testimoni?page=${currentPage}&limit=${testimonialsPerPage}`);
                setTestimonis(response.data);
                setTotalPages(Math.ceil(response.total / testimonialsPerPage));
            } catch (error) {
                toast.error(error.message);
            }
        }
    };

    if (isLoading) {
        return <progress className="progress is-small is-primary" max="100"></progress>;
    }

    return (
        <div>
            <div className="level">
                <div className="level-left">
                    <h1 className="title">Manajemen Testimoni</h1>
                </div>
                <div className="level-right">
                    <Link to="/testimoni/baru" className="button is-primary">
                        + Tambah Testimoni Baru
                    </Link>
                </div>
            </div>

            <div className="box">
                <table className="table is-fullwidth is-striped is-hoverable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nama</th>
                            <th>Jabatan</th>
                            <th>Rating</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {testimonis.map(testimoni => (
                            <tr key={testimoni.id}>
                                <td>{testimoni.id}</td>
                                <td>{testimoni.name}</td>
                                <td>{testimoni.title}</td>
                                <td>{testimoni.rating} / 5</td>
                                <td>
                                    <Link to={`/testimoni/edit/${testimoni.id}`} className="button is-small is-info">
                                        Edit
                                    </Link>
                                    <button onClick={() => handleDelete(testimoni.id)} className="button is-small is-danger ml-2">
                                        Hapus
                                    </button>
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

export default TestimoniList;