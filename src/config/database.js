import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
});

pool.connect()
      .then(() => console.log('Connected to PostgreSQL'))
      .catch(err => console.error('Connection error: ', err));

export const query = (text, params) => pool.query(text, params); 