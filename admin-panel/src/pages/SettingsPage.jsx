import React, { useState, useEffect } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import toast from 'react-hot-toast';
import * as FaIcons from 'react-icons/fa';
import { fetchWithAuth } from '../utils/api'; // Pastikan helper diimpor

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const SettingsPage = () => {
    const { mutate } = useSWRConfig();
    
    // PERUBAHAN: Ganti URL ke endpoint admin
    const { data: settings, error: settingsError } = useSWR('/api/admin/settings', fetchWithAuth);
    const { data: socialLinks, error: socialError } = useSWR('/api/admin/social-media-links', fetchWithAuth);

    const [brandName, setBrandName] = useState('');
    const [logoImageUrl, setLogoImageUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [isBrandingSubmitting, setIsBrandingSubmitting] = useState(false);
    
    const [platform, setPlatform] = useState('Instagram');
    const [userInput, setUserInput] = useState('');
    const [isSocialSubmitting, setIsSocialSubmitting] = useState(false);

    useEffect(() => {
        if (settings) {
            setBrandName(settings.brandName || '');
            setLogoImageUrl(settings.logoImageUrl || '');
        }
    }, [settings]);
    
    useEffect(() => {
        if (!selectedFile) {
            setPreviewUrl('');
            return;
        }
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile]);

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
            // PERUBAHAN: Ganti URL ke endpoint admin
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


    const handleSocialSubmit = async (e) => {
        e.preventDefault();
        if (!userInput) {
            toast.error("Input tidak boleh kosong.");
            return;
        }
        setIsSocialSubmitting(true);

        // Logika untuk membangun URL lengkap dari input user
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
            // PERUBAHAN: Ganti URL ke endpoint admin
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

    const handleDeleteSocial = async (id) => {
        if (window.confirm('Yakin ingin menghapus link ini?')) {
            // PERUBAHAN: Ganti URL ke endpoint admin
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
            <div className="columns">
                <div className="column is-half">
                    <div className="box">
                        <h2 className="subtitle">Branding</h2>
                        <form onSubmit={handleSettingsSubmit}>
                            <div className="field">
                                <label className="label">Nama Brand</label>
                                <div className="control">
                                    <input className="input" type="text" value={brandName} onChange={e => setBrandName(e.target.value)} />
                                </div>
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
                                    <input className="input" type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
                                </div>
                            </div>
                            <button type="submit" className={`button is-info ${isBrandingSubmitting ? 'is-loading' : ''}`} disabled={isBrandingSubmitting}>Simpan Branding</button>
                        </form>
                    </div>
                </div>
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
            </div>
        </div>
    );
};

export default SettingsPage;