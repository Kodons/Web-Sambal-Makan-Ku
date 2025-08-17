import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminMenu from './AdminMenu';
import { FaUserCircle } from 'react-icons/fa';

const Layout = () => {
    const location = useLocation();
    // Mengambil judul halaman dari path, contoh: /produk -> Produk
    const pageTitle = location.pathname.split('/').filter(x => x)[0] || 'Dashboard';
    const capitalizedTitle = pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1);

    return (
        <div className="columns is-gapless">
            {/* Sidebar Kiri */}
            <aside className="column is-2 is-narrow-mobile sidebar is-hidden-mobile">
                <div className="has-text-centered p-5">
                    <h1 className="title is-4 has-text-white">Sambal Juara</h1>
                </div>
                <AdminMenu />
            </aside>

            {/* Area Konten Utama */}
            <div className="column admin-body">
                {/* Header Konten */}
                <nav className="navbar is-white p-4" style={{ backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)' }}>
                    <div className="navbar-menu">
                        <div className="navbar-start">
                           <h2 className="title is-4">{capitalizedTitle}</h2>
                        </div>
                        <div className="navbar-end">
                            <div className="navbar-item has-dropdown is-hoverable">
                                <a className="navbar-link is-arrowless">
                                    <span className="icon mr-2"><FaUserCircle size="1.5em" /></span>
                                    <span className="has-text-weight-bold">Admin</span>
                                </a>
                                <div className="navbar-dropdown is-right">
                                    <a className="navbar-item">Logout</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Konten Halaman */}
                <main className="section">
                    <div className="container is-fluid">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;