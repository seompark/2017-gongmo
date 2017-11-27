module.exports = {
  apps: [
    {
      name: 'gongmo',
      script: 'index.js',
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
