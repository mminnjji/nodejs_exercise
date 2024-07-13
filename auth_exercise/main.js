const express = require('express') 
// 'express' 모듈을 불러와서 상수 'express'에 할당합니다. 
// Express는 웹 서버 및 애플리케이션 프레임워크로 사용됩니다.

const session = require('express-session') 
// 'express-session' 모듈을 불러와서 상수 'session'에 할당합니다. 
// Express 애플리케이션에서 세션을 관리하기 위해 사용됩니다.

const bodyParser = require('body-parser'); 
// 'body-parser' 모듈을 불러와서 상수 'bodyParser'에 할당합니다. 
// 요청 본문을 파싱하여 req.body에 데이터를 쉽게 접근할 수 있게 합니다.

const FileStore = require('session-file-store')(session) 
// 'session-file-store' 모듈을 불러와서 'FileStore'에 할당하고, 
// 이를 통해 세션 데이터를 파일에 저장할 수 있게 합니다. 
// 'session' 모듈을 인자로 받아 초기화합니다.

var authRouter = require('./lib_login/auth'); 
// './lib_login/auth' 모듈을 불러와서 'authRouter'에 할당합니다. 
// 이 모듈은 인증 라우팅을 처리합니다.

var authCheck = require('./lib_login/authCheck.js'); 
// './lib_login/authCheck.js' 모듈을 불러와서 'authCheck'에 할당합니다. 
// 이 모듈은 사용자 인증을 확인하는 기능을 포함합니다.

var template = require('./lib_login/template.js'); 
// './lib_login/template.js' 모듈을 불러와서 'template'에 할당합니다. 
// HTML 템플릿을 생성하는 기능을 포함합니다.

const app = express() 
// Express 애플리케이션 인스턴스를 생성하여 'app'에 할당합니다.

const port = 3000 
// 서버가 실행될 포트를 지정합니다.

app.use(bodyParser.urlencoded({ extended: false })); 
// URL 인코딩된 본문 데이터를 파싱하기 위해 body-parser 미들웨어를 설정합니다.

app.use(session({
  secret: '~~~',	// 세션 암호화를 위한 비밀 키
  resave: false,  // 세션이 수정되지 않더라도 세션을 다시 저장할지 여부
  saveUninitialized: true,  // 초기화되지 않은 세션을 저장할지 여부
  store: new FileStore(),  // 세션 저장소로 FileStore 사용
}))

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

// 인증 라우터를 설정합니다.
app.use('/auth', authRouter);

app.get('/main', (req, res) => {
  if (!authCheck.isOwner(req, res)) {  
    res.redirect('/auth/login');  
    return false;
  }
  var html = template.HTML('Welcome',
    `<hr>
        <h2>메인 페이지에 오신 것을 환영합니다</h2>
        <p>로그인에 성공하셨습니다.</p>`,
    authCheck.statusUI(req, res)
  );
  // template 모듈의 HTML 메소드를 사용하여 HTML 페이지를 생성합니다.
  res.send(html);
  // 생성된 HTML을 클라이언트에 전송합니다.
})

app.listen(port, () => {
  // 서버를 지정된 포트에서 실행합니다.
  console.log(`Example app listening on port ${port}`)
  // 서버가 시작되면 콘솔에 메시지를 출력합니다.
})
