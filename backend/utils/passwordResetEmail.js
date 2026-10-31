const sendEmail = require('./sendEmail')

const escapeHtml = value => String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

const sendPasswordResetEmail = async (user, resetUrl) => {
    const userName = escapeHtml(user.name || 'Customer')
    const userEmail = escapeHtml(user.email)
    const escapedResetUrl = escapeHtml(resetUrl)

    const textMessage = `Hello ${user.name || 'Customer'},\n\nWe received a request to reset your BrickNation account password.\n\nPlease visit the following link to set a new password:\n${resetUrl}\n\nThis link is valid for 30 minutes. If you did not request this, you can safely ignore this email.\n\nBest regards,\nThe BrickNation Team`

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>BrickNation Password Recovery</title>
    </head>
    <body style="margin:0; padding:32px 12px; background-color:#f4f5f7; font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:#374151;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px; margin:0 auto; background-color:#ffffff; border:1px solid #e5e7eb; border-radius:12px; overflow:hidden; box-shadow:0 10px 25px rgba(0,0,0,0.05);">
            <!-- Header -->
            <tr>
                <td style="padding:28px 36px; background-color:#17151b; text-align:left; border-bottom:3px solid #e30620;">
                    <div style="font-size:26px; font-weight:800; color:#ffffff; letter-spacing:-0.5px; margin:0;">
                        Brick<span style="color:#ffd21c;">Nation</span>
                    </div>
                    <div style="margin-top:6px; font-size:13px; color:#d1d5db; font-weight:500;">
                        Account Security &amp; Password Recovery
                    </div>
                </td>
            </tr>

            <!-- Body Content -->
            <tr>
                <td style="padding:36px 36px 28px;">
                    <h1 style="margin:0 0 16px; font-size:22px; font-weight:700; color:#111827; letter-spacing:-0.3px;">
                        Password Reset Request
                    </h1>
                    <p style="margin:0 0 16px; font-size:15px; line-height:1.6; color:#374151;">
                        Hello <strong>${userName}</strong>,
                    </p>
                    <p style="margin:0 0 24px; font-size:15px; line-height:1.6; color:#4b5563;">
                        We received a request to reset the password associated with your BrickNation account. To choose a new password and regain access to your account, please click the button below:
                    </p>

                    <!-- CTA Button -->
                    <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin:30px auto;">
                        <tr>
                            <td align="center" style="border-radius:6px; background-color:#e30620;">
                                <a href="${escapedResetUrl}" target="_blank" style="display:inline-block; padding:15px 36px; font-size:15px; font-weight:700; color:#ffffff; text-decoration:none; border-radius:6px; letter-spacing:0.3px; background-color:#e30620;">
                                    RESET MY PASSWORD
                                </a>
                            </td>
                        </tr>
                    </table>

                    <!-- Expiration Notice -->
                    <div style="background-color:#fffbeb; border-left:4px solid #f59e0b; padding:14px 18px; border-radius:4px; margin:28px 0 20px;">
                        <p style="margin:0; font-size:13px; color:#92400e; line-height:1.5;">
                            <strong>Security Notice:</strong> This password reset link is valid for <strong>30 minutes</strong>. After that, you will need to submit a new password reset request.
                        </p>
                    </div>

                    <p style="margin:0 0 20px; font-size:13px; line-height:1.6; color:#6b7280;">
                        If you did not request a password reset, you can safely ignore this email. Your password will not change and your account remains secure.
                    </p>

                    <!-- Fallback Link -->
                    <div style="background-color:#f9fafb; border:1px solid #e5e7eb; border-radius:6px; padding:14px 16px; margin:20px 0; word-break:break-all; font-size:12px; color:#6b7280; line-height:1.5;">
                        <strong style="color:#374151;">Button not working?</strong> Copy and paste this URL directly into your web browser:<br>
                        <a href="${escapedResetUrl}" style="color:#e30620; text-decoration:underline; word-break:break-all;">${escapedResetUrl}</a>
                    </div>

                    <p style="margin:28px 0 0; font-size:14px; color:#374151; line-height:1.6;">
                        Warm regards,<br>
                        <strong style="color:#111827;">The BrickNation Team</strong>
                    </p>
                </td>
            </tr>

            <!-- Footer -->
            <tr>
                <td style="padding:20px 36px; background-color:#f9fafb; border-top:1px solid #f3f4f6; text-align:center; color:#9ca3af; font-size:12px; line-height:1.5;">
                    This is an automated security notification sent to <strong style="color:#6b7280;">${userEmail}</strong>.<br>
                    Please do not reply directly to this email.
                </td>
            </tr>
        </table>
    </body>
    </html>
    `

    await sendEmail({
        email: user.email,
        subject: 'BrickNation Password Recovery',
        message: textMessage,
        html
    })
}

module.exports = { sendPasswordResetEmail }

