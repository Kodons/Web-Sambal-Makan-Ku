import React from 'react';
import useSWR from 'swr';
import * as FaIcons from 'react-icons/fa';

const fetcher = (url) => fetch(url).then((res) => res.json());

const Footer = () => {
  const year = new Date().getFullYear();

  // Ambil data link sosial media dari API back-end
  const { data: socialLinks = [] } = useSWR(
    `${import.meta.env.VITE_BACKEND_URL}/api/social-media-links`,
    fetcher
  );
  
  // Ambil data pengaturan (untuk nama brand) dari API
  const { data: settings } = useSWR(
    `${import.meta.env.VITE_BACKEND_URL}/api/settings`,
    fetcher
  );

  return (
    <footer className="footer has-background-dark has-text-light pt-6">
      <div className="container">
        <div className="columns">

          {/* Kolom 1: Tentang Brand & Sosial Media */}
          <div className="column is-4">
           <div className="mb-4">
                <a href="#" className="is-flex is-align-items-center">
                    <span className="icon is-medium has-text-danger mr-2">
                        <FaIcons.FaFire size="1.5em"/>
                    </span>
                    <span className="has-text-weight-bold is-size-4 has-text-white">
                        {settings ? settings.brandName : 'Sambal Teman Makan Ku'}
                    </span>
                </a>
            </div>
            <p className="is-size-6 has-text-grey-light">
                Sambal rumahan dengan resep warisan, dibuat dari bahan-bahan segar pilihan untuk ledakan rasa di setiap cocolan.
            </p>
            <div className="mt-5">
                {socialLinks.map(link => {
                    const IconComponent = FaIcons[link.iconName];
                    return (
                        <a 
                            key={link.id} 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            aria-label={link.platform} 
                            className="icon is-medium mr-3"
                        >
                            {/* Render komponen ikon jika ditemukan */}
                            {IconComponent ? <IconComponent size="1.5em" /> : null}
                        </a>
                    );
                })}
            </div>
          </div>

          {/* Kolom 2: Link Navigasi Cepat */}
          <div className="column is-2">
            <h6 className="title is-5 has-text-white">Navigasi</h6>
            <ul>
              <li><a href="#tentang">Tentang Kami</a></li>
              <li><a href="#produk">Produk</a></li>
              <li><a href="#testimoni">Testimoni</a></li>
              <li><a href="#kontak">Kontak</a></li>
            </ul>
          </div>

          {/* Kolom 3: Langganan Promo */}
          <div className="column is-5 is-offset-1">
            <h6 className="title is-5 has-text-white">Langganan Info Promo</h6>
            <p className="has-text-grey-light mb-4">Dapatkan info diskon dan produk terbaru langsung di email Anda.</p>
            <div className="field has-addons">
              <div className="control is-expanded">
                <input className="input is-medium" type="email" placeholder="Email Anda" />
              </div>
              <div className="control">
                <a className="button is-danger is-medium has-text-weight-bold">
                  Langganan
                </a>
              </div>
            </div>
          </div>
        </div>

       <div className="content has-text-centered pt-6 pb-2">
            <p className="is-size-7 has-text-grey-light">
                {/* PERUBAHAN: Tampilkan nama brand dari API */}
                &copy; {year} <strong>{settings ? settings.brandName : 'Sambal Juara'}</strong>. All Rights Reserved.
            </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;