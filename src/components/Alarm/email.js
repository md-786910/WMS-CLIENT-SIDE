// import nodemailer from 'nodemailer';

// console.log(process.env.REACT_APP_EMAIL_USERNAME);

// const transport = nodemailer.createTransport({
//     service: 'gmail',
//     secure: true,
//     auth: {
//         user: process.env.REACT_APP_EMAIL_USERNAME,
//         pass: process.env.REACT_APP_EMAIL_PASSWORD
//     }
// });

// const sendMessage = async () => {
//     try {
//         const mailOptions = {
//             from: process.env.REACT_APP_EMAIL_USERNAME, // Sender address
//             to: 'mdashifreza3@gmail.com', // List of recipients
//             subject: "Md Please Take Rest. Take 1 Glass Of Water", // Subject line
//             html: `
//             <h2>Take a break of 15 minute</h2>
//             `
//         };
//         const info = await transport.sendMail(mailOptions);
//         console.log(info);
//     } catch (error) {
//         console.log(error);
//         return new Error("Error sending message")
//     }
// }

// export {sendMessage};