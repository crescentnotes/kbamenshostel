import express from 'express';
import pool from '../db/index.js'; // Import your PostgreSQL pool connection

const router = express.Router();

// Helper function to run queries
const runQuery = async (query) => {
  try {
    const result = await pool.query(query);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

// Route to render the admin panel with data from gatepasses, users, and logins tables
router.get('/adminpanel', async (req, res) => {
  try {
    // Fetch all gatepass requests from the gatepasses table
    const gatepassResult = await runQuery('SELECT * FROM gatepasses');
    const gatepassRequests = gatepassResult.rows;

    // Fetch all users from the users table
    const usersResult = await runQuery('SELECT * FROM users');
    const users = usersResult.rows;

    // Fetch all login attempts from the logins table
    const loginAttemptsResult = await runQuery('SELECT * FROM logins');
    const loginAttempts = loginAttemptsResult.rows;

    // Render the admin-panel.ejs template with the retrieved data
    res.render('management-admin-panel', {
      gatepassRequests,
      users,
      loginAttempts
    });

  } catch (error) {
    console.error('Error fetching data for admin panel:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
