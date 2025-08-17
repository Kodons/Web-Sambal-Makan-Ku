# Aplikasi Full-Stack Sambal Juara

Ini adalah proyek aplikasi web full-stack untuk "Sambal Juara", sebuah brand fiktif produk sambal. Aplikasi ini terdiri dari tiga bagian utama:
1.  **Landing Page:** Halaman publik yang dinamis dan responsif untuk menampilkan produk kepada pelanggan.
2.  **Back-end API:** Server Node.js yang terhubung ke database MySQL untuk menyediakan dan mengelola semua data.
3.  **Admin Panel:** Dasbor internal untuk admin guna mengelola konten website (Produk, Testimoni, Banner) tanpa menyentuh kode.

## ✨ Fitur Utama

### Landing Page
- **Desain Modern & Responsif:** Tampilan yang menyesuaikan di berbagai perangkat, dari desktop hingga mobile.
- **Konten Dinamis:** Semua konten (produk, testimoni, banner) diambil langsung dari database melalui API.
- **Animasi Interaktif:** Menggunakan Framer Motion untuk animasi yang halus dan Swiper.js untuk slider testimoni.
- **Background Video:** Latar belakang video yang menarik di bagian hero.
- **Pop-up Promosi:** Banner pop-up yang kontennya bisa diatur oleh admin.

### Admin Panel
- **Manajemen Konten (CRUD):** Fungsionalitas penuh untuk Create, Read, Update, dan Delete data Produk, Testimoni, dan Banner.
- **Upload Gambar:** Fitur upload gambar yang mudah digunakan dengan preview instan.
- **UI Bersih:** Tampilan dasbor yang rapi dan fungsional menggunakan framework Bulma.
- **Notifikasi Interaktif:** Feedback visual (notifikasi *toast*) untuk setiap aksi yang berhasil atau gagal.

### Back-end
- **REST API:** Dibangun dengan Node.js dan Express.js.
- **ORM Modern:** Menggunakan Prisma untuk interaksi yang aman dan efisien dengan database.
- **Database:** Terhubung dengan MySQL.
- **Upload File:** Menggunakan Multer untuk menangani upload gambar.

## 🛠️ Tumpukan Teknologi (Tech Stack)

- **Front-end (Landing Page & Admin Panel):**
  - [React](https://reactjs.org/)
  - [Vite](https://vitejs.dev/)
  - [Bulma](https://bulma.io/) (Framework CSS)
  - [Swiper.js](https://swiperjs.com/) (Slider)
  - [Framer Motion](https://www.framer.com/motion/) (Animasi)
  - [React Router DOM](https://reactrouter.com/) (Routing Admin Panel)
  - [React Hot Toast](https://react-hot-toast.com/) (Notifikasi)
- **Back-end:**
  - [Node.js](https://nodejs.org/)
  - [Express.js](https://expressjs.com/)
  - [Prisma](https://www.prisma.io/) (ORM)
  - [Multer](https://github.com/expressjs/multer) (File Upload)
  - [CORS](https://www.npmjs.com/package/cors)
- **Database:**
  - [MySQL](https://www.mysql.com/)

## 📂 Struktur Proyek

Proyek ini dibagi menjadi tiga folder utama di dalam satu repository:

```
/
├── admin-panel/      # Proyek React untuk Admin Panel
├── backend-sambal/   # Proyek Node.js untuk Back-end API
└── sambal-react-vite/  # Proyek React untuk Landing Page utama
└── README.md         # File ini
```

## 🚀 Instalasi & Setup

Ikuti langkah-langkah ini untuk menjalankan proyek secara lokal.

### 1. Database
- Buka **phpMyAdmin**.
- Buat database baru dengan nama `sambal_db`.

### 2. Back-end API
- Masuk ke folder `backend-sambal`:
  ```bash
  cd backend-sambal
  ```
- Install semua dependensi:
  ```bash
  npm install
  ```
- Buat file `.env` dan salin dari `.env.example` (jika ada) atau isi dengan format berikut:
  ```env
  DATABASE_URL="mysql://root:@localhost:3306/sambal_db"
  ```
  *(Sesuaikan username, password, dan nama database Anda)*
- Jalankan migrasi Prisma untuk membuat tabel di database, ini akan membuat database otomatis:
  ```bash
  npx prisma migrate dev
  ```
- (Opsional) Isi beberapa data awal menggunakan phpMyAdmin.

### 3. Front-end (Landing Page)
- Buka terminal baru, masuk ke folder `sambal-react-vite`:
  ```bash
  cd frontend
  ```
- Install semua dependensi:
  ```bash
  npm install
  ```
- Buat file `.env` di direktori utama folder ini dan isi dengan alamat back-end:
  ```env
  VITE_BACKEND_URL=http://localhost:3001
  ```

### 4. Front-end (Admin Panel)
- Buka terminal baru, masuk ke folder `admin-panel`:
  ```bash
  cd admin-panel
  ```
- Install semua dependensi:
  ```bash
  npm install
  ```

## ▶️ Menjalankan Aplikasi

Anda perlu menjalankan **tiga server** secara bersamaan di **tiga terminal terpisah**.

1.  **Jalankan Back-end Server:**
    ```bash
    # Di dalam folder backend-sambal
    npm run dev
    # Server akan berjalan di http://localhost:3001
    ```

2.  **Jalankan Landing Page:**
    ```bash
    # Di dalam folder sambal-react-vite
    npm run dev
    # Landing Page akan berjalan di http://localhost:5173
    ```

3.  **Jalankan Admin Panel:**
    ```bash
    # Di dalam folder admin-panel
    npm run dev
    # Admin Panel akan berjalan di http://localhost:5174 (atau port lain)
    ```

Sekarang Anda bisa membuka URL Landing Page dan Admin Panel di browser Anda.

---
