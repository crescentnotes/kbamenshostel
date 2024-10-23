import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

// Function to generate a PDF file
export const generatePDF = (details, outputPath) => {
    return new Promise((resolve, reject) => {
        if (!outputPath || typeof outputPath !== 'string') {
            return reject(new Error('Invalid output path provided.'));
        }

        const doc = new PDFDocument();
        doc.pipe(fs.createWriteStream(outputPath));

        doc.fontSize(16).text(`Gate Pass for ${details.name}`, { align: 'center' });
        doc.text(`RRN: ${details.rrn}`);
        doc.end();

        doc.on('finish', () => resolve(outputPath));
        doc.on('error', reject);
    });
};

// Function to approve gate pass and generate PDF
export const approveGatepass = async (gatepassId) => {
    const gatepassDetails = await getGatepassById(gatepassId);
    
    const outputPath = path.join(__dirname, `../public/gatepasses/${gatepassId}_gatepass.pdf`);
    await generatePDF(gatepassDetails, outputPath);

    await updateGatepassStatus(gatepassId, 'approved');  // Update status after generating PDF
    return outputPath;  // Return the path to the generated PDF
};
