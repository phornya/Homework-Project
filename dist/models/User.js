"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const db_1 = __importDefault(require("../config/db"));
class User {
    static async getAll() {
        const [rows] = await db_1.default.query('SELECT * FROM users');
        return rows;
    }
    static async getById(id) {
        const [rows] = await db_1.default.query('SELECT * FROM users WHERE id = ?', [id]);
        const users = rows;
        if (users.length) {
            return users[0];
        }
        return null;
    }
    static async create(user) {
        const { name, email } = user; // Object destructuring
        const [result] = await db_1.default.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
        return { id: result.insertId, name, email };
    }
    static async update(id, user) {
        const { name, email } = user; // Object destructuring
        const [result] = await db_1.default.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id]);
        return result.affectedRows > 0;
    }
    static async delete(id) {
        const [result] = await db_1.default.query('DELETE FROM users WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}
exports.User = User;
