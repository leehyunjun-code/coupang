require('dotenv').config();
const express = require('express');
const path = require('path');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API 라우트
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

// HTML 페이지 라우팅
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/register.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Vercel Serverless Function export
module.exports = app;