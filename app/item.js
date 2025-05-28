const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

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
            const [existing] = await connection.execute('SELECT * FROM items WHERE id = ?', [itemId]);

            if (existing.length === 0) {
                return {
                    success: false,
                    message: 'Item not found'
                };
            }

            // Build dynamic update query
            const updateFields = [];
            const updateValues = [];

            // if (itemData.author !== undefined) {
            //     updateFields.push('author = ?');
            //     updateValues.push(itemData.author);
            // }

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

module.exports = ItemService;