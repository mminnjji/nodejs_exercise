var express = require('express'); 
// 'express' 모듈을 불러와서 'express'에 할당합니다. 
// Express는 웹 서버 및 애플리케이션 프레임워크로 사용됩니다.

var router = express.Router(); 
// 'express.Router'를 호출하여 새로운 라우터 객체를 생성합니다. 
// 이 라우터는 여러 라우트들을 그룹화하여 모듈화할 수 있게 해줍니다.

var template = require('./template.js'); 
// './template.js' 모듈을 불러와서 'template'에 할당합니다. 
// HTML 템플릿을 생성하는 기능을 포함합니다.

var db = require('../db.js'); 
// './db' 모듈을 불러와서 'db'에 할당합니다. 
// 데이터베이스와의 상호작용을 위한 기능을 포함합니다.

// 로그인 화면
router.get('/login', function (request, response) {
    var title = '로그인';
    var html = template.HTML(title,`
            <h2>로그인</h2>
            <form action="/auth/login_process" method="post">
            <p><input class="login" type="text" name="username" placeholder="아이디"></p>
            <p><input class="login" type="password" name="pwd" placeholder="비밀번호"></p>
            <p><input class="btn" type="submit" value="로그인"></p>
            </form>            
            <p>계정이 없으신가요?  <a href="/auth/register">회원가입</a></p> 
        `, '');
    response.send(html);
    // 로그인 화면을 렌더링하여 클라이언트에 전송합니다.
});

router.post('/login_process', function (request, response) {
    var username = request.body.username;
    var password = request.body.pwd;
    if (username && password) {             
        db.query('SELECT * FROM usertable WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {       
                request.session.is_logined = true;      
                request.session.username = username; // 세션에 username 저장
                request.session.save(function () {
                    response.redirect(`/`);
                });
            } else {              
                response.send(`<script type="text/javascript">alert("로그인 정보가 일치하지 않습니다."); 
                document.location.href="/auth/login";</script>`);    
            }            
        });

    } else {
        response.send(`<script type="text/javascript">alert("아이디와 비밀번호를 입력하세요!"); 
        document.location.href="/auth/login";</script>`);    
    }
});


// 로그아웃
router.get('/logout', function (request, response) {
    request.session.destroy(function (err) {
        // 세션을 삭제합니다.
        response.redirect('/');
        // 메인 페이지로 리디렉션합니다.
    });
});

// 회원가입 화면
router.get('/register', function(request, response) {
    var title = '회원가입';    
    var html = template.HTML(title, `
    <h2>회원가입</h2>
    <form action="/auth/register_process" method="post">
    <p><input class="login" type="text" name="username" placeholder="아이디"></p>
    <p><input class="login" type="password" name="pwd" placeholder="비밀번호"></p>    
    <p><input class="login" type="password" name="pwd2" placeholder="비밀번호 재확인"></p>
    <p><input class="btn" type="submit" value="제출"></p>
    </form>            
    <p><a href="/auth/login">로그인화면으로 돌아가기</a></p>
    `, '');
    response.send(html);
    // 회원가입 화면을 렌더링하여 클라이언트에 전송합니다.
});
 
// 회원가입 프로세스
router.post('/register_process', function(request, response) {    
    var username = request.body.username;
    var password = request.body.pwd;    
    var password2 = request.body.pwd2;

    if (username && password && password2) {
        // 아이디와 비밀번호가 입력되었는지 확인합니다.
        
        db.query('SELECT * FROM usertable WHERE username = ?', [username], function(error, results, fields) {
            // 데이터베이스에서 해당 아이디가 이미 존재하는지 확인합니다.
            if (error) throw error;
            if (results.length <= 0 && password == password2) {
                // 같은 이름의 아이디가 없고, 비밀번호가 일치하는 경우
                db.query('INSERT INTO usertable (username, password) VALUES(?,?)', [username, password], function (error, data) {
                    if (error) throw error;
                    response.send(`<script type="text/javascript">alert("회원가입이 완료되었습니다!");
                    document.location.href="/";</script>`);
                    // 회원가입 완료 메시지를 띄우고 메인 페이지로 리디렉션합니다.
                });
            } else if (password != password2) {
                // 비밀번호가 일치하지 않는 경우
                response.send(`<script type="text/javascript">alert("입력된 비밀번호가 서로 다릅니다."); 
                document.location.href="/auth/register";</script>`);    
            } else {
                // 같은 이름의 아이디가 존재하는 경우
                response.send(`<script type="text/javascript">alert("이미 존재하는 아이디 입니다."); 
                document.location.href="/auth/register";</script>`);    
            }            
        });

    } else {
        // 입력되지 않은 정보가 있는 경우
        response.send(`<script type="text/javascript">alert("입력되지 않은 정보가 있습니다."); 
        document.location.href="/auth/register";</script>`);
    }
});

module.exports = router; 
// 이 모듈을 외부에서 사용할 수 있도록 내보냅니다.
