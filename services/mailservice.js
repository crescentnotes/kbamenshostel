import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';
// export const sendGatepassEmail = async (email, gatepassId, pdfPath) => {
//     try {
//         console.log(`Sending email to: ${email} with PDF: ${pdfPath}`);  // Debug log for email

//         // Your email sending logic, for example, using `nodemailer`:
//         const mailOptions = {
//             from: 'no-reply@domain.com',
//             to: email,
//             subject: 'Gate Pass Approved',
//             text: 'Your gate pass has been approved.',
//             attachments: [
//                 {
//                     filename: `gatepass-${gatepassId}.pdf`,
//                     path: pdfPath,
//                 },
//             ],
//         };

//         // Sending the email with nodemailer
//         await transporter.sendMail(mailOptions);
//         console.log('Email sent successfully.');

//     } catch (error) {
//         console.error('Failed to send email:', error);
//         throw new Error('Email sending failed');
//     }
// };

export const sendGatepassEmail = async (recipientEmail, gatepassId, pdfPath) => {
    // Check if the PDF exists before sending
    if (!fs.existsSync(pdfPath)) {
        throw new Error(`PDF file does not exist at path: ${pdfPath}`);
    }

    // Set up your email transporter using environment variables
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'crescentnotes53@gmail.com',
            pass: 'onpj uefc apvk rhkb',     // Use environment variable for password
        },
    });

    // Set up email options
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipientEmail,  // Send email to the recipient's email
        subject: `Gate Pass Approved: ${gatepassId}`,
        text: `Dear user, your gate pass with ID ${gatepassId} has been approved. Please find the attached gate pass.`,
        attachments: [
            {
                filename: `gatepass-${gatepassId}.pdf`,  // Set the filename explicitly for the attachment
                path: pdfPath,  // Attach the generated PDF
            },
        ],
    };

    // Send the email
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${recipientEmail} with gate pass ID: ${gatepassId}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};
