import pool from '../db/index.js';  // Import the pool from db/index.js

// Save gate pass in the database
export const saveGatepass = async (data) => {
    const query = `
        INSERT INTO gatepasses (name, rrn, degree, block_room, time_out, time_in, reason, student_contact, parent_contact, rt_name, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`;
    try {
        await pool.query(query, [
            data.name, 
            data.rrn, 
            data.degree, 
            data.block_room, 
            data.time_out, 
            data.time_in, 
            data.reason, 
            data.student_contact, 
            data.parent_contact, 
            data.rt_name,
            data.status
        ]);
    } catch (error) {
        console.error('Error saving gate pass:', error);
        throw error;
    }
};

 
// In dbservice.js (or wherever you have the database logic)
export const getPendingGatepasses = async () => {
    try {
        const result = await pool.query('SELECT * FROM gatepasses WHERE status = $1', ['pending']);  // Assuming status is a field that determines pending gate passes.
        console.log("Fetched Gatepass Requests:", result.rows);  // Debugging the result
        return result.rows;  // Return the rows from the query
    } catch (error) {
        console.error("Error fetching gatepass requests:", error);
        throw error;
    }
};

// Update the gatepass status (approve/reject)
// Function to update gate pass status in the database
export const updateGatepassStatus = async (gatepassId, status) => {
    try {
        const query = 'UPDATE gatepasses SET status = $1 WHERE id = $2';
        const values = [status, gatepassId];

        await db.query(query, values);
    } catch (error) {
        console.error('Error updating gate pass status:', error);
        throw error;
    }
};


// Get gatepass by ID
export const getGatepassById = async (id) => {
    const query = `SELECT * FROM gatepasses WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];  // Return the gatepass by ID
  };
  
// Fetch all gate passes
export const getAllGatepassRequests = async () => {
    const query = 'SELECT * FROM gatepasses';
    const result = await pool.query(query);
    return result.rows;
};
export const getGatePassDetails = async (gatepassId) => {
    try {
        const query = 'SELECT * FROM gatepasses WHERE id = $1';
        const result = await pool.query(query, [gatepassId]);

        if (result.rows.length === 0) {
            throw new Error(`No gate pass found with ID ${gatepassId}`);
        }

        return result.rows[0];  // Return the first matching record
    } catch (error) {
        console.error('Error fetching gate pass details:', error);
        throw error;
    }
};

