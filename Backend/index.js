require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const { body, validationResult } = require("express-validator");
const rateLimit = require('express-rate-limit');
const sharp = require('sharp');
const fs = require('fs');
const compression = require('compression');

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
app.use(compression());


// --- KONFIGURASI UPLOAD (MULTER) ---
const storage = multer.memoryStorage(); 

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Hanya file gambar yang diizinkan!'), false);
    }
};
const upload = multer({ storage: storage, fileFilter: fileFilter });

// =========================================================================
//  BAGIAN 1: ENDPOINT PUBLIK (TIDAK PERLU LOGIN)
// =========================================================================

// --- KONFIGURASI RATE LIMITER ---
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
    message: { error: 'Terlalu banyak percobaan, silakan coba lagi setelah 15 menit' }
});

// --- AUTENTIKASI ---
app.post('/api/register', authLimiter, async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ error: "Username, password, dan email diperlukan" });
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    const admin = await prisma.admin.create({
      data: {
        username,
        password: hashedPassword,
        email,
      },
    });
    res
      .status(201)
      .json({ message: "Admin berhasil dibuat", userId: admin.id });
  } catch (error) {
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        return res.status(400).json({ error: "Email sudah terdaftar" });
    }
    res.status(400).json({ error: "Username sudah ada" });
  }
});

app.post("/api/login", authLimiter, async (req, res) => {
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

app.post("/api/forgot-password", authLimiter, async (req, res) => {
  const { username } = req.body;
  console.log(
    `[LOG] Menerima permintaan reset password untuk username: "${username}"`
  );

  try {
    const admin = await prisma.admin.findUnique({ where: { username } });

    if (!admin || !admin.email) {
      console.log(
        `[LOG] Admin "${username}" tidak ditemukan atau tidak memiliki email. Mengirim respons sukses palsu.`
      );
      return res.json({
        message: "Jika username terdaftar, email reset telah dikirim.",
      });
    }
    console.log(
      `[LOG] Admin ditemukan: ${admin.username} (Email: ${admin.email})`
    );

    const resetToken = crypto.randomBytes(20).toString("hex");
    const passwordResetExpires = new Date(Date.now() + 3600000);
    console.log(`[LOG] Token reset berhasil dibuat.`);

    await prisma.admin.update({
      where: { username },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: passwordResetExpires,
      },
    });
    console.log(`[LOG] Token berhasil disimpan ke database.`);

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.BREVO_API_KEY || process.env.EMAIL_PASS,
      },
    });

    const resetUrl = `http://localhost:5174/reset-password/${resetToken}`;
    console.log(`[LOG] Mencoba mengirim email ke: ${admin.email}`);

    await transporter.sendMail({
      to: admin.email,
      from: `Admin Sambal TMK <${process.env.SENDER_EMAIL}>`,
      subject: "Reset Password Admin",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
            <h2 style="color: #c0392b;">Permintaan Reset Password</h2>
            <p>Halo ${admin.username},</p>
            <p>Anda menerima email ini karena ada permintaan untuk mereset password akun admin Anda.</p>
            <p>Silakan klik tombol di bawah ini untuk melanjutkan. Link ini akan kedaluwarsa dalam 1 jam.</p>
            <div style="text-align: center; margin: 20px 0;">
                <a href="${resetUrl}" style="background-color: #c0392b; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                    Reset Password Saya
                </a>
            </div>
            <p>Jika Anda tidak meminta ini, silakan abaikan email ini dan password Anda akan tetap aman.</p>
            <hr style="border: none; border-top: 1px solid #eee;">
            <p style="font-size: 0.8em; color: #777;">Jika tombol tidak berfungsi, salin dan tempel URL berikut di browser Anda:</p>
            <p style="font-size: 0.8em; color: #777; word-break: break-all;">${resetUrl}</p>
        </div>
      `,
    });
    console.log(`[LOG] Email berhasil dikirim.`);

    res.json({
      message: "Jika username terdaftar, email reset telah dikirim.",
    });
  } catch (error) {
    console.error("--- ERROR DI FORGOT-PASSWORD ---");
    console.error(error);
    console.error("---------------------------------");
    res.status(500).json({ error: "Gagal mengirim email reset." });
  }
});

// Endpoint untuk mereset password dengan token
app.post("/api/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  console.log(`[LOG] Menerima permintaan reset dengan token.`);

  try {
    const admin = await prisma.admin.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { gt: new Date() },
      },
    });

    if (!admin) {
      console.log(`[LOG] Token tidak valid atau kedaluwarsa.`);
      return res
        .status(400)
        .json({
          error: "Token reset password tidak valid atau sudah kedaluwarsa.",
        });
    }
    console.log(`[LOG] Token valid untuk admin: ${admin.username}`);

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(`[LOG] Password baru berhasil di-hash.`);

    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });
    console.log(`[LOG] Password untuk ${admin.username} berhasil direset.`);

    res.json({ message: "Password berhasil direset." });
  } catch (error) {
    console.error("--- ERROR DI RESET-PASSWORD ---");
    console.error(error);
    console.error("-------------------------------");
    res.status(500).json({ error: "Gagal mereset password." });
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
adminRouter.post("/upload", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Tidak ada file yang diunggah.' });
    }

    try {
        const uniqueSuffix = Date.now() + '.webp';
        const outputPath = path.join(__dirname, 'public/uploads', uniqueSuffix);

        await sharp(req.file.buffer)
            .resize(800, 800, { fit: 'inside', withoutEnlargement: true }) 
            .toFormat('webp', { quality: 80 })
            .toFile(outputPath);

        res.status(200).json({ filePath: `/uploads/${uniqueSuffix}` });

    } catch (error) {
        console.error("Error saat memproses gambar:", error);
        res.status(500).json({ error: 'Gagal memproses gambar.' });
    }
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
adminRouter.post(
  "/produk",
  [
    body("name")
      .notEmpty()
      .withMessage("Nama tidak boleh kosong")
      .trim()
      .escape(),
    body("description")
      .notEmpty()
      .withMessage("Deskripsi tidak boleh kosong")
      .trim()
      .escape(),
    body("level")
      .isInt({ min: 1, max: 5 })
      .withMessage("Level pedas harus antara 1 dan 5"),
    body("harga").isInt({ min: 0 }).withMessage("Harga tidak boleh negatif"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
  }
);
adminRouter.put(
  "/produk/:id",
  [
    body("name")
      .notEmpty()
      .withMessage("Nama tidak boleh kosong")
      .trim()
      .escape(),
    body("description")
      .notEmpty()
      .withMessage("Deskripsi tidak boleh kosong")
      .trim()
      .escape(),
    body("level")
      .isInt({ min: 1, max: 5 })
      .withMessage("Level pedas harus antara 1 dan 5"),
    body("harga").isInt({ min: 0 }).withMessage("Harga tidak boleh negatif"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, level, description, imageUrl, harga } = req.body;
    try {
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
    } catch (error) {
      res.status(500).json({ error: "Gagal memperbarui produk" });
    }
  }
);
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
    orderBy: { id: "asc" },
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
  const settings = await prisma.setting.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, brandName: "Sambal Teman Makan Ku" },
  });
  res.json(settings);
});
adminRouter.get("/social-media-links", async (req, res) => {
  const links = await prisma.socialMediaLink.findMany({
    orderBy: { id: "asc" },
  });
  res.json(links);
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