import express, { Request, Response, NextFunction } from 'express';
import sequelize from './config/db';
import userRoutes from './routes/userRoutes';
import logger from './config/logger';
import { config } from 'dotenv';

config(); // Загрузка переменных окружения из .env

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(userRoutes);

// Middleware для логирования всех запросов
app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

// Middleware для обработки ошибок
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(`${err.status || 500} - ${err.message}`);
    res.status(err.status || 500).json({ error: err.message });
});

sequelize.sync().then(() => {
    app.listen(port, () => {
        logger.info(`Server is running on http://localhost:${port}`);
    });
});
