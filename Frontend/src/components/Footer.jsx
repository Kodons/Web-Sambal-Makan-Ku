import React from 'react';
import { FaFire, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    // PERUBAHAN: Tambahkan kelas padding 'pt-6'
    <footer className="footer has-background-dark has-text-light pt-6">
      <div className="container">
        <div className="columns">

          {/* Kolom 1: Tentang Brand & Sosial Media */}
          <div className="column is-4">
            <div className="mb-4">
                <a href="#" className="is-flex is-align-items-center">
                    <span className="icon is-medium has-text-danger mr-2">
                        <FaFire size="1.5em"/>
                    </span>
                    <span className="has-text-weight-bold is-size-4 has-text-white">Sambal Teman Ku</span>
                </a>
            </div>
            <p className="is-size-6 has-text-grey-light">
                Sambal rumahan dengan resep warisan, dibuat dari bahan-bahan segar pilihan untuk ledakan rasa di setiap cocolan.
            </p>
            <div className="mt-5">
                <a href="#" aria-label="Instagram" className="icon is-medium mr-3"><FaInstagram size="1.5em"/></a>
                <a href="#" aria-label="WhatsApp" className="icon is-medium"><FaWhatsapp size="1.5em"/></a>
            </div>
          </div>

          {/* Kolom 2: Link Navigasi Cepat */}
          <div className="column is-2">
            <h6 className="title is-5 has-text-white">Navigasi</h6>
            <ul>
              <li><a href="#produk">Produk</a></li>
              <li><a href="#tentang">Keunggulan</a></li>
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

        {/* PERUBAHAN: <hr /> dihapus dan div baru untuk copyright */}
        <div className="content has-text-centered pt-6 pb-2">
            <p className="is-size-7 has-text-grey-light">
                &copy; {year} <strong>Sambal Teman Ku</strong>. All Rights Reserved.
            </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;