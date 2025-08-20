# Sambal Teman Makan Ku: Aplikasi Web Full-Stack Produk Sambal

Selamat datang di repositori "Sambal Teman Makan Ku"! Ini adalah proyek aplikasi web full-stack yang dirancang untuk brand produk sambal khas Lombok. Aplikasi ini terdiri dari tiga bagian utama yang bekerja secara terpisah namun terintegrasi: sebuah **Landing Page**, **Back-end API**, dan **Admin Panel**.

---

### ✨ Fitur Utama

#### Landing Page
- **Desain Modern & Responsif**: Tampilan yang menyesuaikan di berbagai perangkat, dari desktop hingga mobile.
- **Konten Dinamis**: Semua konten (produk, testimoni, banner, logo, link sosmed) diambil langsung dari database melalui API.
- **Animasi Interaktif**: Menggunakan Framer Motion untuk animasi yang halus dan Swiper.js untuk slider testimoni.
- **Pop-up Promosi**: Banner promosi yang kontennya bisa diatur oleh admin.

#### Admin Panel
- **Otentikasi Aman**: Sistem login berbasis JWT (JSON Web Token) untuk melindungi semua halaman admin.
- **Manajemen Konten (CRUD)**: Fungsionalitas penuh untuk Create, Read, Update, dan Delete data.
- **Pengelolaan Dinamis**: Mengelola Produk, Testimoni, Banner Promosi, dan Pengaturan Website.
- **Upload Gambar**: Fitur upload gambar yang mudah digunakan dengan *preview* instan.

#### Back-end API
- **REST API**: Dibangun dengan Node.js dan Express.js, dengan pemisahan rute publik dan rute admin yang aman.
- **ORM Modern**: Menggunakan Prisma untuk interaksi yang aman dan efisien dengan database.
- **Database**: Terhubung dengan MySQL.
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

#### Database
- MySQL

---

### 📂 Struktur Proyek

Proyek ini dibagi menjadi tiga folder utama:

/
├── admin-panel/        # Proyek React untuk Admin Panel
├── backend-sambal/     # Proyek Node.js untuk Back-end API
└── sambal-react-vite/  # Proyek React untuk Landing Page utama


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
    DATABASE_URL="mysql://root:@localhost:3306/sambal_db"
    JWT_SECRET="ganti_dengan_kunci_rahasia_acak_yang_sangat_panjang"
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
    }
    ```
    Setelah *request* berhasil, Anda bisa *login* ke Admin Panel di `http://localhost:5174` menggunakan kredensial tersebut.

---

### 📄 Lisensi

Proyek ini dilisensikan di bawah **Lisensi MIT**.
