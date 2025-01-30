const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const {getErrorResponse} = require("./services/api/responseService");
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const app = express();

app.use(cors());
app.use(bodyParser.json());
// TODO : Check s'il marche ?
//  Rate Limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requêtes max par IP par fenêtre
    message: 'Too many requests from this IP, please try again after 15 minutes',
    headers: true,
});
app.use(apiLimiter);

// ROUTES
const authRoutes = require('./routes/authRoutes');
const tracksRoutes = require('./routes/tracksRoutes');

app.use('/auth', authRoutes);
app.use('/tracks', tracksRoutes);
// TODO : Swagger
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 404
app.use((req, res) => {
    getErrorResponse(res, 404, "URL does not exist")
})

module.exports = app;
