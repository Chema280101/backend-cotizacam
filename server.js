require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de Productos
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { name, category, price, unit, description } = req.body;
    const product = await prisma.product.create({
      data: { name, category, price: parseFloat(price), unit, description }
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const { name, category, price, unit, description } = req.body;
    const product = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: { name, category, price: parseFloat(price), unit, description }
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rutas de Cotizaciones
app.get('/api/quotations', async (req, res) => {
  try {
    const quotations = await prisma.quotation.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        details: {
          include: { product: true }
        }
      }
    });
    res.json(quotations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/quotations/:id', async (req, res) => {
  try {
    const quotation = await prisma.quotation.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        details: {
          include: { product: true }
        }
      }
    });
    if (!quotation) return res.status(404).json({ error: 'Cotización no encontrada' });
    res.json(quotation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/quotations', async (req, res) => {
  try {
    const { clientName, clientAddress, clientPhone, total, margin, status, details } = req.body;
    
    const quotation = await prisma.quotation.create({
      data: {
        clientName,
        clientAddress,
        clientPhone,
        total: parseFloat(total),
        margin: margin ? parseFloat(margin) : null,
        status: status || 'draft',
        details: {
          create: details.map(d => ({
            productId: d.productId,
            quantity: d.quantity,
            unitPrice: parseFloat(d.unitPrice),
            subtotal: parseFloat(d.subtotal)
          }))
        }
      },
      include: {
        details: {
          include: { product: true }
        }
      }
    });
    res.status(201).json(quotation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/quotations/:id', async (req, res) => {
  try {
    const { clientName, clientAddress, clientPhone, total, margin, status } = req.body;
    const quotation = await prisma.quotation.update({
      where: { id: parseInt(req.params.id) },
      data: {
        clientName,
        clientAddress,
        clientPhone,
        total: parseFloat(total),
        margin: margin ? parseFloat(margin) : null,
        status
      }
    });
    res.json(quotation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/quotations/:id', async (req, res) => {
  try {
    await prisma.quotation.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Cotización eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rutas de Configuración (Settings)
app.get('/api/settings/:key', async (req, res) => {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: req.params.key }
    });
    res.json(setting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/settings', async (req, res) => {
  try {
    const settings = await prisma.setting.findMany();
    const settingsObj = {};
    settings.forEach(s => settingsObj[s.key] = s.value);
    res.json(settingsObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/settings', async (req, res) => {
  try {
    const { key, value } = req.body;
    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    });
    res.json(setting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API de Cotizaciones funcionando' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📦 API de Cotizaciones - Román Balcázar`);
});

module.exports = app;
