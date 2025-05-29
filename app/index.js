// app.js - Simple Node.js API Server with GET and POST endpoints
const express = require('express');
//const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const config = require('./config.json');
const ItemService = require('./item');
const UserService = require('./user');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;
const limit = 30; //normally 30

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
//app.use(cors());

// app.options('/api/data', cors({
//   methods: ['GET', 'POST']
// }));

const databaseConfig = {
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
  waitForConnections: true,
  connectionLimit: 30,
  queueLimit: 20
};

/*
    Item API
*/

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
  console.log(`GET request received for /api/item/${id}`);

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
app.get('/api/searchitem/:search_string/:page', (req, res) => {
  const currPage = parseInt(req.params.page);
  const search_string = req.params.search_string;
  console.log(`GET request received for /api/searchitem/${search_string}/${currPage}`);
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

// POST API endpoint - Update item
app.post('/api/updateitem/:id', (req, res) => {
  const id = parseInt(req.params.id);
  console.log(`POST request received for /api/updateitem/${id}`);
  console.log('Request body:', req.body);

  const itemService = new ItemService(databaseConfig);
  itemService.updateItem(id, {
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

// POST API endpoint - Delete item
app.post('/api/deleteitem/:id', (req, res) => {
  const id = parseInt(req.params.id);
  console.log(`POST request received for /api/deleteitem/${id}`);
  console.log('Request body:', req.body);

  const itemService = new ItemService(databaseConfig);
  itemService.deleteItem(id, {
    author: req.body.author
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


/*
    User API
*/

// GET API endpoint - Retrieve all users
app.get('/api/allusers', (req, res) => {
  console.log(`GET request received for /api/allusers`);

  const userService = new UserService(databaseConfig);
  userService.getAllUsers({
    limit: 200,
    offset: 0,
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
          username: e.username,
          email: e.email,
          signuptime: e.signuptime
        });
      });

      res.status(201).json({
        success: result.success,
        data: data
      });
    }).catch(error => {
      console.error(error);

      res.status(201).json({
        success: false,
        data: error
      })
    })
});

// GET API endpoint - Retrieve specific user by ID
app.get('/api/user/:id', (req, res) => {
  const id = parseInt(req.params.id);
  console.log(`GET request received for /api/user/${id}`);

  const userService = new UserService(databaseConfig);
  userService.getUserById(id)
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

// GET API endpoint - Retrieve specific users by username or email
app.get('/api/searchuser/:search_string', (req, res) => {
  const search_string = req.params.search_string;
  console.log(`GET request received for /api/searchuser/${search_string}`);

  const userService = new UserService(databaseConfig);
  userService.getAllItems({
    limit: 200,
    offset: 0,
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
          username: e.username,
          email: e.email,
          signuptime: e.signuptime
        });
      });

      res.status(201).json({
        success: result.success,
        data: data
      });
    }).catch(error => {
      console.error(error);

      res.status(201).json({
        success: false,
        data: error
      });
    });
});

// GET API endpoint - Validate user by username and password
app.get('/api/loginuser/:username/:password', (req, res) => {
  const username = req.params.username;
  const password = req.params.password;
  console.log(`GET request received for /api/loginuser/${username}/password`);

  const userService = new UserService(databaseConfig);
  userService.userLogin(username, password)
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

// POST API endpoint - Create a new user
app.post('/api/users', (req, res) => {
  console.log('POST request received for /api/users');
  console.log('Request body:', req.body);

  const userService = new UserService(databaseConfig);

  userService.insertUser({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
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

// POST API endpoint - Update user
app.post('/api/updateuser/:id', (req, res) => {
  const id = parseInt(req.params.id);
  console.log(`POST request received for /api/updateuser/${id}`);
  console.log('Request body:', req.body);

  const userService = new UserService(databaseConfig);
  userService.updateUser(id, {
    currentPassword: req.body.currentPassword,
    newPassword: req.body.newPassword
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('GET endpoints:');
  console.log(`http://localhost:${PORT}/api/allitems/:page`);
  console.log(`http://localhost:${PORT}/api/item/:id`);
  console.log(`http://localhost:${PORT}/api/items/:idarray/:page`);
  console.log(`http://localhost:${PORT}/api/search/:search_string/:page`);
  console.log(`http://localhost:${PORT}/api/allusers`);
  console.log(`http://localhost:${PORT}/api/user/:id`);
  console.log(`http://localhost:${PORT}/api/search/:search_string`);
  console.log(`http://localhost:${PORT}/api/loginuser/:username/:password`);
  console.log('');
  console.log('POST endpoint:');
  console.log(`http://localhost:${PORT}/api/items`);
  console.log(`http://localhost:${PORT}/api/updateitem/:id`);
  console.log(`http://localhost:${PORT}/api/deleteitem/:id`);
  console.log(`http://localhost:${PORT}/api/users`);
  console.log(`http://localhost:${PORT}/api/updateuser/:id`);
  console.log(databaseConfig);
});

// Export for testing purposes
module.exports = app;