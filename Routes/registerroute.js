import express from 'express';
import bcrypt from 'bcryptjs';  // For hashing passwords
import session from 'express-session';  // For managing user sessions
import pool from '../db/index.js';  // Assuming db connection setup is in 'db/index.js'

const router = express.Router();

router.get("/register", (req, res) => {
    res.render("register.ejs");
});

const saltrounds = 10;
router.post("/register", async (req, res) => {
    const { name, parentMobNum, username: email, password } = req.body;
  
    // Validate the input fields
    if (!name || !parentMobNum || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    try {
      // Check if the email already exists in the database
      const checkResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  
      if (checkResult.rows.length > 0) {
        return res.status(409).json({ message: "Email already exists" });
      } else {
        // Hash the password before storing it
        bcrypt.hash(password, saltrounds, async (err, hash) => {
          if (err) {
            console.error("Error hashing password:", err);
            return res.status(500).json({ message: "Internal Server Error" });
          } else {
            // Insert the new user into the database
            try {
              await pool.query(
                "INSERT INTO users (name, parent_mob_num, email, password) VALUES ($1, $2, $3, $4)",
                [name, parentMobNum, email, hash]
              );
              return res.status(201).json({ message: "User registered successfully" });
            } catch (dbError) {
              console.error("Error inserting user:", dbError);
              return res.status(500).json({ message: "Internal Server Error" });
            }
          }
        });
      }
    } catch (err) {
      console.error("Error checking user:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  

export default router;
