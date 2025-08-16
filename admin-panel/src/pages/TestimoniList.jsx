import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const TestimoniList = () => {
    const [testimonis, setTestimonis] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3001/api/testimoni')
            .then(res => res.json())
            .then(data => {
                setTestimonis(data);
                setIsLoading(false);
            })
            .catch(() => {
                toast.error("Gagal memuat data testimoni.");
                setIsLoading(false);
            });
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Anda yakin ingin menghapus testimoni ini?')) {
            await fetch(`http://localhost:3001/api/testimoni/${id}`, { method: 'DELETE' });
            setTestimonis(testimonis.filter(t => t.id !== id));
            toast.success('Testimoni berhasil dihapus!');
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
        </div>
    );
};

export default TestimoniList;