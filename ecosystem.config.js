module.exports = {
  apps: [
    {
      name: 'gongmo',
      script: 'src/app.js',
      watch: false,
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
}
