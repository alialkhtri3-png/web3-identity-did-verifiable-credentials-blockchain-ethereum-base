module.exports = {
  apps: [
    {
      name: "sovereign-identity-engine-v12",
      script: "server.js",
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 3001
      }
    }
  ]
}
