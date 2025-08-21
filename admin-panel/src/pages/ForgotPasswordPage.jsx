import React, { useState } from 'react';
import toast from 'react-hot-toast';

const ForgotPasswordPage = () => {
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Terjadi kesalahan');
            
            setMessage(data.message);
            toast.success("Permintaan terkirim!");
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
                        <h3 className="title has-text-black">Lupa Password</h3>
                        <div className="box">
                            {!message ? (
                                <form onSubmit={handleSubmit}>
                                    <p className="mb-4">Masukkan username Anda. Kami akan mengirimkan link reset ke email terdaftar.</p>
                                    <div className="field">
                                        <div className="control">
                                            <input className="input is-large" type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
                                        </div>
                                    </div>
                                    <button type="submit" className={`button is-block is-info is-large is-fullwidth ${isLoading ? 'is-loading' : ''}`} disabled={isLoading}>
                                        Kirim Link Reset
                                    </button>
                                </form>
                            ) : (
                                <p className="has-text-success">{message}</p>
                            )}
                            <div className="has-text-centered mt-4">
                                <a href="/login" className="is-size-7">Kembali ke Login</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
export default ForgotPasswordPage;