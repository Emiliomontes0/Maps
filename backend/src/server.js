require('dotenv').config();
const path = require('path');
const express = require('express');
const multer = require('multer');
const { PrismaClient } = require('@prisma/client');

const mapRoutes = require('./routes/mapRoutes');

const prisma = new PrismaClient();
const app = express();
const upload = multer({ dest: path.join(__dirname, '../tmp/uploads') });

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/maps', mapRoutes);

app.get('/health', (req, res) => {
  res.json({ message: 'OK' });
});

app.post('/maps', upload.single('mapImage'), async (req, res, next) => {
  try {
    res.status(201).json({ message: 'Map uploaded endpoint stub' });
  } catch (error) {
    next(error);
  }
});

app.get('/maps/:id', async (req, res, next) => {
  try {
    res.json({ message: 'Map fetch endpoint stub' });
  } catch (error) {
    next(error);
  }
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({error: "Internal server error"});
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});