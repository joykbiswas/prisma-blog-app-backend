import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", 
  }),
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,

    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
        const info = await transporter.sendMail({
          from: 'Prisma Blog" <prismablog@ph.com>',
          to: user.email,
          subject: "Email Verify your email",
          html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Verify your email</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0; padding:0; background-color:#f4f4f7; font-family: Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7; padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden;">
          <tr>
            <td style="padding:24px 32px; text-align:center; background:#0d6efd; color:#ffffff;">
              <h1 style="margin:0; font-size:22px;">Verify your email address</h1>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 32px; color:#333333;">
              <p style="font-size:15px; line-height:1.6; margin:0 0 16px;">
                Hi ${user.name},
              </p>

              <p style="font-size:15px; line-height:1.6; margin:0 0 16px;">
                Thanks for signing up! Please confirm that this is your email address by clicking the button below.
              </p>

              <p style="text-align:center; margin:28px 0;">
                <a href="${verificationUrl}" 
                   style="background-color:#0d6efd; color:#ffffff; padding:12px 22px; text-decoration:none; border-radius:6px; display:inline-block; font-weight:bold;">
                  Verify Email
                </a>
              </p>

              <p style="font-size:13px; color:#555; line-height:1.6; margin:0 0 10px;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>

              <p style="font-size:13px; word-break:break-all; color:#0d6efd; margin:0 0 16px;">
                ${verificationUrl}
              </p>

              <p style="font-size:13px; color:#555; line-height:1.6;">
                This verification link will expire soon for security reasons.
        If you did not create an account, you can safely ignore this email.
              </p>

              <p style="font-size:13px; color:#555; line-height:1.6;">
               Regards, <br />
            <strong>Prisma Blog Team</strong>
             </p>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 32px; text-align:center; font-size:12px; color:#888888; background:#fafafa;">
              © 2026 Prisma Blog — All rights reserved
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`,
        });
        console.log("Message sent:", info.messageId);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  },

  socialProviders: {
        google: { 
           prompt: "select_account consent", 
           accessType: "offline",      
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
});
