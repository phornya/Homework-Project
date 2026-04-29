import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface IUser {
  id?: number;
  name: string;
  email: string;
}

export class User {
  static async getAll(): Promise<IUser[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM users');
    return rows as IUser[];
  }

  static async getById(id: number): Promise<IUser | null> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE id = ?', [id]);
    const users = rows as IUser[];
    if (users.length) {
       return users[0];
    }
    return null;
  }

  static async create(user: IUser): Promise<IUser> {
    const { name, email } = user; // Object destructuring
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [name, email]
    );
    return { id: result.insertId, name, email };
  }

  static async update(id: number, user: Partial<IUser>): Promise<boolean> {
    const { name, email } = user; // Object destructuring
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [name, email, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}
