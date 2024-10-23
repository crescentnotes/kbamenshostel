import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../db/index.js';  // Ensure pool is imported correctly
import PDFDocument from 'pdfkit';  // Assuming you're using pdfkit for PDF generation

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all gate pass requests
export const getGatePassRequests = async () => {
    try {
        const result = await pool.query('SELECT * FROM gatepass_requests ORDER BY id DESC');
        return result.rows;
    } catch (err) {
        console.error('Error fetching gate pass requests:', err);
        throw err;
    }
};

// Approve the gate pass and generate PDF
// In your controller (e.g., gatepassController.js)
// Approve the gate pass and generate PDF
// Inside gatepassController.js
export const approveGatePass = async (gatepassId, gatePassDetails) => {
    try {
        // Define the directory to save generated PDFs
        const pdfDirectory = path.resolve('./generated_pdfs');
        
        // Check if the directory exists, if not, create it
        if (!fs.existsSync(pdfDirectory)) {
            fs.mkdirSync(pdfDirectory, { recursive: true });  // Create directory if not exists
        }

        // Generate a valid filename for the PDF using gatepassId
        const pdfFileName = `gatepass-${gatepassId}-${Date.now()}.pdf`;  // Adding a timestamp to avoid name conflicts
        const pdfPath = path.join(pdfDirectory, pdfFileName);
        console.log('Saving PDF to path:', pdfPath);  // Log the path where PDF will be saved

        // Create a PDF document using PDFKit
        const doc = new PDFDocument({ margin: 50 });
        const writeStream = fs.createWriteStream(pdfPath);
        doc.pipe(writeStream);

        // Add the logo at the top (ensure logo is in the correct path)
        const logoPath = path.resolve('./public/images/gatepass-logo.jpg');  // Correct path for the logo
        const logoWidth = 100;  // Adjust logo size if necessary
        doc.image(logoPath, { width: logoWidth, align: 'center' });
        doc.moveDown(1);  // Add some space after logo

        // Add the hostel name and gate pass title
        const hostelText = 'Kilakarai Buhi Aalim Hostel\nMen\'s Hostel Gate Pass';
        doc.fontSize(18).font('Helvetica-Bold').text(hostelText, { align: 'center' });
        doc.moveDown(2);  // Add space before starting the border and form details

        // Add a border line below the hostel name
        doc.strokeColor('black').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(1);  // Add space before form details

        // Add form details with labels and values
        const fields = [
            { label: 'Gate Pass ID:', value: gatepassId },
            { label: 'Name:', value: gatePassDetails.name },
            { label: 'RRN:', value: gatePassDetails.rrn },
            { label: 'Degree:', value: gatePassDetails.degree },
            { label: 'Block & room no:', value: gatePassDetails.block_room },
            { label: 'Date Out:', value: gatePassDetails.time_out },
            { label: 'Date In:', value: gatePassDetails.time_in },
            { label: 'RT Name:', value: gatePassDetails.rt_name },
            { label: 'Parent Contact:', value: gatePassDetails.parent_contact },
            { label: 'Your Phone Number:', value: gatePassDetails.student_contact },
        ];

        // Render form fields with blue text
        doc.fillColor('black');  // Set the color to blue for the text
        fields.forEach((field, index) => {
            doc.fontSize(12).text(`${field.label} ${field.value}`, { align: 'left' });
            if (index !== fields.length - 1) {
                doc.moveDown(0.5);  // Add some space between fields
            }
        });

        // Finalize the PDF document
        doc.end();

        // Return a Promise to handle write stream completion
        return new Promise((resolve, reject) => {
            writeStream.on('finish', async () => {
                try {
                    // Update the gate pass status in the database to 'approved'
                    const updateQuery = `
                        UPDATE gatepasses 
                        SET status = $1 
                        WHERE id = $2
                    `;
                    const updateValues = ['approved', gatepassId];  // 'approved' status and gate pass ID

                    await pool.query(updateQuery, updateValues);
                    console.log(`Gate pass ${gatepassId} marked as approved in the database.`);

                    resolve(pdfPath);  // Resolve the Promise with the PDF path
                } catch (error) {
                    console.error('Error updating the database:', error);  // Log any database errors
                    reject(error);  // Reject the Promise if there's an error
                }
            });

            writeStream.on('error', (err) => reject(err));  // Reject if there's an error during PDF creation
        });

    } catch (error) {
        console.error('Error generating the PDF:', error);  // Log any errors during PDF generation
        throw error;  // Propagate the error
    }
};



// Get gate pass details (example of a query that fetches gate pass details)
export const getGatePassDetails = async (gatepassId) => {
    // Check if the gate pass ID exists in the database
    const query = 'SELECT * FROM gatepasses WHERE id = $1';
    const result = await pool.query(query, [gatepassId]);

    if (result.rows.length === 0) {
        throw new Error('Gate pass not found');
    }

    return result.rows[0];  // Return the details of the gate pass
};

