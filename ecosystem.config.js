module.exports = {
    apps : [{
      name: "Cache-Pay-GateWay",
      script: "./bin/www",
      env: {
        NODE_ENV: "production",
        PORT: 3666,
      }
    },
    {
        name: "Cache-Pay-GateWay-Cron",
        script: "./cronserver.js",
        env: {
            NODE_ENV: "production",
        }
    }]
};