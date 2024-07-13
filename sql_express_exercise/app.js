var express = require('express');
var app = express();
var pool = require('./config/db');
var bodyParser = require('body-parser');

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

app.get('/', function (req, res) {
    res.send('ROOT');
});

app.get('/list', function (req, res) {
    var sql = 'SELECT * FROM BOARD';    
    pool.query(sql, function (err, rows, fields) {
        if(err) console.log('query is not excuted. select fail...\n' + err);
        else res.render('list.ejs', {list : rows});
    });
});

app.get('/write', function (req, res) {
    res.render('write.ejs'); // 뷰 템플릿 렌더링
});

app.post('/writeAf', function (req, res) {
    var body = req.body; // 요청 본문 데이터 담는 객체
    console.log(body);

    var sql = 'INSERT INTO BOARD VALUES(?, ?, ?, NOW())';
    var params = [body.id, body.title, body.content];
    console.log(sql);
    pool.query(sql, params, function(err) {
        if(err) console.log('query is not excuted. insert fail...\n' + err);
        else res.redirect('/list');
    });
});

app.listen(3000, () => console.log('Server is running on port 3000...'));

// 애플리케이션 종료 시 커넥션 풀을 닫음
process.on('exit', () => {
	pool.end((err) => {
	  if (err) {
		console.error('Error ending the database connection pool:', err.stack);
	  } else {
		console.log('Database connection pool closed.');
	  }
	});
  });