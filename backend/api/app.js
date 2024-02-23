const express = require('express');
const bodyParser = require('body-parser');
const beneficiaryRoutes = require('./routes/beneficiaryRoutes');
const defaultRoute = require('./routes/defaultRoutes');
const corsMiddleware = require('./middleware/cors');
const app = express();

module.exports = app;

app.use(corsMiddleware);
app.use(bodyParser.json());

app.use('/api', beneficiaryRoutes);
app.use('/', defaultRoute);

module.exports = app;
