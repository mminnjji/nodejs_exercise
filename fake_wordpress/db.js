// 데이터베이스 객체가 되는 pool을 export 위해 연결

const mysql = require('mysql');
const pool = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'my_db',
  waitForConnections: true,
  connectionLimit: 10, // 풀 내 최대 연결 수
  queueLimit: 0       // 대기열에 들어갈 최대 연결 요청 수 (0은 무제한)
});

module.exports = pool; // db 객체를 모듈로 내보냅니다.