const path = require("path");
const rootPath = path.normalize(__dirname + "/..");
const env = process.env.NODE_ENV || "development";

const config = {
    development: {
        root: rootPath,
        app: {
            name: "checkout.cachetechs",
        },
        port: process.env.PORT || 3010,
        dbhost: process.env.DBHOST || "localhost",
        db: process.env.DBNAME || "CachePay",
        dbuser: process.env.DBUSER || "postgres",
        dbpass: process.env.DBPASS || "pass@1234",
        siteurl: "http://localhost:3000"
    },
    production: {
        root: rootPath,
        app: {
            name: "checkout.cachetechs",
        },
        port: process.env.PORT || 3015,
        dbhost: process.env.DBHOST || "localhost",
        db: process.env.DBNAME || "CachePay",
        dbuser: process.env.DBUSER || "postgres",
        dbpass: process.env.DBPASS || "kejQwtVt7CAiGI5E6zsn8rj0K3QdKuD1",
        siteurl: "https://checkout.cachetechs.com"
    },
};

 


module.exports = config[env];
