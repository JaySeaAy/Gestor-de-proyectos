const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = 'your-secret-key'; // In a real application, use an environment variable

app.use(bodyParser.json());
app.use(express.static('public'));

// In-memory storage (replace with a database in a real application)
let users = [];
let projects = [];
let tasks = [];

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    req.userId = decoded.id;
    next();
  });
};

// Auth routes
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);
  const user = { id: users.length + 1, name, email, password: hashedPassword };
  users.push(user);
  res.status(201).send({ message: 'User registered successfully' });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(404).send('User not found');
  
  const passwordIsValid = bcrypt.compareSync(password, user.password);
  if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
  
  const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: 86400 }); // expires in 24 hours
  res.status(200).send({ auth: true, token });
});

// Project routes
app.get('/api/projects', verifyToken, (req, res) => {
  res.json(projects);
});

app.post('/api/projects', verifyToken, (req, res) => {
  const { name, description, deadline } = req.body;
  const project = { id: projects.length + 1, name, description, deadline };
  projects.push(project);
  res.status(201).json(project);
});

// Task routes
app.get('/api/tasks/:projectId', verifyToken, (req, res) => {
  const projectTasks = tasks.filter(task => task.projectId === parseInt(req.params.projectId));
  res.json(projectTasks);
});

app.post('/api/tasks', verifyToken, (req, res) => {
  const { projectId, name, description, deadline, status } = req.body;
  const task = { id: tasks.length + 1, projectId, name, description, deadline, status };
  tasks.push(task);
  res.status(201).json(task);
});

app.put('/api/tasks/:taskId', verifyToken, (req, res) => {
  const taskId = parseInt(req.params.taskId);
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  if (taskIndex === -1) return res.status(404).send('Task not found');
  
  tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
  res.json(tasks[taskIndex]);
});

// Serve the main HTML file for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});