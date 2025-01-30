const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');
const {getErrorResponse} = require("./services/api/responseService");
require('dotenv').config();

const app = express();

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requêtes max par IP par fenêtre
    message: 'Too many requests from this IP, please try again after 15 minutes',
    headers: true,
});

app.use(cors());
app.use(apiLimiter);

app.use(bodyParser.json());

// ROUTES
const authRoutes = require('./routes/authRoutes');
const spotifyAuthRoutes = require('./routes/spotifyAuthRoutes');
const userRoutes = require('./routes/userRoutes');
const groupRoutes = require('./routes/groupRoutes');

app.use('/', authRoutes);
app.use('/spotify', spotifyAuthRoutes);
app.use('/users', userRoutes);
app.use('/groups', groupRoutes);

// Swagger
app.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 404
app.use((req, res) => {
    getErrorResponse(res, 404, "URL does not exist")
})

module.exports = app;
