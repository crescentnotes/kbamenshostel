import express from 'express';
import bcrypt from 'bcryptjs';  // For hashing passwords
import session from 'express-session';  // For managing user sessions
import pool from '../db/index.js';  // Assuming db connection setup is in 'db/index.js'

const router = express.Router();

// Render login page
router.get('/login', (req, res) => {
    res.render('login', { error: null, username: '' }); // Render the login page with no error initially
});


router.post('/login', async (req, res) => {
    const email = req.body.username;
    const password = req.body.password;
     

    try {
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
      
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storedPassword = user.password;
  
        bcrypt.compare(password, storedPassword, async (err, isMatch) => {
          if (err) {
            console.error("Password comparison error: ", err);
            return res.status(500).json({ message: "Internal Server Error" });
          }
  
          if (isMatch) {
            req.session.user = user;  // Store user info in session
  
            // Insert login record into logins table
            try {
              await pool.query("INSERT INTO logins (email) VALUES ($1)", [email]);
            } catch (insertErr) {
              console.error("Error inserting login record: ", insertErr);
            }
  
            res.json({ success: true });
          } else {
            res.status(401).json({ message: "Incorrect Password" });
          }
        });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (err) {
      console.error("Database Query Error: ", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  

export default router;
