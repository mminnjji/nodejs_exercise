const mysql = require('mysql');
const pool = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'webpagedata',
  waitForConnections: true,
  connectionLimit: 10, // 풀 내 최대 연결 수
  queueLimit: 0       // 대기열에 들어갈 최대 연결 요청 수 (0은 무제한)
});

module.exports = pool; // db 객체를 모듈로 내보냅니다.