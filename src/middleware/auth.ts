import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../utils/secrets';
import User from '../models/User';

interface AuthenticatedRequest extends Request {
    user?: User;
}

export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Доступ запрещен' });

    try {
        const verified: any = jwt.verify(token, JWT_SECRET_KEY!);
        const user = await User.findOne({ where: { id: verified.id } });
        if (!user) throw new Error('Пользователь не найден');
        req.user = user;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Не верный токен' });
    }
};
