module.exports = app => {
  const userMock = {
    user: {
      name: 'alpaca',
      fullName: '박성민',
      isAnonymous: false
    }
  }

  const bbsMock = {
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
    posts: [
      {
        title: '일반 포스트 첫번째 입니다. >_<'
      },
      {
        title: '일반 포스트 두번째 입니다. >_<'
      },
      {
        title: '일반 포스트 세번째 입니다. >_<'
      }
    ]
  }

  app.get('/', (req, res) => {
    res.render('index', userMock)
  })

  app.get('/submit', (req, res) => {
    res.render('submit', userMock)
  })

  app.get('/download', (req, res) => {

  })

  app.get('/login', (req, res) => {
    if (req.user) {
      res.redirect(`/${req.params.redirect || ''}`)
    }
    req.session.redirectTo = req.params.redirect
    res.render('login')
  })

  app.post('/login', (req, res, next) => {
    if (req.user) {
      return next()
    }
  })

  app.get('/logout', (req, res) => {
    res.redirect('/')
  })

  app.get('/bbs', (req, res) => {
    res.render('bbs', bbsMock)
  })
}
