import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminMenu from './AdminMenu';
import TopNavbar from './TopNavbar';

const Layout = () => (
  <div className="columns is-gapless">
    <aside className="column is-2 is-narrow-mobile sidebar is-hidden-mobile">
      <div className="has-text-centered p-4">
        <h1 className="title is-4 has-text-white">Sambal Juara</h1>
      </div>
      <AdminMenu />
    </aside>
    <div className="column admin-body">
      <TopNavbar />
      <main className="section">
        <div className="container is-fluid">
          <Outlet />
        </div>
      </main>
    </div>
  </div>
);

export default Layout;