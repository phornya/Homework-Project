"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const db_1 = __importDefault(require("./config/db"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
// Routes
app.use('/api/users', userRoutes_1.default);
const initDb = async () => {
    try {
        const connection = await db_1.default.getConnection();
        await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE
      )
    `);
        connection.release();
        console.log('[database]: Table initialized successfully.');
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('[database]: Error initializing database:', error.message);
        }
    }
};
app.listen(port, async () => {
    await initDb();
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
