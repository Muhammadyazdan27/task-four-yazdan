const express = require('express');
const cors = require('cors');
const sql = require('mssql/msnodesqlv8'); 

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); 
app.use(express.json());


const dbConfig = {
    server: 'DESKTOP-GR2KF2J\\SQLEXPRESS', 
    database: 'DecodeLabsDB',
    driver: 'SQL Server',
    options: {
        trustedConnection: true, 
        encrypt: false 
    }
};

// Database Connection
sql.connect(dbConfig).then(() => {
    console.log("Database Connection: SUCCESS (Windows Authentication)");
}).catch(err => console.log("Database Connection Failed!", err));

// ==========================================
// 1. GET: Saare users mangwana
// ==========================================
app.get('/users', async (req, res) => {
    try {
        const request = new sql.Request();
        const result = await request.query('SELECT * FROM Users');
        res.status(200).json({ message: "Users retrieved", data: result.recordset });
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
});

// ==========================================
// 2. POST: Naya user daalna
// ==========================================
app.post('/users', async (req, res) => {
    const { name, role } = req.body;

    if (!name || !role) {
        return res.status(400).json({ error: "Name and role are required." });
    }

    try {
        const request = new sql.Request();
        request.input('userName', sql.VarChar, name);
        request.input('userRole', sql.VarChar, role);
        await request.query('INSERT INTO Users (name, role) VALUES (@userName, @userRole)');
        
        res.status(201).json({ message: "User created securely", data: { name, role } });
    } catch (err) {
        res.status(500).json({ error: "Failed to create user" });
    }
});

// Server Start
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});