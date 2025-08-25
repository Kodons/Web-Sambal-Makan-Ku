# Sambal Teman Makan Ku: Aplikasi Web Full-Stack Produk Sambal

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Bulma](https://img.shields.io/badge/Bulma-00D1B2?style=flat-square&logo=bulma&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=flat-square&logo=Prisma&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=flat-square&logo=vite&logoColor=FFD62E)

Selamat datang di repositori "Sambal Teman Makan Ku"! Ini adalah proyek aplikasi web full-stack yang dirancang untuk brand produk sambal khas Lombok. Aplikasi ini terdiri dari tiga bagian utama yang bekerja secara terpisah namun terintegrasi: sebuah **Landing Page**, **Back-end API**, dan **Admin Panel**.

---

### ✨ Fitur Utama

#### Landing Page
- **Desain Modern & Responsif**: Tampilan yang menyesuaikan di berbagai perangkat, dari desktop hingga mobile.
- **Konten Dinamis**: Semua konten (produk, testimoni, banner, logo, link sosmed) diambil langsung dari database melalui API.
- **Animasi Interaktif**: Menggunakan Framer Motion untuk animasi yang halus dan Swiper.js untuk slider testimoni.
- **Sistem Keranjang Belanja: Pelanggan dapat menambahkan produk ke keranjang yang persisten
- **Sistem Checkout Otomatis: Alur checkout multi-langkah
- **Pembayaran QRIS Dinamis: QRIS dinamis dengan nominal terisi otomatis
- **Pelacakan Pesanan: Halaman khusus untuk melacak status pesanan
- **Pop-up Promosi**: Banner promosi yang kontennya bisa diatur oleh admin.

#### Admin Panel
- **Otentikasi Aman**: Sistem login berbasis JWT (JSON Web Token) untuk melindungi semua halaman admin.
- **Keamanan:** Halaman admin diproteksi dengan sistem login berbasis JWT (JSON Web Token) dan memiliki fitur "Lupa Password" via email.
- **Manajemen Konten (CRUD)**: Fungsionalitas penuh untuk Create, Read, Update, dan Delete data.
- **Manajemen Pesanan: Melihat, mencari, menyetujui, atau membatalkan pesanan
- **Pengaturan Pembayaran: Unggah gambar QRIS statis untuk sistem pembayaran dinamis
- **Pengelolaan Dinamis**: Mengelola Produk, Testimoni, Banner Promosi, dan Pengaturan Website.
- **Upload Gambar**: Fitur upload gambar yang mudah digunakan dengan *preview* instan.

#### Back-end API
- **REST API**: Dibangun dengan Node.js dan Express.js, dengan pemisahan rute publik dan rute admin yang aman.
- **ORM Modern**: Menggunakan Prisma untuk interaksi yang aman dan efisien dengan database.
- **Database**: Terhubung dengan MySQL.
- **Optimasi Gambar: Mengompresi dan mengubah format gambar menjadi .webp
- **Keamanan**: Menggunakan `bcryptjs` dan `jsonwebtoken`.

---

### 🛠️ Tumpukan Teknologi (Tech Stack)

#### Front-end
- React
- Vite
- Bulma (Framework CSS)
- Swiper.js
- Framer Motion
- React Router DOM
- React Hot Toast
- SWR

#### Back-end
- Node.js
- Express.js
- Prisma
- Multer
- bcryptjs & jsonwebtoken
- Nodemailer
- CORS

#### Database
- MySQL

---

### 📂 Struktur Proyek

Proyek ini dibagi menjadi tiga folder utama:
```
├── admin-panel/ # Proyek React untuk Admin Panel
├── backend/     # Proyek Node.js untuk Back-end API
└── frontend/    # Proyek React untuk Landing Page utama
```

---

### 🚀 Instalasi & Setup

Ikuti langkah-langkah ini secara berurutan untuk menjalankan proyek secara lokal.

1.  **Clone Repository**
    ```bash
    git clone [https://github.com/USERNAME/NAMA_REPO.git](https://github.com/USERNAME/NAMA_REPO.git)
    cd NAMA_REPO
    ```

2.  **Setup Database**
    Buka phpMyAdmin atau *database client* lainnya dan buat database baru bernama `sambal_db`.

3.  **Konfigurasi Back-end API**
    Buka Terminal Pertama, masuk ke folder `backend`, dan ikuti langkah berikut:
    ```bash
    cd backend
    npm install
    ```
    Buat file `.env` dan isi dengan format di bawah. Sesuaikan `DATABASE_URL` dan `JWT_SECRET` Anda. Kode JWT ketik manual bebas terserah.
    ```dotenv
    # backend/.env
    # Konfigurasi Database
    DATABASE_URL="mysql://root:@localhost:3306/sambal_db"

    # Kunci Rahasia untuk JWT (Generate sendiri)
    JWT_SECRET="ganti_dengan_kunci_rahasia_acak_yang_sangat_panjang"

    # Konfigurasi Pengiriman Email (Contoh menggunakan Brevo)
    EMAIL_HOST="smtp-relay.brevo.com"
    EMAIL_USER="login_smtp_dari_brevo@smtp-brevo.com"
    BREVO_API_KEY="kunci_api_panjang_anda_dari_brevo"
    SENDER_EMAIL="email_anda_yang_sudah_diverifikasi@gmail.com"
    ```
    Jalankan migrasi Prisma untuk membuat semua tabel:
    ```bash
    npx prisma migrate dev
    ```

4.  **Konfigurasi Front-end (Landing Page)**
    Buka Terminal Kedua, masuk ke folder `frontend`, dan ikuti langkah berikut:
    ```bash
    cd frontend
    npm install
    ```
    Buat file `.env` dan isi dengan:
    ```dotenv
    # frontend/.env
    VITE_BACKEND_URL=http://localhost:3001
    ```

5.  **Konfigurasi Front-end (Admin Panel)**
    Buka Terminal Ketiga, masuk ke folder `admin-panel`, dan ikuti langkah berikut:
    ```bash
    cd admin-panel
    npm install
    ```
    Buat file `.env` dan isi dengan:
    ```dotenv
    # admin-panel/.env
    VITE_BACKEND_URL=http://localhost:3001
    ```

---

### ▶️ Menjalankan Aplikasi & Setup Admin

1.  **Jalankan Semua Server**
    Jalankan setiap bagian di terminal yang berbeda.
    ```bash
    # Terminal 1 (Back-end)
    cd backend && npm run dev
    # Server API akan berjalan di http://localhost:3001

    # Terminal 2 (Landing Page)
    cd frontend && npm run dev
    # Landing Page akan berjalan di http://localhost:5173

    # Terminal 3 (Admin Panel)
    cd admin-panel && npm run dev
    # Admin Panel akan berjalan di http://localhost:5174
    ```

2.  **Membuat Akun Admin Pertama**
    Setelah *back-end* berjalan, buat akun admin pertama Anda menggunakan aplikasi *API client* (seperti Postman atau Insomnia) dengan mengirim *request* `POST` ke `http://localhost:3001/api/register` dengan *body* JSON berikut:
    ```json
    {
        "username": "admin",
        "password": "password_aman_anda"
        "email": "email_valid_anda@gmail.com"
    }
    ```
    Penting: Pastikan Anda mengisi email agar fitur "Lupa Password" berfungsi untuk akun ini.
    
    Setelah *request* berhasil, Anda bisa *login* ke Admin Panel di `http://localhost:5174` menggunakan kredensial tersebut.

---

### 📄 Lisensi

Proyek ini dilisensikan di bawah **Lisensi MIT**.
