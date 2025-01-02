const fs = require("fs");
const path = require("path");
const { initializeDatabase } = require("../config/database");
const db = {};

const initializeModels = async () => {
  try {
    const sequelize = await initializeDatabase();
    
    // Load models
    fs.readdirSync(__dirname)
      .filter((file) => file.indexOf(".") !== 0 && file !== "index.js")
      .forEach((file) => {
        const model = require(path.join(__dirname, file))(sequelize, sequelize.Sequelize.DataTypes);
        db[model.name] = model;
      });

    // Initialize associations
    Object.keys(db).forEach((modelName) => {
      if ("associate" in db[modelName]) {
        db[modelName].associate(db);
      }
    });

    db.sequelize = sequelize;
    db.Sequelize = sequelize.Sequelize;

    // Sync database
    await sequelize.sync();
    console.log('Database synced successfully');
    
    return db;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
};

module.exports = initializeModels();