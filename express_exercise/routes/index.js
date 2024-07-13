// /routes/index.js
const express = require('express'); // express 모듈 가져오기
const router = express.Router(); // 라우터 객체 생성

// HTTP get 요청을 처리하는 라우트 정의 - '/' 경로에서 콜백함수 요청(req)/응답(res) cjfl 
// res.send - 클라이언트에게 응답 보냄
router.get('/', function(req, res) { 
  res.send('안녕하세요');
});

module.exports = router;