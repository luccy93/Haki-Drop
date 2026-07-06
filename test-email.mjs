import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: { user: 'pookrish81@gmail.com', pass: 'ohlhjfazcalijnni' },
  tls: { rejectUnauthorized: false }
});
try {
  const info = await transporter.sendMail({
    from: '"One Piece Store" <pookrish81@gmail.com>',
    to: 'pookrish81@gmail.com',
    subject: 'Haki Drop - SMTP Test',
    html: '<p>SMTP is working correctly!</p>'
  });
  console.log('SUCCESS: ' + info.messageId);
} catch (err) {
  console.log('FAILED: ' + err.message);
}
