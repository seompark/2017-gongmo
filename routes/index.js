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

  app.get('/logout', (req, res) => {
    res.redirect('/')
  })

  app.get('/bbs', (req, res) => {
    res.render('bbs', {
      notice: [
        {
          title: '공지 테스트 첫번재 입니다.'
        },
        {
          title: '공지 테스트 두번째 입니다.'
        },
        {
          title: '공지사항 테스트 세번재 입니다!!'
        }
      ],

    })
  })
}
