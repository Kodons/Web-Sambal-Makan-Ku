import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaUserShield, FaUser, FaLock } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // 1. Impor komponen Link

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
            if (!response.ok) throw new Error(data.error || 'Login gagal!');
            
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
        <div className="login-container">
            <div className="login-card">
                <div className="column is-5 login-illustration-section">
                    <FaUserShield size="12em" />
                </div>

                <div className="column is-7 login-form-section">
                    <h1 className="title is-4">Login</h1>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="field">
                            <label className="label">Username</label>
                            <div className="control has-icons-left">
                                <input 
                                    className="input is-medium"
                                    type="text" 
                                    placeholder="Username" 
                                    value={username} 
                                    onChange={e => setUsername(e.target.value)} 
                                    required 
                                />
                                <span className="icon is-small is-left">
                                    <FaUser />
                                </span>
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Password</label>
                            <div className="control has-icons-left">
                                <input 
                                    className="input is-medium"
                                    type="password" 
                                    placeholder="Password" 
                                    value={password} 
                                    onChange={e => setPassword(e.target.value)} 
                                    required 
                                />
                                <span className="icon is-small is-left">
                                    <FaLock />
                                </span>
                            </div>
                        </div>

                        <div className="field mt-5">
                            <button 
                                type="submit" 
                                className={`button is-medium is-fullwidth login-button ${isLoading ? 'is-loading' : ''}`} 
                                disabled={isLoading}
                            >
                                LOGIN
                            </button>
                        </div>
                    </form>
                    
                    <div className="has-text-centered mt-4">
                        <Link to="/forgot-password" className="is-size-5">Lupa password?</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;