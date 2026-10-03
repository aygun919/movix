// npm i express mssql
const express = require('express');
const sql = require('mssql');
const app = express();

const sql = require('mssql');

const config = {
    server: 'localhost',   // ✅ SQLEXPRESS yazma, sadece localhost
    database: 'MoviesDB',
    user: 'sa',
    password: '1478', // SQL Server Authentication şifren
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};


// Bağlantıyı bir kez aç, app boyunca kullan
const poolPromise = sql.connect(dbConfig);

// Basit sağlık kontrolü
app.get('/health', async (req, res) => {
  try {
    const pool = await poolPromise;
    const r = await pool.request().query('SELECT 1 AS ok');
    res.json({ ok: r.recordset[0].ok === 1 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Sunucu 3000 portunda çalışıyor'));

// Arama endpoint'i
app.get('/search', async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const term = `%${req.query.term}%`;
        const result = await pool.request()
            .input('term', sql.NVarChar, term)
            .query(`
                SELECT DISTINCT m.MovieID, m.Title, m.ImageUrl
                FROM Movies m
                LEFT JOIN MovieCategories mc ON m.MovieID = mc.MovieID
                LEFT JOIN Categories c ON mc.CategoryID = c.CategoryID
                WHERE m.Title LIKE @term OR c.CategoryName LIKE @term
            `);
        res.json(result.recordset);
    } catch (err) {
        console.error('Arama hatası:', err);
        res.status(500).json({ error: 'Aradığınız Film ya da Dizi bulunamadı.' });
    }
});

// Film detayları endpoint'i
app.get('/movie', async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const movieId = req.query.id;
        const result = await pool.request()
            .input('id', sql.Int, movieId)
            .query('SELECT MovieID, Title, ImageUrl FROM Movies WHERE MovieID = @id');
        res.json(result.recordset);
    } catch (err) {
        console.error('Film detayı hatası:', err);
        res.status(500).json({ error: 'Film detayları alınamadı.' });
    }
});

// Kategoriler endpoint'i
app.get('/categories', async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const movieId = req.query.id;
        const result = await pool.request()
            .input('id', sql.Int, movieId)
            .query(`
                SELECT c.CategoryName
                FROM Categories c
                JOIN MovieCategories mc ON c.CategoryID = mc.CategoryID
                WHERE mc.MovieID = @id
            `);
        res.json(result.recordset.map(row => row.CategoryName));
    } catch (err) {
        console.error('Kategori hatası:', err);
        res.status(500).json({ error: 'Kategoriler alınamadı.' });
    }
});

app.use(express.static('public'));