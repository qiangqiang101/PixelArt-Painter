// app.js - Simple Node.js API Server with GET and POST endpoints
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.options('/api/data', cors({
  methods: ['GET', 'POST']
}));

// home server
// var con = mysql.createConnection({
//   host: "192.168.0.6",  //localhost
//   user: "nollie_nodejs",
//   password: "CzufZrx5bCwRnnf96Q3a",
//   database: 'nollie_nodejs'
// });

// server
var con = mysql.createConnection({
  host: "localhost",  //localhost
  user: "nollie_nodejs",
  password: "CzufZrx5bCwRnnf96Q3a",
  database: 'nollie_nodejs'
});
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});
//con.end();

// In-memory data store (for demonstration purposes)
// let items = [
//   { id: 1, author: '森口友治', name: 'SignalRGB Logo', size: [16, 16], data: '[[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0],[0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],[0,1,1,1,0,0,0,0,0,0,0,0,0,1,1,0],[0,1,1,1,1,1,1,1,1,0,0,0,1,1,0,0],[0,1,1,1,1,1,1,1,1,1,1,0,1,0,0,0],[0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0],[0,0,0,0,0,0,0,0,1,1,1,0,0,1,1,0],[0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,0],[0,1,1,1,1,1,1,1,1,1,0,1,1,0,0,0],[0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0],[0,0,0,0,0,1,1,0,0,1,1,0,0,1,1,0],[0,0,0,0,1,1,0,0,1,1,0,0,1,1,0,0],[0,0,0,1,1,0,0,1,1,0,0,1,1,0,0,0],[0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]]' },
//   { id: 2, author: '森口友治', name: 'Nollie Logo', size: [32, 8], data: '[[1,1,0,0,1,1,0,0,1,1,1,1,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,1,1,1,1,1],[1,1,0,0,1,1,0,1,1,1,1,1,1,0,1,1,0,0,0,1,1,0,0,0,1,1,0,1,1,1,1,1],[1,1,1,0,1,1,0,1,1,0,0,1,1,0,1,1,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0],[1,1,1,1,1,1,0,1,1,0,0,1,1,0,1,1,0,0,0,1,1,0,0,0,1,1,0,1,1,1,1,1],[1,1,1,1,1,1,0,1,1,0,0,1,1,0,1,1,0,0,0,1,1,0,0,0,1,1,0,1,1,1,1,1],[1,1,0,1,1,1,0,1,1,0,0,1,1,0,1,1,0,0,0,1,1,0,0,0,1,1,0,1,1,0,0,0],[1,1,0,0,1,1,0,1,1,1,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,0,1,1,1,1,1],[1,1,0,0,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,1,1,1,1,0,1,1,0,1,1,1,1,1]]' },
//   { id: 3, author: '森口友治', name: 'Mofun Logo', size: [32, 8], data: '[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,0,0,0,1,1,0,0,1,1,1,0,0,1,1,1,1,1,0,1,1,0,1,1,0,1,1,0,0,1,1],[1,1,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,0,1,1],[1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,0,0,0,0,1,1,0,1,1,0,1,1,1,1,1,1],[1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,1,0,0,1,1,0,1,1,0,1,1,1,1,1,1],[1,1,0,1,0,1,1,0,1,1,1,1,1,0,1,1,0,0,0,0,1,1,1,1,1,0,1,1,0,1,1,1],[1,1,0,0,0,1,1,0,0,1,1,1,0,0,1,1,0,0,0,0,0,1,1,1,0,0,1,1,0,0,1,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]' }
// ];

// GET API endpoint - Retrieve all items
app.get('/api/items', (req, res) => {
  console.log('GET request received for /api/items');

  const sql = 'SELECT * FROM items ORDER BY id DESC LIMIT 24';
  con.query(sql, (err, results, fields) => {
    if (err) {
      console.error(`Error executing query: `, err);
      return;
    }
    console.log('Query results: ', results);

    let data = [];
    results.forEach((e) => {
      data.push({
        id: e.id,
        author: e.author,
        name: e.name,
        size: [e.width, e.height],
        preview: e.preview
      });
    });

    res.status(200).json({
      success: true,
      count: results.length,
      data: data
    });
  });
});

// GET API endpoint - Retrieve specific item by ID
app.get('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  console.log(`GET request received for /api/items/${id}`);

  const sql = `SELECT * FROM items WHERE id = "${id}"`;
  con.query(sql, (err, results, fields) => {
    if (err) {
      console.error(`Error executing query: `, err);
      return;
    }
    console.log('Query results: ', results);

    let data = [];
    results.forEach((e) => {
      data.push({
        id: e.id,
        author: e.author,
        name: e.name,
        size: [e.width, e.height],
        data: e.data,
        preview: e.preview
      });
    });

    res.status(200).json({
      success: true,
      count: results.length,
      data: data
    });
  });
});

// GET API endpoint - Retrieve specific item by name
app.get('/api/search/:name', (req, res) => {
  const name = req.params.name.toLowerCase();
  console.log(`GET request received for /api/search/${name}`);

  const sql = `SELECT * FROM items WHERE LOWER(name) LIKE "%${name}%" OR LOWER(author) LIKE "%${name}%" ORDER BY id DESC LIMIT 24`;
  con.query(sql, (err, results, fields) => {
    if (err) {
      console.error(`Error executing query: `, err);
      return;
    }
    console.log('Query results: ', results);

    let data = [];
    results.forEach((e) => {
      data.push({
        id: e.id,
        author: e.author,
        name: e.name,
        size: [e.width, e.height],
        data: e.data,
        preview: e.preview
      });
    });

    res.status(200).json({
      success: true,
      count: results.length,
      data: data
    });
  });
});

// POST API endpoint - Create a new item
app.post('/api/items', (req, res) => {
  console.log('POST request received for /api/items');
  console.log('Request body:', req.body);

  // Validate request
  if (!req.body.name) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a name for the item'
    });
  }

  let dataExist = 0;
  // Check data existing
  const sql1 = `SELECT * FROM items WHERE data = '${req.body.data}'`;
  con.query(sql1, (err, results, fields) => {
    if (err) {
      console.error(`Error executing query: `, err);
      return;
    }
    dataExist = results.length;
  });

  if (dataExist == 0) {
    // Insert to database
    const sql = 'INSERT INTO items (author, name, width, height, data, preview) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [req.body.author, req.body.name, req.body.size[0], req.body.size[1], req.body.data, req.body.preview];
    con.query(sql, values, (err, result) => {
      if (err) throw err;
      console.log(`Data inserted:`, result);

      // Create new item
      const newItem = {
        id: result.insertId,
        author: req.body.author,
        name: req.body.name,
        size: req.body.size,
        data: req.body.data,
        preview: req.body.preview
      };

      res.status(201).json({
        success: true,
        data: newItem
      });
    });
  } else {
    res.status(201).json({
        success: false,
        data: null
      });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`GET endpoints: http://localhost:${PORT}/api/items and http://localhost:${PORT}/api/items/:id`);
  console.log(`POST endpoint: http://localhost:${PORT}/api/items`);
});

// Export for testing purposes
module.exports = app;

