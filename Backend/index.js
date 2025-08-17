const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const { PrismaClient } = require('@prisma/client');

// Inisialisasi
const app = express();
const prisma = new PrismaClient();
const PORT = 3001;

// --- MIDDLEWARE ---
app.use(cors({
  exposeHeaders: ['Content-Range', 'X-Total-Count'],
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- KONFIGURASI UPLOAD (MULTER) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// --- ENDPOINT UTILITAS ---
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).send('Tidak ada file yang diunggah.');
  res.status(200).json({ filePath: `/uploads/${req.file.filename}` });
});

// --- API ENDPOINTS: PRODUK ---
app.get('/api/produk', async (req, res) => {
  const allProduk = await prisma.produk.findMany();
  res.json(allProduk);
});
app.get('/api/produk/:id', async (req, res) => {
  const produk = await prisma.produk.findUnique({ where: { id: parseInt(req.params.id) } });
  res.json(produk);
});
app.post('/api/produk', async (req, res) => {
  const newProduk = await prisma.produk.create({ data: req.body });
  res.status(201).json(newProduk);
});
app.put('/api/produk/:id', async (req, res) => {
  const updatedProduk = await prisma.produk.update({ where: { id: parseInt(req.params.id) }, data: req.body });
  res.json(updatedProduk);
});
app.delete('/api/produk/:id', async (req, res) => {
  await prisma.produk.delete({ where: { id: parseInt(req.params.id) } });
  res.status(204).send();
});

// --- API ENDPOINTS: TESTIMONI ---
app.get('/api/testimoni', async (req, res) => {
  const allTestimoni = await prisma.testimoni.findMany();
  res.json(allTestimoni);
});
app.get('/api/testimoni/:id', async (req, res) => {
  const testimoni = await prisma.testimoni.findUnique({ where: { id: parseInt(req.params.id) } });
  res.json(testimoni);
});
app.post('/api/testimoni', async (req, res) => {
  const newTestimoni = await prisma.testimoni.create({ data: req.body });
  res.status(201).json(newTestimoni);
});
app.put('/api/testimoni/:id', async (req, res) => {
  const updatedTestimoni = await prisma.testimoni.update({ where: { id: parseInt(req.params.id) }, data: req.body });
  res.json(updatedTestimoni);
});
app.delete('/api/testimoni/:id', async (req, res) => {
  await prisma.testimoni.delete({ where: { id: parseInt(req.params.id) } });
  res.status(204).send();
});

// --- API ENDPOINTS: POPUP BANNER ---
app.get('/api/popup-banner', async (req, res) => { // Untuk website utama
  const banner = await prisma.popupBanner.findFirst({ where: { isActive: true } });
  res.json(banner);
});
app.get('/api/popup-banners', async (req, res) => { // Untuk admin panel
  const allBanners = await prisma.popupBanner.findMany({ orderBy: { id: 'desc' } });
  res.json(allBanners);
});
app.get('/api/popup-banners/:id', async (req, res) => {
  const banner = await prisma.popupBanner.findUnique({ where: { id: parseInt(req.params.id) } });
  res.json(banner);
});
app.post('/api/popup-banners', async (req, res) => {
  const { imageUrl, isActive } = req.body;
  if (isActive) {
    await prisma.popupBanner.updateMany({ where: { isActive: true }, data: { isActive: false } });
  }
  const newBanner = await prisma.popupBanner.create({ data: { imageUrl, isActive } });
  res.status(201).json(newBanner);
});
app.put('/api/popup-banners/:id', async (req, res) => {
  const { id } = req.params;
  const { imageUrl, isActive } = req.body;
  if (isActive) {
    await prisma.popupBanner.updateMany({ where: { isActive: true }, data: { isActive: false } });
  }
  const updatedBanner = await prisma.popupBanner.update({ where: { id: parseInt(id) }, data: { imageUrl, isActive } });
  res.json(updatedBanner);
});
app.delete('/api/popup-banners/:id', async (req, res) => {
  await prisma.popupBanner.delete({ where: { id: parseInt(req.params.id) } });
  res.status(204).send();
});

// Jalankan Server
app.listen(PORT, () => {
  console.log(`Server backend berjalan di http://localhost:${PORT}`);
});