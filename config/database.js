const { Sequelize } = require('sequelize');
const config = require('./config');

let sequelize = null;

const initializeDatabase = async () => {
  try {
    // Create Sequelize instance
    sequelize = new Sequelize(config.db, config.dbuser, config.dbpass, {
      host: config.dbhost,
      dialect: 'postgres',
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });

    // Test connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    return sequelize;
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
    // In development, create an in-memory SQLite database as fallback
    if (process.env.NODE_ENV === 'development') {
      console.log('Falling back to SQLite in-memory database...');
      sequelize = new Sequelize('sqlite::memory:', {
        logging: false
      });
      await sequelize.authenticate();
      console.log('SQLite connection established successfully.');
      return sequelize;
    }
    throw error;
  }
};

module.exports = {
  initializeDatabase,
  getSequelize: () => sequelize
};