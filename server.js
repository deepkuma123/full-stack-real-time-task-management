const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;
const secretKey = 'your-secret-key'; // Fallback to a default value if not set
const saltRounds = 10;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Load database password from environment variables
  database: 'kumar',
});


app.use(bodyParser.json());
app.use(express.static(__dirname));


let firstTimeServerStart = true;
// Middleware to redirect to login page on first server start
app.use((req, res, next) => {
  if (firstTimeServerStart) {
    firstTimeServerStart = false;
    return res.redirect('/login.html'); // Redirect to your login page route
  }
  next();
});

// Middleware for role-based access control
function checkRole(role) {
  return (req, res, next) => {
    const userRole = req.user.type;
    if (userRole === role) {
      next();
    } else {
      res.status(403).json({ message: 'Unauthorized' });
    }
  };
}

// API endpoint for the admin to assign tasks
app.post('/api/assign-task', authenticateToken, checkRole(1), (req, res) => {
  const { userId, task, description, status } = req.body;

  db.query('INSERT INTO task_list (user_id, task, description, status) VALUES (?, ?, ?, ?)', [userId, task, description, status], (err) => {
    if (err) {
      console.error('Error assigning task:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    res.status(201).json({ message: 'Task assigned successfully' });
  });
});


// Inside the /api/my-tasks endpoint
app.get('/api/my-tasks', authenticateToken, checkRole(2), (req, res) => {
  const userId = req.user.id; // Get the user's ID from the authenticated request

  db.query('SELECT task_list.id, task_list.task, task_list.description, task_list.status, users.firstname, users.lastname, task_list.user_id FROM task_list INNER JOIN users ON task_list.user_id = users.id', (err, results) => {
    if (err) {
      console.error('Error querying tasks:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    res.status(200).json(results);
  });
});

app.get('/api/all-tasks', authenticateToken, checkRole(1), (req, res) => {
  db.query('SELECT task_list.id, task_list.task, task_list.description, task_list.status, users.firstname, users.lastname, task_list.user_id FROM task_list INNER JOIN users ON task_list.user_id = users.id', (err, results) => {
    if (err) {
      console.error('Error querying tasks:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    res.status(200).json(results);
  });
});






// User registration
app.post('/api/signup', (req, res) => {
  const { firstname, lastname, email, password, type } = req.body;

  bcrypt.hash(password, saltRounds, (bcryptErr, hashedPassword) => {
    if (bcryptErr) {
      console.error('Error hashing the password:', bcryptErr);
      return res.status(500).json({ message: 'Internal server error' });
    }

    db.query('INSERT INTO users (firstname, lastname, email, password, type) VALUES (?, ?, ?, ?, ?)', [firstname, lastname, email, hashedPassword, type], (err) => {
      if (err) {
        console.error('Error inserting user into the database:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      res.status(201).json({ message: 'User created successfully' });
    });
  });
});

// User login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length === 1) {
      const user = results[0];

      bcrypt.compare(password, user.password, (bcryptErr, bcryptResult) => {
        if (bcryptErr || !bcryptResult) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate a new token for this user 
        const token = jwt.sign({ email, userId: user.id,  type: user.type }, secretKey, { expiresIn: '1h' });
        const isAdmin = user.type === 1; // Check if the user is an admin

        res.status(200).json({ token, isAdmin });
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });
});

// Add a new endpoint to fetch user data
app.get('/api/users', (req, res) => {
  db.query('SELECT id, firstname, lastname FROM users', (err, results) => {
      if (err) {
          console.error('Error querying the database for users:', err);
          return res.status(500).json({ message: 'Internal server error' });
      }
      res.status(200).json(results);
  });
});


// Middleware to authenticate requests using a JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Extract the token part after "Bearer"

  jwt.verify(token, secretKey, (err, user) => {
    console.log('Token:', token);
    console.log('Secret Key:', secretKey);
    console.log('User:', user);
    if (err) {
      console.error('Error verifying token:', err);
      return res.status(403).json({ message: 'Token is invalid' });
    }
    req.user = user; // Assign the user object to req.user
    next();
  });
}


// Add a new endpoint to fetch statuses
app.get('/api/statuses', (req, res) => {
  // Modify the query to retrieve statuses from your database
  db.query('SELECT status_id, status_name FROM statuses', (err, results) => {
      if (err) {
          console.error('Error querying the database for statuses:', err);
          return res.status(500).json({ message: 'Internal server error' });
      }
      res.status(200).json(results);
  });
});




app.get('/api/task/:taskId', authenticateToken, checkRole(2), (req, res) => {
  const taskId = req.params.taskId;
  const userId = req.user.userId;

  // Log the received taskId and userId for debugging
  console.log('Received taskId:', taskId);
  console.log('User ID from token:', userId);

  // Query the database to fetch the task and check if the user has permission
  db.query('SELECT * FROM task_list WHERE id = ? AND user_id = ?', [taskId, userId], (err, results) => {
    if (err) {
      console.error('Error fetching task:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    const task = results[0];
    res.status(200).json(task);
  });
});

// API endpoint to delete a task
app.delete('/api/delete-task/:taskId', authenticateToken, checkRole(1), (req, res) => {
  const taskId = req.params.taskId;

  // Check if the task exists and is assigned to the user
  db.query('DELETE FROM task_list WHERE id = ?', [taskId], (err, result) => {
    if (err) {
      console.error('Error deleting task:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  });
});






// API endpoint to edit a task
app.put('/api/edit-task/:taskId', authenticateToken, checkRole(1), (req, res) => {
  const taskId = req.params.taskId;
  const { userId, task, description, status } = req.body;
  const adminUserId = req.user.userId;

  // Check if the user is an admin
  if (req.user.type === 1) {
    // Admins can edit all tasks, so you can proceed without further checks
    updateTask(taskId, userId, task, description, status, res);
  } else {
    // Check if the user is authorized to edit this task
    db.query('SELECT user_id FROM task_list WHERE id = ?', [taskId], (err, results) => {
      if (err) {
        console.error('Error checking task ownership:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Task not found' });
      }

      const taskOwnerId = results[0].user_id; // User ID who owns the task

      if (adminUserId !== taskOwnerId) {
        return res.status(403).json({ message: 'Unauthorized to edit this task' });
      }

      // Update the task if the user is authorized
      updateTask(taskId, userId, task, description, status, res);
    });
  }
});

  function updateTask(taskId, userId, task, description, status, res) {
    // Modify the query to include user's name
    db.query('UPDATE task_list SET user_id = ?, task = ?, description = ?, status = ? WHERE id = ?', [userId, task, description, status, taskId], (updateErr, updateResult) => {
      if (updateErr) {
        console.error('Error editing task:', updateErr);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (updateResult.affectedRows === 0) {
        return res.status(404).json({ message: 'Task not found' });
      }

      // Fetch the user's name
      db.query('SELECT firstname, lastname FROM users WHERE id = ?', [userId], (nameErr, nameResults) => {
        if (nameErr) {
          console.error('Error fetching user name:', nameErr);
          return res.status(500).json({ message: 'Internal server error' });
        }

        const user = nameResults[0];
        const updatedTask = {
          id: taskId,
          task,
          description,
          status,
          user_id: userId,
          firstname: user.firstname,
          lastname: user.lastname
        };

        res.status(200).json({ message: 'Task edited successfully', task: updatedTask });
      });
    });
  }
  app.put('/api/edit-task-user/:taskId', authenticateToken, checkRole(2), (req, res) => {
    const taskId = req.params.taskId; // Task ID to update
    const { task, description, status } = req.body;
    const userId = req.user.userId;
    
    // Check if the user is an admin
    if (req.user.type === 1) {
      // Admins can edit all tasks, so you can proceed without further checks
      updateTaskuser(taskId, task, description, status, res);
    } else {
      // Check if the user is authorized to edit this task
      db.query('SELECT user_id FROM task_list WHERE id = ?', [taskId], (err, results) => {
        if (err) {
          console.error('Error checking task ownership:', err);
          return res.status(500).json({ message: 'Internal server error' });
        }
  
        if (results.length === 0) {
          return res.status(404).json({ message: 'Task not found' });
        }
  
        const taskOwnerId = results[0].user_id; // User ID who owns the task
        console.log(taskOwnerId)
        if (userId !== taskOwnerId) {
          return res.status(403).json({ message: 'Unauthorized to edit this task' });
        }
  
        // Update the task if the user is authorized
        updateTaskuser(taskId, task, description, status, res);
      });
    }
  });
  
  // Function to update the task
  function updateTaskuser(taskId, task, description, status, res) {
    db.query('UPDATE task_list SET task = ?, description = ?, status = ? WHERE id = ?', [task, description, status, taskId], (updateErr, updateResult) => {
      if (updateErr) {
        console.error('Error editing task:', updateErr);
        return res.status(500).json({ message: 'Internal server error' });
      }
  
      if (updateResult.affectedRows === 0) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      res.status(200).json({ message: 'Task edited successfully' });
    });
  }



// api for the user






app.get('/admin/dashboard',authenticateToken, checkRole(1), (req, res) => {
  res.json({ message: 'Admin dashboard' });
});

app.get('/user/profile', checkRole(2), (req, res) => {
  res.json({ message: 'User profile' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
