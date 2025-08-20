Aplikasi Full-Stack Sambal  Teman Makan Ku
Ini adalah proyek aplikasi web full-stack untuk "Sambal Teman Makan Ku", sebuah brand lokal produk sambal. Aplikasi ini terdiri dari tiga bagian utama yang bekerja secara terpisah:

Landing Page: Halaman publik yang dinamis dan responsif untuk menampilkan produk kepada pelanggan.

Back-end API: Server Node.js yang terhubung ke database MySQL untuk menyediakan dan mengelola semua data.

Admin Panel: Dasbor internal yang aman untuk admin guna mengelola konten website (Produk, Testimoni, Banner, Pengaturan) tanpa menyentuh kode.

✨ Fitur Utama
Landing Page
Desain Modern & Responsif: Tampilan yang menyesuaikan di berbagai perangkat, dari desktop hingga mobile.

Konten Dinamis: Semua konten (produk, testimoni, banner, logo, link sosmed) diambil langsung dari database melalui API.

Animasi Interaktif: Menggunakan Framer Motion untuk animasi yang halus dan Swiper.js untuk slider testimoni.

Background Video: Latar belakang video yang menarik di bagian hero.

Pop-up Promosi: Banner pop-up yang kontennya bisa diatur oleh admin.

Admin Panel
Otentikasi Aman: Sistem login berbasis JWT (JSON Web Token) untuk melindungi semua halaman admin.

Manajemen Konten (CRUD): Fungsionalitas penuh untuk Create, Read, Update, dan Delete data.

Pengelolaan Dinamis:

Produk: Mengatur nama, gambar, deskripsi, harga, dan level pedas.

Testimoni: Menambah, mengubah, dan menghapus ulasan pelanggan.

Banner Promosi: Mengontrol gambar pop-up yang tampil di landing page.

Pengaturan Website: Mengubah nama brand, logo, dan menambah/menghapus link sosial media secara dinamis.

Upload Gambar: Fitur upload gambar yang mudah digunakan dengan preview instan.

UI Bersih & Interaktif: Tampilan dasbor yang rapi menggunakan Bulma, dengan notifikasi toast dan loading indicator.

Back-end
REST API: Dibangun dengan Node.js dan Express.js, dengan pemisahan rute publik dan rute admin yang aman.

ORM Modern: Menggunakan Prisma untuk interaksi yang aman dan efisien dengan database.

Database: Terhubung dengan MySQL.

Upload File: Menggunakan Multer untuk menangani upload gambar.

🛠️ Tumpukan Teknologi (Tech Stack)
Front-end (Landing Page & Admin Panel):

React

Vite

Bulma (Framework CSS)

Swiper.js (Slider)

Framer Motion (Animasi)

React Router DOM (Routing Admin Panel)

React Hot Toast (Notifikasi)

SWR (Data Fetching)

Back-end:

Node.js

Express.js

Prisma (ORM)

Multer (File Upload)

bcryptjs & jsonwebtoken (Keamanan)

Database:

MySQL

📂 Struktur Proyek
Proyek ini dibagi menjadi tiga folder utama di dalam satu repository:

/
├── admin-panel/        # Proyek React untuk Admin Panel
├── backend-sambal/     # Proyek Node.js untuk Back-end API
└── sambal-react-vite/  # Proyek React untuk Landing Page utama
└── README.md           # File ini

🚀 Instalasi & Setup
Ikuti langkah-langkah ini secara berurutan untuk menjalankan proyek secara lokal.

Langkah 1: Clone Repository
Clone (unduh) kode dari GitHub dan masuk ke dalam foldernya.

git clone https://github.com/USERNAME/NAMA_REPO.git
cd NAMA_REPO

Langkah 2: Setup Database
Buka phpMyAdmin.

Buat database baru dengan nama sambal_db.

Pastikan collation diatur ke utf8mb4_unicode_ci untuk dukungan karakter terbaik.

Langkah 3: Konfigurasi Back-end API
Buka Terminal Pertama, lalu masuk ke folder back-end:

cd backend-sambal

Install semua dependensi:

npm install

Buat file .env dari contoh. Cukup salin .env.example (jika ada) atau buat file baru bernama .env dan isi dengan format berikut:

# backend-sambal/.env
DATABASE_URL="mysql://root:@localhost:3306/sambal_db"
JWT_SECRET="ganti_dengan_kunci_rahasia_acak_yang_sangat_panjang"

(Sesuaikan username, password, dan JWT_SECRET Anda)

Jalankan migrasi Prisma untuk membuat semua tabel secara otomatis:

npx prisma migrate dev

Langkah 4: Konfigurasi Front-end (Landing Page)
Buka Terminal Kedua, lalu masuk ke folder landing page:

cd sambal-react-vite

Install dependensi:

npm install

Buat file baru bernama .env dan isi dengan:

# sambal-react-vite/.env
VITE_BACKEND_URL=http://localhost:3001

Langkah 5: Konfigurasi Front-end (Admin Panel)
Buka Terminal Ketiga, lalu masuk ke folder admin panel:

cd admin-panel

Install dependensi:

npm install

Buat file baru bernama .env dan isi dengan:

# admin-panel/.env
VITE_BACKEND_URL=http://localhost:3001

▶️ Menjalankan Aplikasi & Setup Admin
Langkah 1: Jalankan Semua Server
Anda perlu menjalankan tiga server secara bersamaan di tiga terminal yang sudah Anda siapkan.

Di Terminal 1 (Back-end):

npm run dev
# Server API akan berjalan di http://localhost:3001

Di Terminal 2 (Landing Page):

npm run dev
# Landing Page akan berjalan di http://localhost:5173

Di Terminal 3 (Admin Panel):

npm run dev
# Admin Panel akan berjalan di http://localhost:5174

Langkah 2: Membuat Akun Admin Pertama (Penting!)
Setelah back-end berjalan, Anda harus membuat akun admin pertama agar bisa login.

Gunakan aplikasi API client seperti Postman atau Insomnia.

Kirim request POST ke http://localhost:3001/api/register.

Kirim dengan body JSON sebagai berikut:

{
    "username": "admin",
    "password": "password_aman_anda"
}

Setelah request berhasil, Anda sekarang bisa login ke Admin Panel di http://localhost:5174 menggunakan kredensial tersebut.

📄 Lisensi
Proyek ini dilisensikan di bawah Lisensi MIT.