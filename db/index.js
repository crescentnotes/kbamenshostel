import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();  // Import the default export
const { Pool } = pkg; // Extract Pool from the imported package

const pool = new Pool({
    user: process.env.DB_USER,         // PostgreSQL username
    host: process.env.DB_HOST,         // PostgreSQL host (usually 'localhost')
    database: process.env.DB_NAME,     // PostgreSQL database name
    password: process.env.DB_PASSWORD, // PostgreSQL password
    port: process.env.DB_PORT,                  // default port for PostgreSQL
});

export default pool;
