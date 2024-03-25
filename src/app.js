import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import { pkgConfig, envConfig } from '#configs/index';
import { errorMiddleware, morganMiddleware } from '#middlewares/index';
import apiRoutes from './api';
import { jsend } from '#utils/index';

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization'],
};

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '20MB' }));
app.use(express.urlencoded({ extended: false, limit: '50MB' }));
app.use(cookieParser());
// app.use(loggerMiddleware);
app.use(morganMiddleware);
app.use(jsend());

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.use('/api', apiRoutes);
app.get('/', (req, res) => {
  res.jsend.success({
    status: 'active',
    info: `${pkgConfig.APP_NAME} backend api server. Please visit health route for more information.`,
    hostname: envConfig.HOSTNAME,
  });
});

app.use((err, req, res, next) => {
  errorMiddleware(err, req, res, next);
});

export default app;
