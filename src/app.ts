import express, { Express } from 'express';
import userRoutes from './routes/userRoutes';
import pool from './config/db';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

const initDb = async () => {
  try {
    const connection = await pool.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE
      )
    `);
    connection.release();
    console.log('[database]: Table initialized successfully.');
  } catch (error) {
    if (error instanceof Error) {
       console.error('[database]: Error initializing database:', error.message);
    }
  }
};

app.listen(port, async () => {
  await initDb();
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
