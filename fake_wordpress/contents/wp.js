var express = require('express'); 
var router = express.Router(); 
var template = require('../lib_login/template.js'); 
var db = require('../db.js');

function getFormatDate(date) {
    var year = date.getFullYear();
    var month = (1 + date.getMonth()).toString().padStart(2, '0');
    var day = date.getDate().toString().padStart(2, '0');
    return year + '-' + month + '-' + day;
}

router.get('/write', function (request, response) {
    var title = '글 작성';
    var html = template.HTML(title,`
            <h2>글 작성</h2>
            <form action="/wp/write_process" method="post">
            <p><input class="login" type="text" name="title" placeholder="제목"></p>
            <p><input class="write" type="text" name="content" placeholder="내용"></p>
            <p><input class="btn" type="submit" value="작성완료"></p>
            </form>            
        `, '');
    response.send(html);
});

router.post('/write_process', function(request, response) {
    console.log("Write Process: ", request.session); // 세션 확인 로그 // 추가된 로그
    var title = request.body.title;
    var content = request.body.content;    

    if (title && content) {
        var date = getFormatDate(new Date());
        db.query('INSERT INTO usercontent (username, cdate, title, content) VALUES(?, ?, ?, ?, ?)', 
            [request.session.nickname, date, title, content], function (error, data) {
            if (error) throw error;
            response.redirect('/main');
        });
    } else {
        response.send(`<script type="text/javascript">alert("입력되지 않은 정보가 있습니다."); 
        document.location.href="/wp/write";</script>`);
    }
});


module.exports = router;
