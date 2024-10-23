import { Router } from 'express';
import pool from '../db/index.js'; // DB Connection

const router = Router();

// Middleware to check if user is a hostel manager
const checkHostelManager = (req, res, next) => {
  if (req.user.role !== 'hostel_manager') {
    return res.status(403).send('Access Denied');
  }
  next();
};

// Hostel Manager Admin Panel
router.get('/managerpanel', checkHostelManager, async (req, res) => {
  try {
    // Fetch total users, RT users, and maintenance users
    const totalUsersResult = await pool.query('SELECT * FROM users WHERE role = $1', ['student']);
    const rtUsersResult = await pool.query('SELECT * FROM users WHERE role = $1', ['rt']);
    const maintenanceUsersResult = await pool.query('SELECT * FROM users WHERE role = $1', ['maintenance']);

    // Fetch all login attempts for RTs and Maintenance users
    const rtLoginsResult = await pool.query('SELECT * FROM logins WHERE user_id IN (SELECT id FROM users WHERE role = $1)', ['rt']);
    const maintenanceLoginsResult = await pool.query('SELECT * FROM logins WHERE user_id IN (SELECT id FROM users WHERE role = $1)', ['maintenance']);
    
    // Render manager panel with data
    res.render('manager-panel', {
      totalUsers: totalUsersResult.rows,
      rtUsers: rtUsersResult.rows,
      maintenanceUsers: maintenanceUsersResult.rows,
      rtLogins: rtLoginsResult.rows,
      maintenanceLogins: maintenanceLoginsResult.rows
    });
  } catch (error) {
    console.error('Error loading manager panel:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
