import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import * as jose from 'jose';

export const runtime = 'nodejs';

/**
 * Merch Order API - Cloudflare Compatible
 * Uses OpenNext (Node.js runtime) but avoids heavy deps like googleapis/nodemailer.
 */

// Configuration
const SPREADSHEET_ID = '1HqoHbKAxoELXwJyB2vmEIReqNo_tARxXKn9Vc3U_NP4';

const HEADERS = [
    'Order ID', 
    'Timestamp', 
    'Full Name', 
    'Email', 
    'WhatsApp', 
    'Product', 
    'Size', 
    'Quantity', 
    'Delivery Method', 
    'Address', 
    'IEEE Member', 
    'IEEE Member ID', 
    'Status', 
    'Payment Slip URL'
];

// Helper: Sign JWT and get Google Access Token
async function getGoogleAccessToken() {
    try {
        const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
        const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');

        if (!clientEmail || !privateKey) {
            throw new Error('Missing Google Sheets credentials');
        }

        const alg = 'RS256';
        const jwt = await new jose.SignJWT({
            scope: 'https://www.googleapis.com/auth/spreadsheets',
        })
            .setProtectedHeader({ alg, typ: 'JWT' })
            .setIssuer(clientEmail)
            .setSubject(clientEmail)
            .setAudience('https://oauth2.googleapis.com/token')
            .setIssuedAt()
            .setExpirationTime('1h')
            .sign(await jose.importPKCS8(privateKey, alg));

        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                assertion: jwt,
            }),
        });

        const data = await response.json();
        return data.access_token;
    } catch (error: any) {
        console.error('Error generating Google Token:', error.message);
        return null;
    }
}

// Helper: Send Email via Resend (Fetch)
async function sendEmailViaResend({ to, subject, html }: { to: string, subject: string, html: string }) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.warn('RESEND_API_KEY not found. Skipping email sending.');
        return;
    }

    try {
        const from = process.env.EMAIL_FROM_ADDRESS || 'onboarding@resend.dev'; // Default Resend testing email
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from, // Must be verified domain in Resend or onboarding@resend.dev
                to,
                subject,
                html,
            }),
        });

        if (!res.ok) {
            const err = await res.text();
            console.error('Resend Email Error:', err);
        } else {
            console.log(`Email sent to ${to}`);
        }
    } catch (bsError: any) {
        console.error('Email Fetch Error:', bsError.message);
    }
}

export async function POST(req: NextRequest) {
    console.log('--- Starting Merch Order Processing (Cloudflare/OpenNext) ---');
    try {
        const formData = await req.formData();
        
        const data = {
            fullName: formData.get('fullName') as string,
            email: formData.get('email') as string,
            whatsapp: formData.get('whatsapp') as string,
            address: formData.get('address') as string,
            product: formData.get('product') as string,
            size: formData.get('size') as string,
            quantity: formData.get('quantity') as string,
            deliveryMethod: formData.get('deliveryMethod') as string,
            ieeeMember: formData.get('ieeeMember') === 'true',
            ieeeMemberId: formData.get('ieeeMemberId') as string,
        };

        const paymentSlip = formData.get('paymentSlip') as File | null;

        // 1. Generate Order ID
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        const orderId = `YPSL-ORD-${dateStr}-${randomSuffix}`;
        const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' });

        let paymentSlipUrl = 'N/A';

        // 2. Upload to Payload Media (Keep existing logic, assumes Payload handles storage)
        if (paymentSlip && paymentSlip.size > 0) {
            if (paymentSlip.size > 1 * 1024 * 1024) {
                return NextResponse.json({ success: false, error: 'File size exceeds 1MB limit' }, { status: 400 });
            }

            try {
                const payload = await getPayload({ config: configPromise });
                const buffer = Buffer.from(await paymentSlip.arrayBuffer());
                
                const originalName = paymentSlip.name;
                const extension = originalName.includes('.') ? originalName.split('.').pop() : (paymentSlip.type.includes('/') ? paymentSlip.type.split('/')[1] : 'jpg');
                const cleanExtension = extension?.toLowerCase();
                const newFileName = `${orderId}.${cleanExtension}`;

                console.log(`Uploading slip: ${newFileName}`);

                const media = await payload.create({
                    collection: 'media',
                    data: {
                        alt: `Payslip for ${orderId} - ${data.fullName}`,
                        category: 'merch-payslips' as any,
                    },
                    file: {
                        data: buffer,
                        name: newFileName,
                        mimetype: paymentSlip.type,
                        size: paymentSlip.size,
                    },
                    overrideAccess: true,
                });

                paymentSlipUrl = media.url || media.cloudinaryUrl || 'N/A';
                console.log('Final Payment Slip URL:', paymentSlipUrl);

            } catch (uploadError: any) {
                console.error('Payload/Cloudinary Upload Failed:', uploadError.message);
            }
        }

        // 3. Log to Google Sheets (REST API)
        try {
            console.log('Initiating Google Sheets connection (REST)...');
            const accessToken = await getGoogleAccessToken();

            if (accessToken) {
                const sheetRange = 'A1'; // Sheets API finds the next empty row if using append
                const values = [[
                    orderId,
                    timestamp,
                    data.fullName,
                    data.email,
                    data.whatsapp,
                    data.product,
                    data.size || 'N/A',
                    data.quantity,
                    data.deliveryMethod,
                    data.address || 'N/A',
                    data.ieeeMember ? 'Yes' : 'No',
                    data.ieeeMemberId || 'N/A',
                    'Pending',
                    paymentSlipUrl
                ]];

                const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${sheetRange}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
                
                const sheetRes = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ values }),
                });

                if (!sheetRes.ok) {
                    console.error('Google Sheets API Error:', await sheetRes.text());
                } else {
                    console.log('Google Sheets Updated Successfully');
                }
            } else {
                console.error('Failed to get Google Access Token. Skipping Sheets update.');
            }

        } catch (sheetError: any) {
            console.error('CRITICAL Google Sheets Error:', sheetError.message);
        }

        // 4. Send Emails (Resend REST API)
        const summaryHtml = `
            <div style="background: #f8f9fa; padding: 30px; border-radius: 20px; border: 1px solid #eee; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #002855; border-bottom: 3px solid #F37C28; padding-bottom: 8px; display: inline-block; margin-bottom: 25px; font-size: 18px;">Order Summary</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 10px 0; color: #666; width: 160px; font-size: 14px;">Order ID</td><td style="padding: 10px 0; font-weight: 800; color: #333; font-family: monospace; font-size: 14px;">${orderId}</td></tr>
                    <tr><td style="padding: 10px 0; color: #666; font-size: 14px;">Product</td><td style="padding: 10px 0; font-weight: 800; color: #333; font-size: 14px;">${data.product.toUpperCase()}</td></tr>
                    ${data.size ? `<tr><td style="padding: 10px 0; color: #666; font-size: 14px;">Size</td><td style="padding: 10px 0; font-weight: 800; color: #333; font-size: 14px;">${data.size}</td></tr>` : ''}
                    <tr><td style="padding: 10px 0; color: #666; font-size: 14px;">Quantity</td><td style="padding: 10px 0; font-weight: 800; color: #333; font-size: 14px;">${data.quantity}</td></tr>
                    <tr><td style="padding: 10px 0; color: #666; font-size: 14px;">Delivery</td><td style="padding: 10px 0; font-weight: 800; color: #333; font-size: 14px;">${data.deliveryMethod === 'courier' ? 'Courier Delivery' : 'Event Pickup'}</td></tr>
                    <tr><td style="padding: 10px 0; color: #666; font-size: 14px;">Address</td><td style="padding: 10px 0; font-weight: 800; color: #333; font-size: 14px;">${data.address || 'N/A'}</td></tr>
                    <tr><td style="padding: 10px 0; color: #666; font-size: 14px;">Contact</td><td style="padding: 10px 0; font-weight: 800; color: #333; font-size: 14px;">${data.whatsapp}</td></tr>
                    ${paymentSlipUrl !== 'N/A' ? `<tr><td style="padding: 10px 0; color: #666; font-size: 14px;">Payment Proof</td><td style="padding: 10px 0;"><a href="${paymentSlipUrl}" style="color: #F37C28; font-weight: 800; text-decoration: none; font-size: 14px;">View Receipt</a></td></tr>` : ''}
                </table>
            </div>
        `;

        const customerEmailHtml = `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 40px; border-radius: 20px;">
                <div style="margin-bottom: 30px;">
                    <h2 style="color: #002855; margin-bottom: 5px; font-size: 24px;">Request Confirmed</h2>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #666; margin-top: 0;">Hi ${data.fullName}, we've received your merchandise request and it's being processed!</p>
                </div>
                ${summaryHtml}
                <p>Our team will review your payment and contact you shortly regarding the next steps.</p>
                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #999; font-size: 12px;">
                    <p>IEEE Young Professionals Sri Lanka</p>
                </div>
            </div>
        `;

        const adminEmailHtml = `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 40px; border-radius: 5px;">
                <h2 style="color: #002855; margin-bottom: 10px; font-size: 24px;">New Order Received</h2>
                <hr style="border: 0; border-top: 1px dotted #ccc; margin: 20px 0;">
                <p style="color: #333; margin-bottom: 25px;">A new merchandise request has been submitted:</p>
                ${summaryHtml}
                <div style="margin-top: 30px; font-size: 15px; color: #333; font-weight: 600;">
                    <p style="margin: 5px 0;">Customer Name: <span style="font-weight: 400;">${data.fullName}</span></p>
                    <p style="margin: 5px 0;">Customer Email: <a href="mailto:${data.email}" style="color: #002855; text-decoration: underline; font-weight: 400;">${data.email}</a></p>
                    <p style="margin: 5px 0;">IEEE Member: <span style="font-weight: 400;">${data.ieeeMember ? `Yes (ID: ${data.ieeeMemberId})` : 'No'}</span></p>
                </div>
                <div style="margin-top: 35px; background: #e7f3ff; padding: 20px; border-radius: 12px; color: #004085; font-size: 14px; border-left: 4px solid #004085;">
                    Note: Full details have been automatically logged to Google Sheet.
                </div>
            </div>
        `;

        // To Customer
        await sendEmailViaResend({
            to: data.email,
            subject: `Request Received: ${orderId} - IEEE YP Sri Lanka Merch`,
            html: customerEmailHtml
        });

        // To Admin
        const adminEmail = process.env.ADMIN_EMAIL || 'ieeeypsl@gmail.com';
        await sendEmailViaResend({
            to: adminEmail,
            subject: `[MERCH ORDER] ${orderId} - ${data.fullName}`,
            html: adminEmailHtml
        });

        return NextResponse.json({ success: true, orderId });

    } catch (error: any) {
        console.error('Order API Error:', error.message);
        return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
    }
}
