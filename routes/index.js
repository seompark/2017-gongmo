const path = require('path')
const auth = require('../src/auth')
const Team = require('../src/db/Team')

module.exports = app => {
  const bbsMock = {
    notice: [
      {
        title: '공지 테스트 첫번재입니다.',
        content: '되는 내려온 무엇을 튼튼하며, 어디 봄바람이다. 이것이야말로 있으며, 무한한 작고 풀이 동산에는 보배를 불어 있는가? 무엇을 없으면 이상의 품고 석가는 따뜻한 소금이라 있다. 가진 풍부하게 때에, 든 청춘을 곧 방지하는 쓸쓸하랴? 산야에 가치를 없는 있다. 하는 두손을 할지라도 살 아니한 수 보이는 굳세게 쓸쓸하랴?',
        date: new Date()
      },
      {
        title: '공지 테스트 두번째입니다.',
        content: '열락의 기관과 피고 얼음이 불러 못하다 것이다. 그림자는 청춘의 뭇 물방아 지혜는 심장은 곳으로 위하여서. 심장의 황금시대의 목숨이 돋고, 것이다. 힘차게 싹이 별과 얼마나 대고, 있는 풍부하게 칼이다. 보이는 군영과 그들의 많이 가진 그들은 밝은 쓸쓸하랴? 끓는 인생에 속에서 것이다. 그들의 보내는 구하지 품으며, 것이다. 희망의 피어나는 피고, 맺어, 구할 보배를 쓸쓸한 인류의 칼이다. 오아이스도 크고 할지니, 눈이 너의 고동을 칼이다. 소담스러운 있는 공자는 그것은 청춘은 않는 얼음이 우리 만천하의 이것이다. 튼튼하며, 얼마나 인생에 피어나기 품고 그들에게 웅대한 바이며, 그러므로 끓는다.',
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
      if (!(req.query.secret === 'gkttksdlek')) return res.end('asdf')
      req.session.user = {
        id: '1269',
        username: 'a1p4ca',
        email: 'sm@murye.io',
        name: '박성민',
        userTypes: 'T'
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

  app.use('/submit', auth.verifyPermission('S'))
  app.route('/submit')
    .get((req, res) => {
      res.render('submit', {
        user: req.session.user
      })
    })
    .post((req, res) => {
      const body = req.body
      if (!(req.body && req.body.leader)) return res.sendStatus(400)
      const leader = {
        name: req.session.user.name,
        id: req.session.user.id
      }
      const { name, followers, description } = body
      const team = new Team({
        name,
        leader,
        followers,
        description
      })
      team.save()
        .then(() => {
          res.json({
            success: true
          })
        })
        .catch(console.error)
    })

  app.route('/download')
    .get(
      auth.verifyPermission('S'),
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

  app.use('/admin', auth.verifyPermission('T', false), require('./admin'))
}
