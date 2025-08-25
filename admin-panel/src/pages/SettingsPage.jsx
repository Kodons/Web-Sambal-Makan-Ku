import React, { useState, useEffect } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import toast from 'react-hot-toast';
import * as FaIcons from 'react-icons/fa';
import { fetchWithAuth } from '../utils/api';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const SettingsPage = () => {
    const { mutate } = useSWRConfig();

    const { data: settings, error: settingsError } = useSWR('/api/admin/settings', fetchWithAuth);
    const { data: socialLinks, error: socialError } = useSWR('/api/admin/social-media-links', fetchWithAuth);

    // State untuk Branding
    const [brandName, setBrandName] = useState('');
    const [logoImageUrl, setLogoImageUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [isBrandingSubmitting, setIsBrandingSubmitting] = useState(false);

    // State untuk Sosial Media
    const [platform, setPlatform] = useState('Instagram');
    const [userInput, setUserInput] = useState('');
    const [isSocialSubmitting, setIsSocialSubmitting] = useState(false);

    // --- State untuk QRIS --- // BARU
    const [hasQrisData, setHasQrisData] = useState(false);
    const [selectedQrisFile, setSelectedQrisFile] = useState(null);
    const [qrisPreviewUrl, setQrisPreviewUrl] = useState('');
    const [isQrisSubmitting, setIsQrisSubmitting] = useState(false);

    // Mengisi state dari data API yang sudah ada
    useEffect(() => {
        if (settings) {
            setBrandName(settings.brandName || '');
            setLogoImageUrl(settings.logoImageUrl || '');
            setHasQrisData(!!settings.qrisStaticData);
        }
    }, [settings]);

    // useEffect untuk preview logo
    useEffect(() => {
        if (!selectedFile) {
            setPreviewUrl('');
            return;
        }
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile]);

    // useEffect untuk preview QRIS
    useEffect(() => {
        if (!selectedQrisFile) {
            setQrisPreviewUrl('');
            return;
        }
        const objectUrl = URL.createObjectURL(selectedQrisFile);
        setQrisPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedQrisFile]);


    const handleBrandNameChange = (e) => {
        if (e.target.value.length <= 20) {
            setBrandName(e.target.value);
        }
    };

    const handleSettingsSubmit = async (e) => {
        e.preventDefault();
        setIsBrandingSubmitting(true);
        let finalImageUrl = logoImageUrl;
        const token = localStorage.getItem('authToken');

        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);
            try {
                const uploadRes = await fetch(`${BACKEND_URL}/api/admin/upload`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData,
                });
                const uploadData = await uploadRes.json();
                finalImageUrl = uploadData.filePath;
            } catch (error) {
                toast.error("Gagal mengunggah logo.");
                setIsBrandingSubmitting(false);
                return;
            }
        }

        try {
            await fetchWithAuth('/api/admin/settings', {
                method: 'PUT',
                body: JSON.stringify({ brandName, logoImageUrl: finalImageUrl }),
            });
            toast.success('Pengaturan branding berhasil disimpan!');
            mutate('/api/admin/settings');
        } catch (error) {
            toast.error('Gagal menyimpan pengaturan branding.');
        } finally {
            setIsBrandingSubmitting(false);
        }
    };

    // --- Fungsi submit untuk QRIS ---
    const handleQrisSubmit = async (e) => {
        e.preventDefault();
        if (!selectedQrisFile) {
            toast.error("Silakan pilih file gambar QRIS baru.");
            return;
        }
        setIsQrisSubmitting(true);

        const formData = new FormData();
        formData.append('file', selectedQrisFile);

        try {
            await fetchWithAuth('/api/admin/settings/qris', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': null
                }
            });

            toast.success('Data QRIS berhasil diperbarui!');
            mutate('/api/admin/settings');
            setSelectedQrisFile(null);
        } catch (error) {
            toast.error(error.message || 'Gagal memperbarui data QRIS.');
        } finally {
            setIsQrisSubmitting(false);
        }
    };

    // Fungsi submit untuk sosial media
    const handleSocialSubmit = async (e) => {
        e.preventDefault();
        if (!userInput) {
            toast.error("Input tidak boleh kosong.");
            return;
        }
        setIsSocialSubmitting(true);

        let finalUrl = userInput;
        const platformLower = platform.toLowerCase();
        if (platformLower === 'whatsapp') {
            const phone = userInput.replace(/\D/g, '').replace(/^0/, '62');
            finalUrl = `https://wa.me/${phone}`;
        } else if (platformLower === 'instagram') {
            finalUrl = `https://www.instagram.com/${userInput}`;
        } else if (platformLower === 'facebook') {
            finalUrl = `https://www.facebook.com/${userInput}`;
        } else if (platformLower === 'tiktok') {
            finalUrl = `https://www.tiktok.com/@${userInput}`;
        }

        let iconName = `Fa${platform}`;
        if (platform === 'WhatsApp') iconName = 'FaWhatsapp';
        if (platform === 'TikTok') iconName = 'FaTiktok';
        if (platform === 'Shopee') iconName = 'FaShoppingBag';
        if (platform === 'Lazada') iconName = 'FaShoppingCart';

        try {
            await fetchWithAuth('/api/admin/social-media-links', {
                method: 'POST',
                body: JSON.stringify({ platform, url: finalUrl, iconName }),
            });
            toast.success('Link berhasil disimpan!');
            setUserInput('');
            mutate('/api/admin/social-media-links');
        } catch (error) {
            toast.error('Gagal menyimpan link.');
        } finally {
            setIsSocialSubmitting(false);
        }
    };

    // Fungsi hapus sosial media
    const handleDeleteSocial = async (id) => {
        if (window.confirm('Yakin ingin menghapus link ini?')) {
            await fetchWithAuth(`/api/admin/social-media-links/${id}`, { method: 'DELETE' });
            toast.success('Link berhasil dihapus.');
            mutate('/api/admin/social-media-links');
        }
    };

    if (settingsError || socialError) return <div>Gagal memuat data.</div>
    if (!settings || !socialLinks) return <progress className="progress is-small is-primary" max="100"></progress>;

    return (
        <div>
            <h1 className="title">Pengaturan Website</h1>
            <div className="columns is-multiline">
                {/* Kolom Branding */}
                <div className="column is-half">
                    <div className="box">
                        <h2 className="subtitle">Branding</h2>
                        <form onSubmit={handleSettingsSubmit}>
                            <div className="field">
                                <label className="label">Nama Brand</label>
                                <div className="control">
                                    <input
                                        className="input" type="text" value={brandName}
                                        onChange={handleBrandNameChange} maxLength="20"
                                    />
                                </div>
                                <p className="help has-text-right">{brandName.length} / 20</p>
                            </div>
                            <div className="field">
                                <label className="label">Gambar Logo</label>
                                <div className="mb-4">
                                    <p>Preview:</p>
                                    {previewUrl ? <img src={previewUrl} alt="Preview Logo" width="150" />
                                        : logoImageUrl ? <img src={`${BACKEND_URL}${logoImageUrl}`} alt="Logo saat ini" width="150" />
                                            : <p className="has-text-grey">Tidak ada gambar logo.</p>}
                                </div>
                                <div className="control">
                                    <input className="input" type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} />
                                </div>
                            </div>
                            <button type="submit" className={`button is-info ${isBrandingSubmitting ? 'is-loading' : ''}`} disabled={isBrandingSubmitting}>Simpan Branding</button>
                        </form>
                    </div>
                </div>

                {/* Kolom Sosial Media */}
                <div className="column is-half">
                    <div className="box">
                        <h2 className="subtitle">Link Sosial Media</h2>
                        <form onSubmit={handleSocialSubmit}>
                            <div className="field">
                                <label className="label">Platform</label>
                                <div className="control">
                                    <div className="select is-fullwidth">
                                        <select value={platform} onChange={e => setPlatform(e.target.value)}>
                                            <option>Instagram</option>
                                            <option>WhatsApp</option>
                                            <option>Facebook</option>
                                            <option>TikTok</option>
                                            <option>Youtube</option>
                                            <option>Shopee</option>
                                            <option>Lazada</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Username / Nomor Telepon</label>
                                <div className="control">
                                    <input className="input" type="text" value={userInput} onChange={e => setUserInput(e.target.value)} placeholder="Contoh: sambaljuara atau 0812..." required />
                                </div>
                            </div>
                            <button type="submit" className={`button is-primary ${isSocialSubmitting ? 'is-loading' : ''}`} disabled={isSocialSubmitting}>
                                Simpan Link
                            </button>
                        </form>
                        <hr />
                        {socialLinks.map(link => {
                            const IconComponent = FaIcons[link.iconName];
                            return (
                                <div key={link.id} className="level is-mobile">
                                    <div className="level-left">
                                        <div className="level-item icon-text">
                                            <span className="icon">{IconComponent ? <IconComponent /> : ''}</span>
                                            <span><a href={link.url} target="_blank" rel="noopener noreferrer">{link.platform}</a></span>
                                        </div>
                                    </div>
                                    <div className="level-right">
                                        <button className="button is-danger is-small" onClick={() => handleDeleteSocial(link.id)}>
                                            <span className="icon"><FaIcons.FaTrash /></span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* --- Kolom Pengaturan QRIS (Tampilan Baru) --- */}
                <div className="column is-full">
                    <div className="box">
                        <h2 className="subtitle">Pengaturan Pembayaran (QRIS)</h2>
                        <p className="mb-4">Unggah gambar QRIS statis Anda di sini. Sistem akan secara otomatis membaca dan menyimpan datanya untuk digunakan pada halaman checkout.</p>
                        <form onSubmit={handleQrisSubmit}>
                            <div className="field">
                                <label className="label">Status Saat Ini</label>
                                <div className="mb-4">
                                    {hasQrisData ? (
                                        <span className="tag is-success">Data QRIS Sudah Tersimpan</span>
                                    ) : (
                                        <span className="tag is-warning">Data QRIS Belum Diatur</span>
                                    )}
                                </div>
                            </div>

                            <div className="field">
                                <label className="label">Unggah File QRIS Baru</label>
                                {qrisPreviewUrl && (
                                    <div className="mb-4">
                                        <p>Preview Gambar Baru:</p>
                                        <img src={qrisPreviewUrl} alt="Preview QRIS" style={{ maxWidth: '250px' }} />
                                    </div>
                                )}
                                <div className="control">
                                    <div className="file has-name is-fullwidth">
                                        <label className="file-label">
                                            <input className="file-input" type="file" accept="image/*" onChange={(e) => setSelectedQrisFile(e.target.files[0])} />
                                            <span className="file-cta">
                                                <span className="file-icon"><FaIcons.FaUpload /></span>
                                                <span className="file-label">Pilih file…</span>
                                            </span>
                                            <span className="file-name">
                                                {selectedQrisFile ? selectedQrisFile.name : "Belum ada file dipilih"}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className={`button is-success mt-4 ${isQrisSubmitting ? 'is-loading' : ''}`}
                                disabled={isQrisSubmitting || !selectedQrisFile}
                            >
                                Simpan & Proses QRIS
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;