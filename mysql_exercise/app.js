var pool = require('./db'); // db.js 모듈을 가져옵니다.

// 데이터베이스 쿼리 실행
pool.query('SELECT * FROM Users', (error, rows, fields) => {
  if (error) throw error;
  console.log('User info is: ', rows);
});

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