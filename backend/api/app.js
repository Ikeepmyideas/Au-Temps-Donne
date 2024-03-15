const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const cookieParser = require('cookie-parser'); 
const beneficiaryRoutes = require('./routes/beneficiaryRoutes');
const defaultRoute = require('./routes/defaultRoutes');
const corsMiddleware = require('./middleware/cors');
const app = express();
const corsOptions = {
    origin: 'http://localhost',
    credentials: true
};

app.use(cors(corsOptions));
app.use(corsMiddleware);
app.use(cookieParser());
app.use(bodyParser.json());
app.use('/api', beneficiaryRoutes);
app.use('/', defaultRoute);

module.exports = app;
