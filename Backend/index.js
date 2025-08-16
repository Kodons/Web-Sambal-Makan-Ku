const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Menentukan folder penyimpanan file
    cb(null, 'public/uploads'); 
  },
  filename: function (req, file, cb) {
    // Membuat nama file yang unik dengan menambahkan timestamp
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Tidak ada file yang diunggah.');
  }
  // Kembalikan path file yang bisa diakses publik
  res.status(200).json({ filePath: `/uploads/${req.file.filename}` });
});

// --- API ENDPOINTS (READ / MENGAMBIL DATA) ---

app.get('/api/popup-banner', async (req, res) => {
  try {
    const banner = await prisma.popupBanner.findFirst({ where: { isActive: true } });
    res.json(banner);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data banner' });
  }
});

app.get('/api/produk', async (req, res) => {
  try {
    const produk = await prisma.produk.findMany();
    res.json(produk);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data produk' });
  }
});

app.get('/api/produk/:id', async (req, res) => {
    try {
        const product = await prisma.produk.findUnique({
            where: { id: parseInt(req.params.id) }
        });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data produk tunggal' });
    }
});

app.get('/api/testimoni', async (req, res) => {
  try {
    const testimoni = await prisma.testimoni.findMany();
    res.json(testimoni);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data testimoni' });
  }
});

app.get('/api/testimoni/:id', async (req, res) => {
    try {
        const testimoni = await prisma.testimoni.findUnique({
            where: { id: parseInt(req.params.id) }
        });
        res.json(testimoni);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data testimoni tunggal' });
    }
});

app.get('/api/popup-banners', async (req, res) => {
  try {
    const banners = await prisma.popupBanner.findMany();
    res.json(banners);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data banner' });
  }
});



// --- API ENDPOINTS (CREATE, UPDATE, DELETE UNTUK PRODUK) ---

// CREATE - Membuat produk baru
app.post('/api/produk', async (req, res) => {
  console.log("Menerima data untuk produk baru:", req.body);
  try {
    const newProduct = await prisma.produk.create({
      data: req.body,
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("ERROR SAAT MEMBUAT PRODUK:", error);
    res.status(500).json({ error: 'Gagal membuat produk baru', details: error.message });
  }
});

app.post('/api/testimoni', async (req, res) => {
  try {
    const newTestimoni = await prisma.testimoni.create({ data: req.body });
    res.status(201).json(newTestimoni);
  } catch (error) {
    res.status(500).json({ error: 'Gagal membuat testimoni baru' });
  }
});

app.post('/api/popup-banners', async (req, res) => {
  const { imageUrl, isActive } = req.body;

  try {
    // PERUBAHAN 1: Jika banner baru ini akan diaktifkan...
    if (isActive) {
      // ...maka nonaktifkan semua banner lain terlebih dahulu.
      await prisma.popupBanner.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
    }

    // Setelah itu, baru buat banner baru.
    const newBanner = await prisma.popupBanner.create({
      data: { imageUrl, isActive },
    });
    res.status(201).json(newBanner);
  } catch (error) {
    console.error("Gagal membuat banner:", error);
    res.status(500).json({ error: 'Gagal membuat banner' });
  }
});

// UPDATE - Mengubah produk berdasarkan ID
app.put('/api/produk/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedProduct = await prisma.produk.update({
      where: { id: parseInt(id) },
      data: req.body,
    });
    res.json(updatedProduct);
  } catch (error) {
    console.error("ERROR SAAT MEMPERBARUI PRODUK:", error);
    res.status(500).json({ error: 'Gagal memperbarui produk', details: error.message });
  }
});

app.put('/api/testimoni/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedTestimoni = await prisma.testimoni.update({
      where: { id: parseInt(id) },
      data: req.body,
    });
    res.json(updatedTestimoni);
  } catch (error) {
    res.status(500).json({ error: 'Gagal memperbarui testimoni' });
  }
});

app.put('/api/popup-banners/:id', async (req, res) => {
    const { id } = req.params;
    const { imageUrl, isActive } = req.body;

    try {
        // PERUBAHAN 2: Sama seperti di atas, jika banner ini akan diaktifkan...
        if (isActive) {
            // ...nonaktifkan semua banner lain.
            await prisma.popupBanner.updateMany({
                where: { isActive: true },
                data: { isActive: false },
            });
        }
        
        // Setelah itu, baru perbarui banner yang dipilih.
        const updatedBanner = await prisma.popupBanner.update({
            where: { id: parseInt(id) },
            data: { imageUrl, isActive },
        });
        res.json(updatedBanner);
    } catch (error) {
        console.error("Gagal update banner:", error);
        res.status(500).json({ error: 'Gagal update banner' });
    }
});

// DELETE - Menghapus produk berdasarkan ID
app.delete('/api/produk/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.produk.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send(); // Sukses tanpa konten balikan
  } catch (error) {
    console.error("ERROR SAAT MENGHAPUS PRODUK:", error);
    res.status(500).json({ error: 'Gagal menghapus produk', details: error.message });
  }
});

app.delete('/api/testimoni/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.testimoni.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Gagal menghapus testimoni' });
  }
});

app.delete('/api/popup-banners/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Perintah ini akan menghapus banner dari database berdasarkan ID
    await prisma.popupBanner.delete({ where: { id: parseInt(id) } });
    res.status(204).send(); // Kirim status sukses tanpa konten
  } catch (error) {
    console.error("Gagal menghapus banner:", error);
    res.status(500).json({ error: 'Gagal menghapus banner' });
  }
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server backend berjalan di http://localhost:${PORT}`);
});