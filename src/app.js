const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const chatRoutes = require('./routes/chatRoutes');
const publicRoutes = require('./routes/publicRoutes');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// API
app.use('/api/chat', chatRoutes);
app.use('/api', publicRoutes);

module.exports = app;
