require('dotenv').config();
const db = require('./db');

const init = async () => {
  try {
    await db.query(`CREATE TABLE IF NOT EXISTS messages (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);

    console.log('Ensured `messages` table exists.');
  } catch (err) {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  } finally {
    if (db && typeof db.end === 'function') {
      try { await db.end(); } catch (e) {}
    }
    process.exit(0);
  }
};

init();
