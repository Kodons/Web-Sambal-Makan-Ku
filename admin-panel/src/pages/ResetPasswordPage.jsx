import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return toast.error("Password tidak cocok!");
        }
        if (password.length < 6) {
            return toast.error("Password minimal harus 6 karakter.");
        }
        setIsLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reset-password/${token}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            
            toast.success("Password berhasil direset! Silakan login.");
            navigate('/login');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="hero is-fullheight" style={{backgroundColor: '#f5f7fa'}}>
            <div className="hero-body">
                <div className="container has-text-centered">
                    <div className="column is-4 is-offset-4">
                        <h3 className="title has-text-black">Reset Password</h3>
                        <div className="box">
                            <form onSubmit={handleSubmit}>
                                <div className="field">
                                    <label className="label">Password Baru</label>
                                    <input className="input is-large" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                                </div>
                                <div className="field">
                                    <label className="label">Konfirmasi Password Baru</label>
                                    <input className="input is-large" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                                </div>
                                <button type="submit" className={`button is-block is-info is-large is-fullwidth ${isLoading ? 'is-loading' : ''}`} disabled={isLoading}>
                                    Reset Password
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
export default ResetPasswordPage;