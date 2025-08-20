import React, { useState } from 'react';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login gagal!');
            }
            
            localStorage.setItem('authToken', data.token);
            window.location.href = '/produk';
            toast.success('Login berhasil!');

        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="hero is-fullheight" style={{backgroundColor: '#1ececeff'}}>
            <div className="hero-body">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-4">
                            <div className="box">
                                <h1 className="title has-text-centered">Admin Login</h1>
                                <form onSubmit={handleSubmit}>
                                    <div className="field">
                                        <label className="label">Username</label>
                                        <div className="control">
                                            <input className="input" type="text" value={username} onChange={e => setUsername(e.target.value)} required />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label className="label">Password</label>
                                        <div className="control">
                                            <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <button type="submit" className={`button is-primary is-fullwidth ${isLoading ? 'is-loading' : ''}`} disabled={isLoading}>
                                            Login
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LoginPage;