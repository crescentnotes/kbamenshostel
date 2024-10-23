import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import db from '../db/index.js';  // Import the db pool

// Function to generate the PDF for the gate pass
export async function generateGatePassPDF(gatepass) {
    const pdfFilePath = path.resolve(`./generated_pdfs/gatepass-${gatepass.id}.pdf`);

    // Ensure the directory exists
    if (!fs.existsSync(path.dirname(pdfFilePath))) {
        fs.mkdirSync(path.dirname(pdfFilePath), { recursive: true });
    }

    console.log('Generating PDF at:', pdfFilePath);

    // Initialize a new PDF document
    const doc = new PDFDocument();

    // Pipe the PDF into a writable stream
    const pdfStream = fs.createWriteStream(pdfFilePath);
    doc.pipe(pdfStream);

    // --- Add a logo to the PDF ---
    const logoPath = path.resolve('./public/images/logo.png');  // Assuming logo is stored in public/images
    if (fs.existsSync(logoPath)) {
        doc.image(logoPath, {
            fit: [100, 100],   // Adjust size of the logo
            align: 'center',   // Align center
        });
    }

    // Move down after logo
    doc.moveDown(2);

    // Add header text
    doc.fontSize(25).text('Gate Pass Approval', { align: 'center' });

    doc.moveDown();

    // Add the form data (gatepass details)
    doc.fontSize(16).text(`Gate Pass ID: ${gatepass.id}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Name: ${gatepass.name}`, { align: 'left' });
    doc.moveDown();
    doc.text(`RRN/Application Number: ${gatepass.rrn}`, { align: 'left' });
    doc.moveDown();
    doc.text(`Department/Degree/Year: ${gatepass.degree}`, { align: 'left' });
    doc.moveDown();
    doc.text(`Block and Room Number: ${gatepass.block_room}`, { align: 'left' });
    doc.moveDown();
    doc.text(`Date and Time Out: ${gatepass.time_out}`, { align: 'left' });
    doc.moveDown();
    doc.text(`Date and Time In: ${gatepass.time_in}`, { align: 'left' });
    doc.moveDown();
    doc.text(`Reason: ${gatepass.reason}`, { align: 'left' });
    doc.moveDown();
    doc.text(`Student Contact: ${gatepass.student_contact}`, { align: 'left' });
    doc.moveDown();
    doc.text(`Parent Contact: ${gatepass.parent_contact}`, { align: 'left' });
    doc.moveDown();
    doc.text(`RT Name: ${gatepass.rt_name}`, { align: 'left' });

    // Add approval details (current date and time)
    const approvedDate = new Date().toLocaleString();  // Get the current date and time in locale format
    doc.moveDown();
    doc.text(`Approved on: ${approvedDate}`, { align: 'center' });

    // Finalize the PDF and end the document
    doc.end();

    // Wait for the PDF stream to finish writing
    await new Promise((resolve, reject) => {
        pdfStream.on('finish', resolve);
        pdfStream.on('error', reject);
    });

    // Return the path of the generated PDF
    return pdfFilePath;
}

// Get gatepass by ID
export const getGatepassById = async (id) => {
    const query = `SELECT * FROM gatepasses WHERE id = $1`;
    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
        throw new Error("Gatepass not found");
    }

    return result.rows[0];  // Return the gatepass
};

// Approve gatepass by updating the status and generating the PDF
export const approveGatepass = async (id) => {
    try {
        const gatepass = await getGatepassById(id);  // Fetch gatepass details from DB
        
        if (gatepass) {
            const updateQuery = `UPDATE gatepasses SET status = 'approved' WHERE id = $1`;
            await db.query(updateQuery, [id]);  // Update status to 'approved'
            
            const pdfFilePath = await generateGatePassPDF(gatepass);  // Generate the PDF with form data, logo, and approval date
            
            console.log(`Gate pass ${id} approved and PDF generated.`);
            return `Gate pass ${id} approved and PDF generated at ${pdfFilePath}.`;
        } else {
            throw new Error("Gatepass not found");
        }
    } catch (error) {
        console.error("Error approving gatepass:", error);
        throw error;
    }
};
