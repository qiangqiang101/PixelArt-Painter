// app.js - Simple Node.js API Server with GET and POST endpoints
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
//const fs = require('fs');
const config = require('./config.json');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;
const limit = 30; //normally 30

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.options('/api/data', cors({
  methods: ['GET', 'POST']
}));

const databaseConfig = {
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
  waitForConnections: true,
  connectionLimit: 30,
  queueLimit: 20
};

// GET API endpoint - Retrieve all items
app.get('/api/allitems/:page', (req, res) => {
  const currPage = parseInt(req.params.page);
  console.log(`GET request received for /api/allitems/${currPage}`);
  const offset = currPage * limit;
  var nextPage = currPage;

  const itemService = new ItemService(databaseConfig);

  itemService.getAllItems({
    limit: limit,
    offset: offset,
    orderBy: 'id',
    orderDirection: 'DESC',
    search: null
  })
    .then(result => {
      console.log(result);

      let data = [];
      result.data.forEach((e) => {
        data.push({
          id: e.id,
          author: e.author,
          name: e.name,
          size: [e.width, e.height],
          preview: e.preview,
          submittime: e.submittime
        });
      });

      let hasMore = (parseInt(result.pagination.offset) + parseInt(result.pagination.limit)) < parseInt(result.pagination.total);
      if (hasMore) nextPage++;

      res.status(201).json({
        success: result.success,
        data: data,
        pagination: limit ? {
          total: parseInt(result.pagination.total),
          limit: result.pagination.limit,
          offset: parseInt(result.pagination.offset),
          hasMore: hasMore,
          currPage: currPage,
          nextPage: nextPage
        } : null
      });
    }).catch(error => {
      console.error(error);

      res.status(201).json({
        success: false,
        data: error
      });
    });
});

// GET API endpoint - Retrieve items by id array
app.get('/api/items/:id_array/:page', (req, res) => {
  const currPage = parseInt(req.params.page);
  const idArray = JSON.parse(req.params.id_array);
  console.log(`GET request received for /api/items/${idArray}/${currPage}`);
  const offset = currPage * limit;
  var nextPage = currPage;

  const itemService = new ItemService(databaseConfig);

  itemService.getItemsByIdArray(idArray, {
    limit: limit,
    offset: offset,
    orderBy: 'id',
    orderDirection: 'DESC',
  })
    .then(result => {
      console.log(result);

      let data = [];
      result.data.forEach((e) => {
        data.push({
          id: e.id,
          author: e.author,
          name: e.name,
          size: [e.width, e.height],
          preview: e.preview,
          submittime: e.submittime
        });
      });

      let hasMore = (parseInt(result.pagination.offset) + parseInt(result.pagination.limit)) < parseInt(result.pagination.total);
      if (hasMore) nextPage++;

      res.status(201).json({
        success: result.success,
        data: data,
        pagination: limit ? {
          total: parseInt(result.pagination.total),
          limit: result.pagination.limit,
          offset: parseInt(result.pagination.offset),
          hasMore: hasMore,
          currPage: currPage,
          nextPage: nextPage
        } : null
      });
    }).catch(error => {
      console.error(error);

      res.status(201).json({
        success: false,
        data: error
      });
    });
});

// GET API endpoint - Retrieve specific item by ID
app.get('/api/item/:id', (req, res) => {
  const id = parseInt(req.params.id);
  console.log(`GET request received for /api/items/${id}`);

  const itemService = new ItemService(databaseConfig);

  itemService.getItemById(id)
    .then(result => {
      console.log(result);

      res.status(201).json({
        success: result.success,
        data: result.data
      });
    })
    .catch(error => {
      console.error(error);

      res.status(201).json({
        success: false,
        data: error
      });
    });
});

// GET API endpoint - Retrieve specific items by name or author
app.get('/api/search/:search_string/:page', (req, res) => {
  const currPage = parseInt(req.params.page);
  const search_string = req.params.search_string
  console.log(`GET request received for /api/search/${search_string}/${currPage}`);
  const offset = currPage * limit;
  var nextPage = currPage;

  const itemService = new ItemService(databaseConfig);

  itemService.getAllItems({
    limit: limit,
    offset: offset,
    orderBy: 'id',
    orderDirection: 'DESC',
    search: search_string
  })
    .then(result => {
      console.log(result);

      let data = [];
      result.data.forEach((e) => {
        data.push({
          id: e.id,
          author: e.author,
          name: e.name,
          size: [e.width, e.height],
          preview: e.preview,
          submittime: e.submittime
        });
      });

      let hasMore = (parseInt(result.pagination.offset) + parseInt(result.pagination.limit)) < parseInt(result.pagination.total);
      if (hasMore) nextPage++;

      res.status(201).json({
        success: result.success,
        data: data,
        pagination: limit ? {
          total: parseInt(result.pagination.total),
          limit: result.pagination.limit,
          offset: parseInt(result.pagination.offset),
          hasMore: hasMore,
          currPage: currPage,
          nextPage: nextPage
        } : null
      });
    }).catch(error => {
      console.error(error);

      res.status(201).json({
        success: false,
        data: error
      });
    });
});

// POST API endpoint - Create a new item
app.post('/api/items', (req, res) => {
  console.log('POST request received for /api/items');
  console.log('Request body:', req.body);

  const itemService = new ItemService(databaseConfig);

  itemService.insertItem({
    author: req.body.author,
    name: req.body.name,
    size: req.body.size,
    data: req.body.data,
    preview: req.body.preview
  })
    .then(result => {
      console.log(result);

      res.status(201).json({
        success: result.success,
        data: result
      });
    })
    .catch(error => {
      console.error(error);

      res.status(201).json({
        success: false,
        data: error
      });
    });

});

class ItemService {
  constructor(dbConfig) {
    this.pool = mysql.createPool(dbConfig);
  }

  async insertItem(itemData) {
    const connection = await this.pool.getConnection();

    try {
      const [existing] = await connection.execute('SELECT id FROM items WHERE data = ?', [itemData.data]);

      if (existing.length > 0) {
        return {
          success: false,
          message: 'Item already exists',
          existingId: existing[0].id
        };
      }

      const [result] = await connection.execute('INSERT INTO items (author, name, width, height, data, preview) VALUES (?, ?, ?, ?, ?, ?)', [itemData.author, itemData.name, itemData.size[0], itemData.size[1], itemData.data, itemData.preview]);

      return {
        success: true,
        message: 'Item created successfully',
        id: result.insertId
      }
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  async getAllItems(options = {}) {
    const connection = await this.pool.getConnection();

    try {
      const {
        limit = null,
        offset = 0,
        orderBy = 'id',
        orderDirection = 'DESC',
        search = null
      } = options;

      // Build base query
      let query = 'SELECT id, author, name, width, height, data, preview, submittime FROM items';
      let queryParams = [];

      // Add search filter if provided
      if (search) {
        query += ' WHERE LOWER(name) LIKE ? OR LOWER(author) LIKE ?';
        const searchTerm = `%${search}%`;
        queryParams.push(searchTerm, searchTerm);
      }

      // Add ordering
      const validOrderColumns = ['id', 'name', 'author', 'submittime'];
      const validDirections = ['ASC', 'DESC'];

      if (validOrderColumns.includes(orderBy) && validDirections.includes(orderDirection.toUpperCase())) {
        query += ` ORDER BY ${orderBy} ${orderDirection.toUpperCase()}`;
      }

      // Add pagination if limit is specified
      if (limit) {
        query += ' LIMIT ?';
        queryParams.push(parseInt(limit));

        if (offset > 0) {
          query += ' OFFSET ?';
          queryParams.push(parseInt(offset));
        }
      }

      console.log('Executing query:', query);
      console.log('With params:', queryParams);

      const [rows] = await connection.execute(query, queryParams);

      // Get total count for pagination info
      let totalCount = 0;
      if (limit) {
        let countQuery = 'SELECT COUNT(*) as total FROM items';
        let countParams = [];

        if (search) {
          countQuery += ' WHERE name LIKE ? OR author LIKE ?';
          const searchTerm = `%${search}%`;
          countParams.push(searchTerm, searchTerm);
        }

        const [countResult] = await connection.execute(countQuery, countParams);
        totalCount = countResult[0].total;
      }

      if (totalCount == 0) totalCount = rows.length;

      return {
        success: true,
        data: rows,
        pagination: limit ? {
          total: totalCount,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: (parseInt(offset) + parseInt(limit)) < totalCount
        } : null
      };
    } catch (error) {
      console.error('Database error:', error);
      return {
        success: false,
        message: 'Failed to retrieve items',
        error: error.message
      };
    } finally {
      connection.release();
    }
  }

  async getItemsByIdArray(itemIds, options = {}) {
    const connection = await this.pool.getConnection();

    try {
      const {
        limit = null,
        offset = 0,
        orderBy = 'id',
        orderDirection = 'DESC'
      } = options;

      // Build base query
      let query = `SELECT * FROM items WHERE id IN (${itemIds.join(',')})`;
      let queryParams = [];

      // Add ordering
      const validOrderColumns = ['id', 'name', 'author', 'submittime'];
      const validDirections = ['ASC', 'DESC'];

      if (validOrderColumns.includes(orderBy) && validDirections.includes(orderDirection.toUpperCase())) {
        query += ` ORDER BY ${orderBy} ${orderDirection.toUpperCase()}`;
      }

      // Add pagination if limit is specified
      if (limit) {
        query += ' LIMIT ?';
        queryParams.push(parseInt(limit));

        if (offset > 0) {
          query += ' OFFSET ?';
          queryParams.push(parseInt(offset));
        }
      }

      console.log('Executing query:', query);
      console.log('With params:', queryParams);

      const [rows] = await connection.execute(query, queryParams);

      // Get total count for pagination info
      let totalCount = rows.length;

      return {
        success: true,
        data: rows,
        pagination: limit ? {
          total: totalCount,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: (parseInt(offset) + parseInt(limit)) < totalCount
        } : null
      };
    } catch (error) {
      console.error('Database error:', error);
      return {
        success: false,
        message: 'Failed to retrieve items',
        error: error.message
      };
    } finally {
      connection.release();
    }
  }

  async getItemById(itemId) {
    const connection = await this.pool.getConnection();

    try {
      const [rows] = await connection.execute('SELECT * FROM items WHERE id = ?', [itemId]);

      if (rows.length === 1) {
        let d = rows[0];
        return {
          success: true,
          data: {
            id: d.id,
            author: d.author,
            name: d.name,
            size: [d.width, d.height],
            data: d.data,
            preview: d.preview,
            submittime: d.submittime
          }
        }
      }
    } catch (error) {
      console.error('Database error:', error);
      return {
        success: false,
        message: 'Failed to retrieve item',
        error: error.message
      };
    } finally {
      connection.release();
    }
  }

  async updateItem(itemId, itemData) {
    const connection = await this.pool.getConnection();

    try {
      const [existing] = await connection.execute('SELECT id FROM items WHERE id = ?', [itemId]);

      if (existing.length === 0) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      // Build dynamic update query
      const updateFields = [];
      const updateValues = [];

      if (itemData.author !== undefined) {
        updateFields.push('author = ?');
        updateValues.push(itemData.author);
      }

      if (itemData.name !== undefined) {
        updateFields.push('name = ?');
        updateValues.push(itemData.name);
      }

      if (itemData.width !== undefined) {
        updateFields.push('width = ?');
        updateValues.push(itemData.size[0]);
      }

      if (itemData.height !== undefined) {
        updateFields.push('height = ?');
        updateValues.push(itemData.size[1]);
      }

      if (itemData.data !== undefined) {
        updateFields.push('data = ?');
        updateValues.push(itemData.data);
      }

      if (itemData.preview !== undefined) {
        updateFields.push('preview = ?');
        updateValues.push(itemData.preview);
      }

      if (updateFields.length === 0) {
        return {
          success: false,
          message: 'No fields to update'
        };
      }

      updateValues.push(itemId); // for WHERE clause

      const query = `UPDATE items SET ${updateFields.join(', ')} WHERE id = ?`;
      const [result] = await connection.execute(query, updateValues);

      return {
        success: true,
        message: 'Item updated successfully',
        affectedRows: result.affectedRows
      };
    } catch (error) {
      console.error('Database error:', error);
      return {
        success: false,
        message: 'Failed to update item',
        error: error.message
      };
    } finally {
      connection.release();
    }
  }

  async deleteItem(itemId) {
    const connection = await this.pool.getConnection();

    try {
      const [result] = await connection.execute('DELETE FROM items WHERE id = >', [itemId]);

      if (result.affectedRows === 0) {
        return {
          success: false,
          message: 'Item not found'
        };
      }

      return {
        message: true,
        message: 'Item deleted successfully'
      };
    } catch (error) {
      console.error('Database error:', error);
      return {
        success: false,
        message: 'Failed to delete item',
        error: error.message
      };
    } finally {
      connection.release();
    }
  }

  // Close all connections
  async close() { await this.pool.end(); }
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('GET endpoints:');
  console.log(`http://localhost:${PORT}/api/allitems/:page`);
  console.log(`http://localhost:${PORT}/api/item/:id`);
  console.log(`http://localhost:${PORT}/api/items/:idarray/:page`);
  console.log(`http://localhost:${PORT}/api/search/:search_string/:page`);
  console.log('');
  console.log('POST endpoint:');
  console.log(`http://localhost:${PORT}/api/items`);
  console.log(databaseConfig);
});

// Export for testing purposes
module.exports = app;

