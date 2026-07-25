import { NextResponse } from 'next/server';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { email: email.toLowerCase() } });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({ message: 'If an account exists, a reset link has been sent.' });
    }

    // Invalidate any existing tokens for this user
    await db.passwordResetToken.updateMany({
      where: { userId: user.id, used: false },
      data: { used: true },
    });

    // Create new token (expires in 1 hour)
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await db.passwordResetToken.create({
      data: { token, userId: user.id, expiresAt },
    });

    // Send email
    const resetUrl = `${process.env.APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"DevPilot AI" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: 'Reset your DevPilot AI password',
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0f0f14; color: #e4e4f0; border-radius: 16px;">
          <h1 style="font-size: 22px; font-weight: 700; margin-bottom: 8px;">Reset your password</h1>
          <p style="color: #9898b0; margin-bottom: 24px;">We received a request to reset the password for your DevPilot AI account. Click the button below to choose a new password.</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(to right, #3b82f6, #8b5cf6); color: white; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 15px;">Reset Password</a>
          <p style="margin-top: 24px; color: #9898b0; font-size: 13px;">This link expires in <strong style="color: #e4e4f0;">1 hour</strong>. If you didn't request this, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #1e1e2e; margin: 24px 0;" />
          <p style="color: #6060780; font-size: 12px;">DevPilot AI — Your AI Software Engineering Assistant</p>
        </div>
      `,
    });

    return NextResponse.json({ message: 'If an account exists, a reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Failed to send reset email' }, { status: 500 });
  }
}
