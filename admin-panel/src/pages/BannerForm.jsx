import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const BACKEND_URL = 'http://localhost:3001';

const BannerForm = () => {
    const [imageUrl, setImageUrl] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // PERUBAHAN 1: Tambahkan state untuk URL preview
    const [previewUrl, setPreviewUrl] = useState('');

    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = id !== undefined;

    useEffect(() => {
        if (isEditing) {
            fetch(`${BACKEND_URL}/api/popup-banners/${id}`)
                .then(res => res.json())
                .then(data => {
                    setImageUrl(data.imageUrl);
                    setIsActive(data.isActive);
                });
        }
    }, [id, isEditing]);

    // PERUBAHAN 2: Tambahkan useEffect untuk membuat & membersihkan URL preview
    useEffect(() => {
        if (!selectedFile) {
            setPreviewUrl('');
            return;
        }
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreviewUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile]);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        let finalImageUrl = imageUrl;

        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);
            try {
                const uploadRes = await fetch(`${BACKEND_URL}/api/upload`, {
                    method: 'POST',
                    body: formData,
                });
                const uploadData = await uploadRes.json();
                finalImageUrl = uploadData.filePath;
            } catch (error) {
                toast.error("Gagal mengunggah gambar.");
                setIsSubmitting(false);
                return;
            }
        }

        const bannerData = { imageUrl: finalImageUrl, isActive };
        const url = isEditing ? `${BACKEND_URL}/api/popup-banners/${id}` : `${BACKEND_URL}/api/popup-banners`;
        const method = isEditing ? 'PUT' : 'POST';

        try {
            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bannerData),
            });
            toast.success(`Banner berhasil ${isEditing ? 'diperbarui' : 'dibuat'}!`);
            navigate('/banners');
        } catch (error) {
            toast.error("Terjadi kesalahan saat menyimpan banner.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h1 className="title">{isEditing ? 'Edit Banner' : 'Tambah Banner Baru'}</h1>
            <div className="box">
                <form onSubmit={handleSubmit}>
                    <div className="field">
                        <label className="label">Gambar Banner</label>
                        
                        {/* PERUBAHAN 3: Logika untuk menampilkan preview */}
                        <div className="mb-4">
                            <p>Preview:</p>
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview Banner Baru" width="200" />
                            ) : isEditing && imageUrl ? (
                                <img src={`${BACKEND_URL}${imageUrl}`} alt="Banner saat ini" width="200" />
                            ) : (
                                <p className="has-text-grey">Tidak ada gambar yang dipilih.</p>
                            )}
                        </div>

                        <div className="control">
                            <input className="input" type="file" onChange={handleFileChange} />
                        </div>
                        <p className="help">{isEditing ? 'Pilih file baru untuk mengganti gambar di atas.' : 'Pilih file untuk diunggah.'}</p>
                    </div>
                    <div className="field">
                        <div className="control">
                            <label className="checkbox">
                                <input className="mr-2" type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
                                Aktifkan Banner Ini? (Banner lain akan dinonaktifkan otomatis)
                            </label>
                        </div>
                    </div>
                    <div className="field is-grouped mt-5">
                        <div className="control">
                            <button type="submit" className={`button is-link ${isSubmitting ? 'is-loading' : ''}`} disabled={isSubmitting}>
                                Simpan
                            </button>
                        </div>
                        <div className="control">
                            <button type="button" className="button is-link is-light" onClick={() => navigate('/banners')}>
                                Batal
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BannerForm;