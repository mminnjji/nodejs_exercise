const express = require('express') 
// express 모듈 호출
const session = require('express-session') 

const bodyParser = require('body-parser'); 

const FileStore = require('session-file-store')(session) 
// 'session-file-store' 모듈을 불러와서 'FileStore'에 할당하고, 
// 이를 통해 세션 데이터를 파일에 저장할 수 있게 합니다. 
// 'session' 모듈을 인자로 받아 초기화합니다.

var authRouter = require('./lib_login/auth'); 
// 인증모듈

var authCheck = require('./lib_login/authCheck.js'); 
// autocheck session을 기억하고 반환

var template = require('./lib_login/template.js');

var content = require('./contents/wp.js'); 
// html 템플릿 호출

const app = express() 
const port = 3000  // 서버가 실행될 포트를 지정

app.use(bodyParser.urlencoded({ extended: false }));  // URL 인코딩된 본문 데이터를 파싱하기 위해 body-parser 미들웨어 설정

app.use(session({
  secret: '~~~',
  resave: false,
  saveUninitialized: false,
  store: new FileStore(),
  cookie: { secure: false } // 개발 환경에서는 secure를 false로 설정, 배포 시 true로 변경
}));


app.get('/', (req, res) => {
  if (!authCheck.isOwner(req, res)) {  
    // authCheck 모듈의 isOwner 메소드를 호출하여 사용자가 인증되었는지 확인합니다.
    res.redirect('/auth/login');  
    // 인증되지 않았다면 로그인 페이지로 리디렉션합니다.
    return false;
  } else { 
    res.redirect('/main');
    // 인증되었다면 메인 페이지로 리디렉션합니다.
    return false;
  }
})

app.use('/wp', content);

app.get('/main', (req, res) => {
  if (!authCheck.isOwner(req, res)) {  
    res.redirect('/auth/login');  
    return false;
  }
  var html = template.HTML('Welcome',
    `<hr>
        <h2>메인 페이지에 오신 것을 환영합니다</h2>
        <p>로그인에 성공하셨습니다.</p>
        <p><a href="/wp/write" class="btn">글 작성하기</a></p>
        `,
    authCheck.statusUI(req, res)
  );
  res.send(html);
});



app.listen(port, () => {
  // 서버를 지정된 포트에서 실행합니다.
  console.log(`Example app listening on port ${port}`)
  // 서버가 시작되면 콘솔에 메시지를 출력합니다.
})
