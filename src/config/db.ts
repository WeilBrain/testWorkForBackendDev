import { Sequelize } from 'sequelize';
import { DB_HOST, DB_USER, DB_PASS, DB_NAME } from '../utils/secrets';

const sequelize = new Sequelize(DB_NAME!, DB_USER!, DB_PASS!, {
    host: DB_HOST,
    dialect: 'mysql'
});

export default sequelize;
