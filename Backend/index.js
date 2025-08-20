require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

// =========================================================================
//  KONFIGURASI DASAR
// =========================================================================
const app = express();
const prisma = new PrismaClient();
const PORT = 3001;
const JWT_SECRET = process.env.JWT_SECRET;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// --- KONFIGURASI UPLOAD (MULTER) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// =========================================================================
//  BAGIAN 1: ENDPOINT PUBLIK (TIDAK PERLU LOGIN)
// =========================================================================

// --- AUTENTIKASI ---
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username dan password diperlukan" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const admin = await prisma.admin.create({
      data: { username, password: hashedPassword },
    });
    res
      .status(201)
      .json({ message: "Admin berhasil dibuat", userId: admin.id });
  } catch (error) {
    res.status(400).json({ error: "Username sudah ada" });
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin)
      return res.status(404).json({ error: "Username tidak ditemukan" });
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid)
      return res.status(401).json({ error: "Password salah" });
    const token = jwt.sign(
      { adminId: admin.id, username: admin.username },
      JWT_SECRET,
      { expiresIn: "8h" }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Terjadi kesalahan internal" });
  }
});

// --- DATA UNTUK LANDING PAGE ---
app.get("/api/produk", async (req, res) => {
  const allProduk = await prisma.produk.findMany({ orderBy: { id: "asc" } });
  res.json(allProduk);
});
app.get("/api/testimoni", async (req, res) => {
  const allTestimoni = await prisma.testimoni.findMany({
    orderBy: { id: "asc" },
  });
  res.json(allTestimoni);
});
app.get("/api/popup-banner", async (req, res) => {
  const banner = await prisma.popupBanner.findFirst({
    where: { isActive: true },
  });
  res.json(banner);
});
app.get("/api/settings", async (req, res) => {
  const settings = await prisma.setting.findUnique({ where: { id: 1 } });
  res.json(settings || {});
});
app.get("/api/social-media-links", async (req, res) => {
  const links = await prisma.socialMediaLink.findMany({
    orderBy: { id: "asc" },
  });
  res.json(links);
});

// =========================================================================
//  BAGIAN 2: PENJAGA / MIDDLEWARE OTENTIKASI
// =========================================================================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// =========================================================================
//  BAGIAN 3: ENDPOINT ADMIN (SEMUA DI BAWAH INI PERLU LOGIN)
// =========================================================================
const adminRouter = express.Router();
adminRouter.use(authenticateToken);
app.use("/api/admin", adminRouter);

// --- UPLOAD (ADMIN) ---
adminRouter.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).send("Tidak ada file yang diunggah.");
  res.status(200).json({ filePath: `/uploads/${req.file.filename}` });
});

// --- PRODUK (ADMIN) ---
adminRouter.get("/produk", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const produk = await prisma.produk.findMany({
    skip,
    take: limit,
    orderBy: { id: "asc" },
  });
  const totalProduk = await prisma.produk.count();
  res.json({ data: produk, total: totalProduk });
});
adminRouter.get("/produk/:id", async (req, res) => {
  const produk = await prisma.produk.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  res.json(produk);
});
adminRouter.post("/produk", async (req, res) => {
  const { name, level, description, imageUrl, harga } = req.body;
  try {
    const newProduk = await prisma.produk.create({
      data: {
        name,
        level: parseInt(level),
        description,
        imageUrl,
        harga: parseInt(harga),
      },
    });
    res.status(201).json(newProduk);
  } catch (error) {
    res.status(500).json({ error: "Gagal membuat produk baru" });
  }
});
adminRouter.put("/produk/:id", async (req, res) => {
  const { id } = req.params;
  const { name, level, description, imageUrl, harga } = req.body;
  const updatedProduk = await prisma.produk.update({
    where: { id: parseInt(id) },
    data: {
      name,
      level: parseInt(level),
      description,
      imageUrl,
      harga: parseInt(harga),
    },
  });
  res.json(updatedProduk);
});
adminRouter.delete("/produk/:id", async (req, res) => {
  await prisma.produk.delete({ where: { id: parseInt(req.params.id) } });
  res.status(204).send();
});

// --- TESTIMONI (ADMIN) ---
adminRouter.get("/testimoni", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const testimoni = await prisma.testimoni.findMany({
    skip,
    take: limit,
    orderBy: { id: "asc" },
  });
  const totalTestimoni = await prisma.testimoni.count();
  res.json({ data: testimoni, total: totalTestimoni });
});
adminRouter.get("/testimoni/:id", async (req, res) => {
  const testimoni = await prisma.testimoni.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  res.json(testimoni);
});
adminRouter.post("/testimoni", async (req, res) => {
  const { name, title, quote, rating, avatarUrl } = req.body;
  const newTestimoni = await prisma.testimoni.create({
    data: { name, title, quote, rating: parseInt(rating), avatarUrl },
  });
  res.status(201).json(newTestimoni);
});
adminRouter.put("/testimoni/:id", async (req, res) => {
  const { id } = req.params;
  const { name, title, quote, rating, avatarUrl } = req.body;
  const updatedTestimoni = await prisma.testimoni.update({
    where: { id: parseInt(id) },
    data: { name, title, quote, rating: parseInt(rating), avatarUrl },
  });
  res.json(updatedTestimoni);
});
adminRouter.delete("/testimoni/:id", async (req, res) => {
  await prisma.testimoni.delete({ where: { id: parseInt(req.params.id) } });
  res.status(204).send();
});

// --- BANNER (ADMIN) ---
adminRouter.get("/banners", async (req, res) => {
  const banners = await prisma.popupBanner.findMany({
    orderBy: { id: "desc" },
  });
  res.json(banners);
});
adminRouter.get("/banners/:id", async (req, res) => {
  const banner = await prisma.popupBanner.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  res.json(banner);
});
adminRouter.post("/banners", async (req, res) => {
  const { imageUrl, isActive } = req.body;
  if (isActive) {
    await prisma.popupBanner.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });
  }
  const newBanner = await prisma.popupBanner.create({
    data: { imageUrl, isActive },
  });
  res.status(201).json(newBanner);
});
adminRouter.put("/banners/:id", async (req, res) => {
  const { id } = req.params;
  const { imageUrl, isActive } = req.body;
  if (isActive) {
    await prisma.popupBanner.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });
  }
  const updatedBanner = await prisma.popupBanner.update({
    where: { id: parseInt(id) },
    data: { imageUrl, isActive },
  });
  res.json(updatedBanner);
});
adminRouter.delete("/banners/:id", async (req, res) => {
  await prisma.popupBanner.delete({ where: { id: parseInt(req.params.id) } });
  res.status(204).send();
});

// --- PENGATURAN & SOSMED (ADMIN) ---
adminRouter.get("/settings", async (req, res) => {
    try {
        const settings = await prisma.setting.upsert({
            where: { id: 1 },
            update: {},
            create: { id: 1, brandName: 'Sambal Teman Makan Ku' },
        });
        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil pengaturan' });
    }
});
adminRouter.get("/social-media-links", async (req, res) => {
    try {
        const links = await prisma.socialMediaLink.findMany({ orderBy: { id: 'asc' } });
        res.json(links);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil link sosmed' });
    }
});
adminRouter.put("/settings", async (req, res) => {
  const { brandName, logoImageUrl } = req.body;
  const updatedSettings = await prisma.setting.upsert({
    where: { id: 1 },
    update: { brandName, logoImageUrl },
    create: { id: 1, brandName, logoImageUrl },
  });
  res.json(updatedSettings);
});
adminRouter.post("/social-media-links", async (req, res) => {
  const { platform, url, iconName } = req.body;
  const newLink = await prisma.socialMediaLink.upsert({
    where: { platform },
    update: { url, iconName },
    create: { platform, url, iconName },
  });
  res.status(201).json(newLink);
});
adminRouter.delete("/social-media-links/:id", async (req, res) => {
  await prisma.socialMediaLink.delete({
    where: { id: parseInt(req.params.id) },
  });
  res.status(204).send();
});

// Jalankan Server
app.listen(PORT, () => {
  console.log(`Server backend berjalan di http://localhost:${PORT}`);
});
