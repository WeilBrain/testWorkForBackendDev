import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import User from '../models/User';
import logger from '../config/logger';
import { JWT_SECRET_KEY } from '../utils/secrets';

export const register = async (req: Request, res: Response) => {
    const { firstName, lastName, email, password, gender } = req.body;

    if (!firstName || !lastName || !email || !password || !gender) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await User.create({ firstName, lastName, email, password: hashedPassword, gender, registrationDate: new Date() });
        logger.info(`User registered: ${email}`);
        res.status(201).json(user);
    } catch (error) {
        logger.error(`Registration error for email: ${email} - ${(error as Error).message}`);
        res.status(400).json({ error: 'Email already exists' });
    }
};


export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user.id }, JWT_SECRET_KEY!, { expiresIn: '2h' });
        logger.info(`User logged in: ${email}`);
        res.json({ token });
    } else {
        logger.error(`Login failed for email: ${email}`);
        res.status(401).json({ error: 'Invalid email or password' });
    }
};

export const getProfile = async (req: Request, res: Response) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            logger.info(`Profile retrieved for user ID: ${req.params.id}`);
            res.json({ user });
        } else {
            logger.warn(`Profile not found for user ID: ${req.params.id}`);
            res.status(404).json({ error: 'Profile not found' });
        }
    } catch (error) {
        logger.error(`Error retrieving profile for user ID: ${req.params.id} - ${(error as Error).message}`);
        res.status(500).json({ error: 'Error retrieving profile' });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    const { firstName, lastName, gender, photo } = req.body;
    try {
        await User.update({ firstName, lastName, gender, photo }, { where: { id: req.params.id } });
        const user = await User.findByPk(req.params.id);
        if (user) {
            logger.info(`Profile updated for user ID: ${req.params.id}`);
            res.json({ user });
        } else {
            logger.warn(`Profile not found for update for user ID: ${req.params.id}`);
            res.status(404).json({ error: 'Profile not found' });
        }
    } catch (error) {
        logger.error(`Error updating profile for user ID: ${req.params.id} - ${(error as Error).message}`);
        res.status(500).json({ error: 'Error updating profile' });
    }
};

export const getAllProfiles = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    try {
        const users = await User.findAndCountAll({
            limit,
            offset,
            order: [['registrationDate', 'DESC']],
        });

        logger.info(`Profiles retrieved for page: ${page}`);
        res.json({
            data: users.rows,
            total: users.count,
            page,
            pages: Math.ceil(users.count / limit),
        });
    } catch (error) {
        logger.error(`Error retrieving profiles for page: ${page} - ${(error as Error).message}`);
        res.status(500).json({ error: 'Error retrieving profiles' });
    }
};
