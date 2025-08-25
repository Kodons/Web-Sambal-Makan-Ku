import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaSearch } from 'react-icons/fa';
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

const TestimoniList = () => {
    const [testimonis, setTestimonis] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const testimonialsPerPage = 10;

    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const searchInputRef = useRef(null);

    useEffect(() => {
        setIsLoading(true);
        fetchWithAuth(`/api/admin/testimoni?page=${currentPage}&limit=${testimonialsPerPage}&search=${debouncedSearchTerm}`)
            .then(response => {
                setTestimonis(response.data);
                setTotalPages(Math.ceil(response.total / testimonialsPerPage));
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
        if (window.confirm('Anda yakin ingin menghapus testimoni ini?')) {
            try {
                await fetchWithAuth(`/api/admin/testimoni/${id}`, { method: 'DELETE' });
                toast.success('Testimoni berhasil dihapus!');
                // Muat ulang data
                const response = await fetchWithAuth(`/api/admin/testimoni?page=${currentPage}&limit=${testimonialsPerPage}&search=${debouncedSearchTerm}`);
                setTestimonis(response.data);
                setTotalPages(Math.ceil(response.total / testimonialsPerPage));
            } catch (error) {
                toast.error(error.message);
            }
        }
    };

    if (isLoading && testimonis.length === 0) {
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
                                placeholder="Cari testimoni..."
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
