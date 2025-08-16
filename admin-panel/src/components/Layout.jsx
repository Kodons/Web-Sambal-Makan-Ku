import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { FaBox, FaComment, FaImage, FaUserCircle } from 'react-icons/fa';

// Komponen Menu Samping (Sidebar)
const AdminMenu = () => (
    <aside className="menu p-4">
        <p className="menu-label">Manajemen</p>
        <ul className="menu-list">
            <li><NavLink to="/produk"><span className="icon-text"><span className="icon"><FaBox /></span><span>Produk</span></span></NavLink></li>
            <li><NavLink to="/testimoni"><span className="icon-text"><span className="icon"><FaComment /></span><span>Testimoni</span></span></NavLink></li>
            <li><NavLink to="/banners"><span className="icon-text"><span className="icon"><FaImage /></span><span>Banner</span></span></NavLink></li>
        </ul>
    </aside>
);

// Komponen Header Atas (Navbar)
const TopNavbar = ({ onBurgerClick }) => {
    const location = useLocation();
    // Membuat breadcrumbs dari path URL
    const pathnames = location.pathname.split('/').filter((x) => x);
    
    return (
        <nav className="navbar is-white top-navbar" role="navigation">
            <div className="navbar-brand">
                <a role="button" className="navbar-burger" aria-label="menu" onClick={onBurgerClick}>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>
            <div className="navbar-menu">
                <div className="navbar-start">
                    <div className="navbar-item">
                        {/* Breadcrumbs */}
                        <nav className="breadcrumb" aria-label="breadcrumbs">
                            <ul>
                                <li><a href="/produk">Home</a></li>
                                {pathnames.map((name, index) => (
                                    <li key={name} className={index === pathnames.length - 1 ? "is-active" : ""}>
                                        <a>{name.charAt(0).toUpperCase() + name.slice(1)}</a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
                <div className="navbar-end">
                    <div className="navbar-item has-dropdown is-hoverable">
                        <a className="navbar-link">
                            <span className="icon"><FaUserCircle /></span>
                            <span>Admin</span>
                        </a>
                        <div className="navbar-dropdown is-right">
                            <a className="navbar-item">Profil</a>
                            <a className="navbar-item">Logout</a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};


const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="columns is-gapless">
            {/* Sidebar untuk Desktop */}
            <aside className={`column is-2 is-narrow-mobile sidebar is-hidden-mobile ${isSidebarOpen ? '' : 'is-hidden'}`}>
                <div className="has-text-centered p-4">
                    <h1 className="title is-4 has-text-white">Sambal Juara</h1>
                </div>
                <AdminMenu />
            </aside>

            {/* Area Konten Utama */}
            <div className="column admin-body">
                <TopNavbar onBurgerClick={() => setIsSidebarOpen(!isSidebarOpen)} />
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