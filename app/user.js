const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
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

class UserService {
  constructor(dbConfig) {
    this.pool = mysql.createPool(dbConfig);
  }

  async insertUser(userData) {
    const connection = await this.pool.getConnection();

    try {
      const [existing] = await connection.execute('SELECT id FROM users WHERE username = ?', [userData.username]);

      if (existing.length > 0) {
        return {
          success: false,
          message: 'User already exists',
          existingId: existing[0].id
        };
      }

      const [result] = await connection.execute('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [userData.username, userData.password, userData.email]);

      return {
        success: true,
        message: 'User created successfully',
        id: result.insertId
      }
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  async getAllUsers(options = {}) {
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
      let query = 'SELECT id, username, email, signuptime FROM users';
      let queryParams = [];

      // Add search filter if provided
      if (search) {
        query += ' WHERE LOWER(username) LIKE ? OR LOWER(email) LIKE ?';
        const searchTerm = `%${search}%`;
        queryParams.push(searchTerm, searchTerm);
      }

      // Add ordering
      const validOrderColumns = ['id', 'username', 'email'];
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
        let countQuery = 'SELECT COUNT(*) as total FROM users';
        let countParams = [];

        if (search) {
          countQuery += ' WHERE username LIKE ? OR email LIKE ?';
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
        message: 'Failed to retrieve users',
        error: error.message
      };
    } finally {
      connection.release();
    }
  }

  async getUserById(userId) {
        const connection = await this.pool.getConnection();

        try {
            const [rows] = await connection.execute('SELECT * FROM users WHERE id = ?', [userId]);

            if (rows.length === 1) {
                let d = rows[0];
                return {
                    success: true,
                    data: {
                        id: d.id,
                        username: d.username,
                        email: d.email,
                        signuptime: d.signuptime
                    }
                }
            }
        } catch (error) {
            console.error('Database error:', error);
            return {
                success: false,
                message: 'Failed to retrieve user',
                error: error.message
            };
        } finally {
            connection.release();
        }
    }

    async updateUser(userId, userData) {
        const connection = await this.pool.getConnection();

        try {
            const [existing] = await connection.execute('SELECT id FROM users WHERE id = ?', [userId]);

            if (existing.length === 0) {
                return {
                    success: false,
                    message: 'User not found'
                };
            }

            // Build dynamic update query
            const updateFields = [];
            const updateValues = [];

            if (userData.username !== undefined) {
                updateFields.push('username = ?');
                updateValues.push(userData.username);
            }

            if (userData.password !== undefined) {
                updateFields.push('password = ?');
                updateValues.push(userData.password);
            }

            if (userData.email !== undefined) {
                updateFields.push('email = ?');
                updateValues.push(userData.email);
            }

            if (updateFields.length === 0) {
                return {
                    success: false,
                    message: 'No fields to update'
                };
            }

            updateValues.push(userId); // for WHERE clause

            const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
            const [result] = await connection.execute(query, updateValues);

            return {
                success: true,
                message: 'User updated successfully',
                affectedRows: result.affectedRows
            };
        } catch (error) {
            console.error('Database error:', error);
            return {
                success: false,
                message: 'Failed to update User',
                error: error.message
            };
        } finally {
            connection.release();
        }
    }

}

module.exports = UserService;