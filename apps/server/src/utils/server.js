import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { getReasonPhrase } from 'http-status-codes';

import routerV1 from '../routes/routerV1.js';
import errorHandler from '../middlewares/errorHandler.js';
import swaggerDocs from './swagger.js';
import { ENV } from './env.js';

export function createServer() {
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(helmet());
    app.use(cors());
    app.use(morgan('dev'));
    app.use(compression());

    app.use('/api/v1', routerV1);

    swaggerDocs(app, ENV.SERVER_PORT);

    app.use((_, res) => {
        res.status(404).send(getReasonPhrase(404));
    });

    app.use(errorHandler);

    return app;
}