import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchWithAuth } from '../utils/api';

const TestimoniForm = () => {
    const [name, setName] = useState('');
    const [title, setTitle] = useState('');
    const [quote, setQuote] = useState('');
    const [rating, setRating] = useState(5);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = id !== undefined;

    useEffect(() => {
        if (isEditing) {
            fetchWithAuth(`/api/admin/testimoni/${id}`)
                .then(data => {
                    setName(data.name);
                    setTitle(data.title);
                    setQuote(data.quote);
                    setRating(data.rating);
                });
        }
    }, [id, isEditing]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const testimoniData = { name, title, quote, rating: parseInt(rating) };
        const url = isEditing ? `/api/admin/testimoni/${id}` : '/api/admin/testimoni';
        const method = isEditing ? 'PUT' : 'POST';

        try {
            await fetchWithAuth(url, {
                method,
                body: JSON.stringify(testimoniData),
            });
            toast.success(`Testimoni berhasil ${isEditing ? 'diperbarui' : 'dibuat'}!`);
            navigate('/testimoni');
        } catch (error) {
            toast.error("Terjadi kesalahan: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleQuoteChange = (e) => {
        if (e.target.value.length <= 50) {
            setQuote(e.target.value);
        }
    };

    return (
        <div>
            <h1 className="title">{isEditing ? 'Edit Testimoni' : 'Tambah Testimoni Baru'}</h1>
            <div className="box">
                <form onSubmit={handleSubmit}>
                    <div className="field">
                        <label className="label">Nama</label>
                        <div className="control">
                            <input className="input" type="text" value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Jabatan (misal: Pecinta Pedas)</label>
                        <div className="control">
                            <input className="input" type="text" value={title} onChange={e => setTitle(e.target.value)} required />
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Kutipan</label>
                        <div className="control">
                            <textarea
                                className="textarea"
                                value={quote}
                                onChange={handleQuoteChange}
                                maxLength="50"
                                required
                            ></textarea>
                        </div>
                        <p className="help has-text-right">{quote.length} / 50</p>
                    </div>

                    <div className="field">
                        <label className="label">Rating (1-5)</label>
                        <div className="control">
                            <input className="input" type="number" value={rating} onChange={e => setRating(e.target.value)} min="1" max="5" required />
                        </div>
                    </div>

                    <div className="field is-grouped mt-5">
                        <div className="control">
                            <button type="submit" className={`button is-link ${isSubmitting ? 'is-loading' : ''}`} disabled={isSubmitting}>
                                Simpan
                            </button>
                        </div>
                        <div className="control">
                            <button type="button" className="button is-link is-light" onClick={() => navigate('/testimoni')}>
                                Batal
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TestimoniForm;