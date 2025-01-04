const path = require("path");
const rootPath = path.normalize(__dirname + "/..");
const env = process.env.NODE_ENV || "development";

const config = {
    development: {
        root: rootPath,
        app: {
            name: "payments.cachetechs",
        },
        port: process.env.PORT,
        dbhost: process.env.DBHOST,
        db: process.env.DBNAME,
        dbuser: process.env.DBUSER,
        dbpass: process.env.DBPASS,
        siteurl: process.env.SITEURL 
    },
    production: {
        root: rootPath,
        app: {
            name: "payments.cachetechs",
        },
        port: process.env.PORT,
        dbhost: process.env.DBHOST,
        db: process.env.DBNAME,
        dbuser: process.env.DBUSER,
        dbpass: process.env.DBPASS,
        siteurl: process.env.SITEURL 
    },
};

 


module.exports = config[env];
