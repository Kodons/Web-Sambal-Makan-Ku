import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminMenu from './AdminMenu';
import TopNavbar from './TopNavbar';

const Layout = () => {
    const [isMobileMenuActive, setIsMobileMenuActive] = useState(false);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <TopNavbar
                isMobileMenuActive={isMobileMenuActive}
                onBurgerClick={() => setIsMobileMenuActive(!isMobileMenuActive)}
            />

            {/* Menu mobile yang akan muncul/hilang */}
            {isMobileMenuActive && (
                <div className="is-hidden-desktop">
                    <AdminMenu />
                </div>
            )}

            <div className="columns is-gapless" style={{ flexGrow: 1 }}>
                {/* Sidebar untuk Desktop */}
                <div className="column is-2 is-hidden-touch">
                    <AdminMenu />
                </div>

                {/* Area Konten Utama */}
                <main className="column admin-body">
                    <section className="section">
                        <Outlet />
                    </section>
                </main>
            </div>
        </div>
    );
};

export default Layout;