import React from 'react';
import { useLocation } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

const TopNavbar = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter(x => x);

    return (
        <nav className="navbar is-white top-navbar">
            <div className="navbar-menu">
                <div className="navbar-start">
                    <div className="navbar-item">
                        <nav className="breadcrumb">
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
                        <a className="navbar-link"><span className="icon"><FaUserCircle /></span><span>Admin</span></a>
                        <div className="navbar-dropdown is-right">
                            <a className="navbar-item">Logout</a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default TopNavbar;