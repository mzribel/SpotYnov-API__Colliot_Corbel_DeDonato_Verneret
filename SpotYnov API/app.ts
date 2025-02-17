import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './docs/swagger.json';
import { errorMiddleware } from "./middlewares/error.middleware";
import { ApiError } from "./utils/error.util";
require('express-async-errors');
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
import authRoutes from './routes/auth.routes';
import spotifyAuthRoutes from './routes/spotify.auth.routes';
import userRoutes from './routes/user.routes';
import groupRoutes from './routes/group.routes';

app.use('/', authRoutes);
app.use('/spotify', spotifyAuthRoutes);
app.use('/users', userRoutes);
app.use('/groups', groupRoutes);
// Swagger
app.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// 404
app.use((req:Request, res:Response):void => {
    throw new ApiError(404, "Not Found");
})

// @ts-ignore
app.use(errorMiddleware)
export default app;
