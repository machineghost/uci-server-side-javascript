import { randomBytes } from 'crypto';
import nodemailer from 'nodemailer'

const generatePasswordResetKey = async () =>
  (await randomBytes(16)).toString('hex');

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'fake-jokes-admin-address@gmail.com', pass: 'fake-gmail-password'
  }
});

const generatePasswordResetMessage = (display_name, key) => `
Hello ${display_name},
Someone requested that your password to the jokes site be reset.  If that was you, please visit our password reset page at www.example.com/reset and provide the following token: "${key}".  Otherwise, please disregard this email.
The Jokes Site
`;

export const sendResetEmail =
  async ({ display_name, email, id }) => {
    const key = await generatePasswordResetKey();
    // Since this is just an example (and I don't want to commit my gmail
    // password) this version will just log the email details instead
    console.log('"Sending" an email', {
      from: 'fake-jokes-admin-address@gmail.com',
      to: email,
      subject: 'Password Reset for Jokes Site',
      text: generatePasswordResetMessage(display_name, key)
    });
    // await transport.sendMail({
    //   from: 'fake-jokes-admin-address@gmail.com',
    //   to: email,
    //   subject: 'Password Reset for Jokes Site',
    //   text: generatePasswordResetMessage(display_name, key)
    // });
    return key;
  };

