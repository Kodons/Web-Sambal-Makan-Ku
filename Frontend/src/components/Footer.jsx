import React from 'react';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    // PERUBAHAN: Hapus kelas 'has-background-dark' dan 'has-text-light'
    // Tambahkan kelas 'py-4' untuk mengurangi padding vertikal
    <footer className="footer py-4">
      <div className="content has-text-centered">
        <p className="is-size-6">
          &copy; {year} <strong>Sambal Jawara</strong>. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;