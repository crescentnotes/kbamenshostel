import express from 'express';
import fs from 'fs';
import path from 'path';
import { generateGatePassPDF, approveGatepass } from '../services/pdfservice.js';  // Import pdfService.js for PDF generation and approval
import { saveGatepass, getPendingGatepasses, updateGatepassStatus, getGatepassById, getAllGatepassRequests } from '../db/dbservice.js';  // Database service
import { sendGatepassEmail } from '../services/mailservice.js';  // Email service to send the PDF
import { approveGatePass, getGatePassDetails } from '../controllers/gatepassController.js';

const router = express.Router();

// Route for getting the gate pass form and displaying submissions
router.get('/gatepass', (req, res) => {
    res.render('gatepass');  // Render the gate pass form page
});

// Route for handling form submission
router.post('/gatepass', async (req, res) => {
    const { name, rrn, degree, block_room, time_out, time_in, reason, student_contact, parent_contact, rt_name } = req.body;

    // Set status to 'pending' if it's not passed in the request body
    const status = req.body.status || 'pending';  // Use 'pending' if status is not passed in the body

    // Combine the request data with the status
    const gatepassData = {
        name,
        rrn,
        degree,
        block_room,
        time_out,
        time_in,
        reason,
        student_contact,
        parent_contact,
        rt_name,
        status  // Add status field here
    };

    try {
        console.log("Received data:", gatepassData);

        // Save the gate pass request (Assuming saveGatepass is a function to save it to the DB)
        await saveGatepass(gatepassData);

        // If successful, send a success response
        res.json({ message: 'Gate pass request submitted successfully', success: true });
    } catch (err) {
        console.error("Error occurred:", err);
        // Send an error response
        res.json({ message: 'An error occurred. Please try again.', success: false });
    }
});

// Admin panel route to view pending gatepass requests (GET request)
// router.get('/RTadmin/gatepass-requests', async (req, res) => {
//     try {
//         const gatepassRequests = await getPendingGatepasses();  // Fetch pending gate pass requests from the DB

//         res.render('Rt-admin-panel', { gatepassRequests });  // Render admin panel with the fetched gate pass requests

//     } catch (error) {
//         console.error("Error fetching gatepass requests:", error);
//         res.status(500).json({ message: 'Error fetching gatepass requests' });
//     }
// });

//  router.post('/approve-gatepass/:id', async (req, res) => {
//     const gatepassId = req.params.id;

//     if (!gatepassId) {
//         return res.status(400).json({ message: "Gate pass ID is required" });
//     }

//     try {
//         // Fetch the gate pass details
//         const gatePassDetails = await getGatePassDetails(gatepassId);

//         if (!gatePassDetails) {
//             return res.status(404).json({ message: 'Gate pass details not found.' });
//         }

//         // Generate the PDF
//         const pdfPath = await approveGatePass(gatepassId, gatePassDetails);

//         // Ensure the PDF is generated
//         if (!fs.existsSync(pdfPath)) {
//             return res.status(404).json({ message: 'PDF file not found.' });
//         }

//         // Get the logged-in user's email
//         const loggedInUserEmail = req.session?.user?.email;
//         if (!loggedInUserEmail) {
//             return res.status(401).json({ message: 'User not logged in' });
//         }

//         // Send email with the PDF
//         await sendGatepassEmail(loggedInUserEmail, gatepassId, pdfPath);

//         // Pass success data to the view
//         const successMessage = 'Gate pass approved and email sent successfully';

//         // Fetch pending gate pass requests for admin view
//         const gatepassRequests = await getPendingGatepasses();

//         // Render admin panel view with success and requests
//         res.render('Rt-admin-panel', {
//             success: true,
//             successMessage: successMessage,
//             gatepassRequests: gatepassRequests // Make sure this is being passed correctly
//         });

//     } catch (error) {
//         console.error('Error approving gate pass:', error);
//         return res.status(500).json({ message: 'Failed to approve gate pass and send email' });
//     }
// });



// // Ensure that this is the correct POST route
// router.post('/approve-gatepass/:id', approveGatePass);


// // Route for downloading the generated PDF
// router.get('/download/:id', (req, res) => {
//     const pdfFilePath = path.resolve(`./generated_pdfs/gatepass-${req.params.id}.pdf`);
//     console.log('PDF Path:', pdfFilePath);  // Debugging the file path

//     if (fs.existsSync(pdfFilePath)) {
//         res.download(pdfFilePath, (err) => {
//             if (err) {
//                 console.error('Error downloading PDF:', err);
//                 res.status(500).send('Error downloading PDF.');
//             } else {
//                 console.log(`PDF downloaded: ${pdfFilePath}`);
//             }
//         });
//     } else {
//         console.log('PDF file not found at:', pdfFilePath);
//         res.status(404).send('PDF file not found.');
//     }
// });

export default router;
