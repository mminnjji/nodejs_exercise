// App.js

const express = require('express');
const app = express(); // 익스프레스 객체 생성 
const router = require('./routes/index');

// Express 애플리케이션에 미들웨어 추가
// '/' 경로에 대한 요청이 들어오면 'router'를 사용하여 요청처리
app.use('/', router);

// 웹서버를 시작하고 3000번 포트에서 요청을 듣기 시작함
// 서버가 시작되고, 지정된 포트에서 클라이언트 요청을 받을 준비가 됨..
app.listen(3000, () => {
	console.log('Server is running on port 3000');
  });