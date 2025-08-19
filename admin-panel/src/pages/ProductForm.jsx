import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const BACKEND_URL = 'http://localhost:3001';

const ProductForm = () => {
    const [name, setName] = useState('');
    const [level, setLevel] = useState(0);
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [harga, setHarga] = useState(0);
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = id !== undefined;

    useEffect(() => {
        if (isEditing) {
            fetch(`${BACKEND_URL}/api/produk/${id}`)
                .then(res => res.json())
                .then(data => {
                    setName(data.name);
                    setLevel(data.level);
                    setDescription(data.description);
                    setImageUrl(data.imageUrl);
                    setHarga(data.harga);
                });
        }
    }, [id, isEditing]);

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
                if (!uploadRes.ok) throw new Error('Upload failed');
                const uploadData = await uploadRes.json();
                finalImageUrl = uploadData.filePath;
            } catch (error) {
                toast.error("Gagal mengunggah gambar.");
                setIsSubmitting(false);
                return;
            }
        }
        const productData = { name, level: parseInt(level), description, imageUrl: finalImageUrl, harga: parseInt(harga) };
        const url = isEditing ? `${BACKEND_URL}/api/produk/${id}` : `${BACKEND_URL}/api/produk`;
        const method = isEditing ? 'PUT' : 'POST';
        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });
            if (!response.ok) throw new Error('Submit failed');
            toast.success(`Produk berhasil ${isEditing ? 'diperbarui' : 'dibuat'}!`);
            navigate('/produk');
        } catch (error) {
            toast.error("Terjadi kesalahan saat menyimpan data produk.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDescriptionChange = (e) => {
        if (e.target.value.length <= 100) {
            setDescription(e.target.value);
        }
    };

    return (
        <div>
            <h1 className="title">{isEditing ? 'Edit Produk' : 'Tambah Produk Baru'}</h1>
            <div className="box">
                <form onSubmit={handleSubmit}>
                     <div className="field">
                        <label className="label">Nama Produk</label>
                        <div className="control">
                           <input className="input" type="text" value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                     </div>
                     <div className="field">
                        <label className="label">Level Pedas</label>
                        <div className="control">
                            <input 
                                className="input" 
                                type="number" 
                                value={level} 
                                onChange={e => setLevel(e.target.value)} 
                                min="1" 
                                max="5" 
                                required 
                            />
                        </div>
                     </div>
                     <div className="field">
                        <label className="label">Deskripsi</label>
                        <div className="control">
                           <textarea 
                                className="textarea" 
                                value={description} 
                                onChange={handleDescriptionChange} 
                                maxLength="100"
                                required
                            ></textarea>
                            <p className="help has-text-right">{description.length} / 100</p>
                        </div>
                     </div>

                      <div className="field">
                        <label className="label">Harga (Rupiah)</label>
                        <div className="control">
                            <input className="input" type="number" placeholder="Contoh: 25000" value={harga} onChange={e => setHarga(e.target.value)} required />
                        </div>
                    </div>
                    
                    <div className="field">
                        <label className="label">Gambar Produk</label>
                        
                        <div className="mb-4">
                            <p>Preview:</p>
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" width="200" />
                            ) : isEditing && imageUrl ? (
                                <img src={`${BACKEND_URL}${imageUrl}`} alt="Gambar saat ini" width="200" />
                            ) : (
                                <p className="has-text-grey">Tidak ada gambar yang dipilih.</p>
                            )}
                        </div>
                        
                        <div className="control">
                            <input className="input" type="file" onChange={handleFileChange} />
                        </div>
                        <p className="help">{isEditing ? 'Pilih file baru untuk mengganti gambar di atas.' : 'Pilih file untuk diunggah.'}</p>
                    </div>

                    <div className="field is-grouped mt-5">
                       <div className="control">
                           <button type="submit" className={`button is-link ${isSubmitting ? 'is-loading' : ''}`} disabled={isSubmitting}>
                               Simpan
                           </button>
                       </div>
                       <div className="control">
                           <button type="button" className="button is-link is-light" onClick={() => navigate('/produk')}>
                               Batal
                           </button>
                       </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;