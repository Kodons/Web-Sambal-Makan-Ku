import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaBox, FaComment, FaImage, FaCog } from 'react-icons/fa';

const AdminMenu = () => (
    <aside className="menu p-4">
        <p className="menu-label">Manajemen</p>
        <ul className="menu-list">
            <li>
                <NavLink to="/produk">
                    <span className="icon-text">
                        <span className="icon"><FaBox /></span>
                        <span>Produk</span>
                    </span>
                </NavLink>
            </li>
            <li>
                <NavLink to="/testimoni">
                    <span className="icon-text">
                        <span className="icon"><FaComment /></span>
                        <span>Testimoni</span>
                    </span>
                </NavLink>
            </li>
            <li>
                <NavLink to="/banners">
                    <span className="icon-text">
                        <span className="icon"><FaImage /></span>
                        <span>Banner</span>
                    </span>
                </NavLink>
            </li>
            <li>
                <NavLink to="/pengaturan">
                    <span className="icon-text">
                        <span className="icon"><FaCog /></span>
                        <span>Pengaturan</span>
                    </span>
                </NavLink>
            </li>
        </ul>
    </aside>
);

export default AdminMenu;