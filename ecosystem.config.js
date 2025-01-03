module.exports = {
    apps : [{
      name: "Payments.CacheTechs",
      script: "./bin/www",
      env: {
        NODE_ENV: "production",
        PORT: 3999,
      }
    }]
};