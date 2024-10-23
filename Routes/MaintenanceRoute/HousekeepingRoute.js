import express from 'express';
import pool from '../../db/index.js'; // Import the default pool instance

const router = express.Router();

// Housekeeping POST route
router.post('/housekeeping', async (req, res) => {
    const { name, rrn, block, room_number } = req.body;

    // Validate that required fields are provided
    if (!name || !rrn || !block || !room_number) {
        return res.json({
            success: false,
            message: 'All fields are required.'
        });
    }

    try {
        // Insert housekeeping request into the database
        await pool.query(
            'INSERT INTO housekeeping_requests (name, rrn, block, room_number, maintenance_done, status) VALUES ($1, $2, $3, $4, $5, $6)',
            [name, rrn, block, room_number, 'No', 'pending'] // Defaulting 'maintenance_done' to 'No'
        );

        // Send JSON response with success message
        res.json({
            success: true,
            message: 'Housekeeping request submitted successfully!'
        });
    } catch (error) {
        console.error('Error submitting housekeeping request:', error);
        // Send JSON response with error message
        res.json({
            success: false,
            message: 'Failed to submit the housekeeping request. Please try again.'
        });
    }
});

export default router;
