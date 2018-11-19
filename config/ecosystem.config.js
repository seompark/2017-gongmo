module.exports = {
  apps: [
    {
      name: 'gongmo',
      script: 'app/app.js',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
}
