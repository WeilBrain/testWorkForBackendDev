import { config } from 'dotenv';

config();

const {
    DB_HOST,
    DB_USER,
    DB_PASS,
    DB_NAME,
    JWT_SECRET_KEY,
} = process.env;

const requiredCredentials = [
    'DB_HOST',
    'DB_USER',
    'DB_NAME',
    'JWT_SECRET_KEY',
];

requiredCredentials.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
});

if (typeof DB_PASS === 'undefined') {
    throw new Error('Missing required environment variable: DB_PASS');
}

export {
    DB_HOST,
    DB_USER,
    DB_PASS,
    DB_NAME,
    JWT_SECRET_KEY,
};
