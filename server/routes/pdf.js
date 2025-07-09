const express = require('express');
const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');

const router = express.Router();

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error('❌ Email credentials not configured!');
    console.error('Please set EMAIL_USER and EMAIL_PASSWORD in your .env file');
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const generatePDF = async (report) => {
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Accessibility Report - ${report.url}</title>
        <style>
            * { box-sizing: border-box; }
            body { 
                font-family: Arial, sans-serif; 
                line-height: 1.6; 
                color: #333; 
                margin: 0; 
                padding: 20px; 
                background-color: #f4f4f4;
            }
            .container { 
                max-width: 800px; 
                margin: 0 auto; 
                background-color: white;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                border-radius: 10px;
                overflow: hidden;
            }
            .header { 
                background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); 
                color: white; 
                padding: 30px 20px; 
                text-align: center; 
            }
            .header h1 { 
                margin: 0 0 15px 0; 
                font-size: 28px; 
                font-weight: bold;
                color: #ecf0f1;
            }
            .header p { 
                margin: 0; 
                font-size: 16px; 
                word-break: break-all;
                color: #bdc3c7;
            }
            .header strong { 
                color: #3498db; 
                font-weight: bold;
            }
            .content { 
                padding: 30px 20px; 
            }
            .stats { 
                display: flex; 
                justify-content: space-around; 
                margin: 20px 0; 
                flex-wrap: wrap;
                gap: 20px;
            }
            .stat { 
                text-align: center; 
                flex: 1;
                min-width: 120px;
            }
            .stat-number { 
                font-size: 2.5em; 
                font-weight: bold; 
                display: block;
                margin-bottom: 5px;
            }
            .issues { 
                margin: 20px 0; 
            }
            .issue { 
                background: #f9f9f9; 
                margin: 15px 0; 
                padding: 20px; 
                border-radius: 8px; 
                border-left: 4px solid #e74c3c; 
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            .issue h3 { 
                margin: 0 0 10px 0; 
                font-size: 18px; 
                color: #333;
                word-break: break-word;
            }
            .issue p { 
                margin: 8px 0; 
                font-size: 14px; 
                line-height: 1.5;
            }
            .impact-critical { border-left-color: #e74c3c; }
            .impact-serious { border-left-color: #f39c12; }
            .impact-moderate { border-left-color: #f1c40f; }
            .impact-minor { border-left-color: #3498db; }
            .success-message { 
                text-align: center; 
                padding: 40px 20px; 
                background: #f9f9f9;
                border-radius: 8px;
                margin: 20px 0;
            }
            .success-message h2 { 
                color: #27ae60; 
                margin: 0 0 15px 0;
                font-size: 24px;
            }
            .success-message p { 
                margin: 0; 
                color: #666;
                font-size: 16px;
            }
            .footer {
                background: #f9f9f9;
                padding: 20px;
                text-align: center;
                color: #666;
                font-size: 12px;
                border-top: 1px solid #ddd;
            }
            .timestamp {
                color: #999;
                font-size: 12px;
                margin-top: 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📑 Accessibility Report</h1>
                <p>Analysis completed for: <strong>${report.url}</strong></p>
                <div class="timestamp">
                    Generated on: ${new Date(report.timestamp || report.createdAt).toLocaleString()}
                </div>
            </div>
            
            <div class="content">
                <div class="stats">
                    <div class="stat">
                        <span class="stat-number" style="color: #e74c3c;">${report.totalIssues || report.violations?.length || 0}</span>
                        <div>Issues Found</div>
                    </div>
                    <div class="stat">
                        <span class="stat-number" style="color: #27ae60;">${report.passes || 0}</span>
                        <div>Passes</div>
                    </div>
                </div>

                ${report.violations && report.violations.length > 0 ? `
                    <h2 style="margin: 25px 0 15px 0; color: #333; font-size: 20px;">🚨 Issues Found:</h2>
                    
                    <div class="issues">
                        ${report.violations.map((violation, index) => `
                            <div class="issue impact-${violation.impact}">
                                <h3>${index + 1}. ${violation.description}</h3>
                                <p><strong>Impact:</strong> <span style="text-transform: capitalize; color: #666;">${violation.impact}</span></p>
                                <p><strong>Help:</strong> <span style="color: #666;">${violation.help}</span></p>
                                <p><strong>Learn More:</strong> <a href="${violation.helpUrl}" style="color: #3498db;">${violation.helpUrl}</a></p>

                                                                
                                ${violation.nodes && violation.nodes.length > 0 ? `
                                    <div style="margin-top: 15px;">
                                        <h4 style="margin: 0 0 10px 0; color: #333; font-size: 16px;">Affected Elements:</h4>
                                        ${violation.nodes.map((node, nIndex) => `
                                            <div style="background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 3px solid #3498db;">
                                                <p style="margin: 0 0 8px 0; font-weight: bold; color: #333;">Issue ${nIndex + 1}:</p>
                                                <p style="margin: 0 0 8px 0; color: #666; font-size: 13px;">${node.failureSummary}</p>
                                                <p style="margin: 8px 0 4px 0; color: #222; font-size: 13px; font-weight: bold;">Suggested Code:</p>
<pre style="
    background: #f4f4f4;
    color: #c7254e;
    padding: 12px;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 12px;
    overflow-x: auto;
    margin: 0 0 12px 0;
    font-family: 'Fira Mono', 'Consolas', 'Menlo', monospace;
    white-space: pre-wrap;
">${node.html.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
                    
                                            </div>
                                        `).join('')}
                                    </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div class="success-message">
                        <h2>✅ Great News!</h2>
                        <p>No accessibility violations were found on this website.</p>
                    </div>
                `}
            </div>
        </div>
    </body>
    </html>
    `;

    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-web-security'
        ]
    });

    try {
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20mm',
                right: '20mm',
                bottom: '20mm',
                left: '20mm'
            }
        });

        return pdfBuffer;
    } finally {
        await browser.close();
    }
};
// Validation middleware
const validateEmail = [
    body('email').isEmail().withMessage('Please provide a valid email address'),
    body('report').isObject().withMessage('Report data is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error('❌ Validation errors:', errors.array());
            return res.status(400).json({ 
                success: false,
                error: 'Validation failed',
                details: errors.array() 
            });
        }
        next();
    }
];

router.post('/generate-pdf', async (req, res) => {
    try {
        const { report } = req.body;
        
        if (!report) {
            return res.status(400).json({ 
                success: false,
                error: 'Report data is required' 
            });
        }

        console.log(' Generating PDF for:', report.url);
        
        const pdfBuffer = await generatePDF(report);
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="accessibility-report-${Date.now()}.pdf"`);
        res.setHeader('Content-Length', pdfBuffer.length);
        
        console.log('✅ PDF generated successfully!');
        res.send(pdfBuffer);
        
    } catch (err) {
        console.error('❌ PDF generation error:', err);
        res.status(500).json({ 
            success: false,
            error: 'Failed to generate PDF. Please try again.',
            details: err.message 
        });
    }
});


router.post('/email-pdf', validateEmail, async (req, res) => {
    try {
        const { email, report } = req.body;
        
        console.log(' Generating PDF for email to:', email);
        console.log('📄 Report URL:', report.url);

        const pdfBuffer = await generatePDF(report);

        const mailConfiguration = {
            from: `"Accessibility Analyzer" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `Accessibility Report PDF: ${report.url}`,
            html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        line-height: 1.6; 
                        color: #333; 
                        margin: 0; 
                        padding: 20px; 
                        background-color: #f4f4f4;
                    }
                    .container { 
                        max-width: 600px; 
                        margin: 0 auto; 
                        background-color: white;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                        border-radius: 10px;
                        overflow: hidden;
                    }
                    .header { 
                        background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); 
                        color: white; 
                        padding: 30px 20px; 
                        text-align: center; 
                    }
                    .header h1 { 
                        margin: 0 0 15px 0; 
                        font-size: 24px; 
                        font-weight: bold;
                        color: #ecf0f1;
                    }
                    .content { 
                        padding: 30px 20px; 
                    }
                    .stats { 
    display: flex; 
    justify-content: center; 
    align-items: center;
    width: 100%;
    margin: 20px 0; 
    flex-wrap: wrap;
    gap: 40px;
}
.stat { 
    text-align: center; 
    min-width: 120px;
}
                    .stat-number { 
                        font-size: 2em; 
                        font-weight: bold; 
                        display: block;
                        margin-bottom: 5px;
                    }
                    .footer {
                        background: #f9f9f9;
                        padding: 20px;
                        text-align: center;
                        color: #666;
                        font-size: 12px;
                        border-top: 1px solid #ddd;
                    }
                </style>
                       </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>📚 Accessibility Report PDF</h1>
                        <p style="color: #ecf0f1;">Your accessibility analysis report is attached</p>
                    </div>
                    
                    <table align="center" style="margin: 0 auto;">
  <tr>
    <td style="text-align: center; padding: 20px 40px;">
      <span style="font-size: 2em; font-weight: bold; color: #e74c3c; display: block; margin-bottom: 8px;">
        ${report.totalIssues || report.violations?.length || 0}
      </span>
      <div style="color: #333; font-size: 1em;">Issues Found</div>
    </td>
    <td style="text-align: center; padding: 20px 40px;">
      <span style="font-size: 2em; font-weight: bold; color: #27ae60; display: block; margin-bottom: 8px;">
        ${report.passes || 0}
      </span>
      <div style="color: #333; font-size: 1em;">Passes</div>
    </td>
  </tr>
</table>
                        
                        <p style="text-align: center; color: #666; margin: 20px 0;">
                            Please find your detailed accessibility report attached as a PDF file.
                        </p>
                        
                        <p style="text-align: center; color: #666; margin: 20px 0;">
                            <strong>Analyzed URL:</strong> ${report.url}
                        </p>
                    </div>
                    
                    <div class="footer">
                        <p>Generated by Accessibility Analyzer</p>
                        <p>Report generated on: ${new Date().toLocaleString()}</p>
                    </div>
                </div>
            </body>
            </html>
            `,
            attachments: [
                {
                    filename: `Accessibility-Report-${Date.now()}.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }
            ]
        };

        console.log('📤 Sending PDF email...');
        await transporter.sendMail(mailConfiguration);
        console.log('✅ PDF email sent successfully!');

        res.json({ 
            success: true,
            message: 'PDF report sent successfully to your email!' 
        });
    } catch (err) {
        console.error('❌ PDF email error:', err);
        res.status(500).json({ 
            success: false,
            error: 'Failed to send PDF email. Please try again.',
            details: err.message 
        });
    }
});

module.exports = router;
            