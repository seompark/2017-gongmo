const path = require('path')
const auth = require('../src/auth')

module.exports = app => {
  const bbsMock = {
    notice: [
      {
        title: '공지 테스트 첫번재입니다.',
        content: '내용내용 내용 내용 내용내용은 내용이다. 이건 내용이다. 내용이야.',
        date: new Date()
      },
      {
        title: '공지 테스트 두번째입니다.',
        content: '이건 좀 긴 내용이야 아주 길어 너무 길어서 나도 몰라 그냥 길어 기니까 내용이지 내용은 길다 바보들아 내용은 길어 로렘 입숨 끼요옷 들아 내용은 길어 로렘 입숨 끼요옷 뿌와앙ㅇ들아 내용은 길어 로렘 입숨 끼요옷 뿌와앙ㅇ들아 내용은 길어 로렘 입숨 끼요옷 뿌와앙ㅇ들아 내용은 길어 로길어 로렘 입숨 끼요옷 뿌와앙ㅇ들아 내용은 길어 로길어 로렘 입숨 끼요옷 뿌와앙ㅇ들아 내용은 길어 로길어 로렘 입숨 끼요옷 뿌와앙ㅇ들아 내용은 길어 로길어 로렘 입숨 끼요옷 뿌와앙ㅇ들아 내용은 길어 로렘 입숨 끼요옷 뿌와앙ㅇ뿌와앙ㅇ!!',
        date: new Date()
      },
      {
        title: '공지사항 테스트 세번째입니다!!',
        content: '',
        date: new Date()
      }
    ],
    posts: [
      {
        title: '일반 포스트 첫번째입니다. >_<'
      },
      {
        title: '일반 포스트 두번째입니다. >_<'
      },
      {
        title: '일반 포스트 세번째입니다. >_<'
      }
    ]
  }

  app.route('/hassan')
    .get((req, res) => {
      console.log(req.query)
      if (!(req.query.secret === 'gkttksdlek')) return res.end('asdf')
      req.session.user = {
        id: '1269',
        username: 'a1p4ca',
        email: 'sm@murye.io',
        name: '박성민',
        admin: true
      }
      res.redirect('/')
    })

  app.route('/')
    .get((req, res) => {
      res.render('index', {
        user: req.session.user,
        notices: bbsMock.notice
      })
    })

  app.route('/submit')
    .get(
      auth.verifyPermission,
      (req, res) => {
        res.render('submit', {
          user: req.session.user
        })
      }
    )
    .post((req, res) => {

    })

  app.route('/download')
    .get(
      auth.verifyPermission,
      (req, res) => {
        res.sendFile(path.resolve('../', 'contents/file/download.hwp'))
      }
    )

  app.route('/login')
    .get((req, res) => {
      if (req.session.user) {
        return res.redirect(`/${req.query.redirect || ''}`)
      }
      req.session.redirectTo = req.query.redirect || '/'
      res.render('login')
    })
    .post((req, res) => {
      auth.identifyUser(req.body.id, req.body.password)
        .then(result => {
          if (!result) {
            req.flash('error', '잘못된 아이디 혹은 비밀번호입니다.')
            return res.redirect('/login')
          }
          req.session.user = result
          res.redirect(req.session.redirectTo)
        })
        .catch(console.error)
    })

  app.route('/logout')
    .post((req, res) => {
      req.session.user = null
      res.redirect('/')
    })

  app.route('/bbs')
    .get((req, res) => {
      res.render('bbs', bbsMock)
    })

  require('./admin')(app)
}
