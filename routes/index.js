module.exports = app => {
  const userMock = {
    user: {
      name: 'alpaca',
      fullName: '박성민',
      isAnonymous: false
    }
  }
  app.get('/', (req, res) => {
    res.render('index', userMock)
  })

  app.get('/submit', (req, res) => {
    res.render('submit', userMock)
  })
}
