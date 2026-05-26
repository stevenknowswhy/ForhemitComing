import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { strictLimiter, getClientIp, checkRateLimit } from '@/lib/ratelimit';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  // Rate limit by IP
  const rateLimitResponse = await checkRateLimit(strictLimiter, getClientIp(req));
  if (rateLimitResponse) return rateLimitResponse;
  try {
    const event = await req.json();

    if (event?.type === 'email.received') {
      const email = event.data;

      // Forward to Gmail
      await resend.emails.send({
        from: 'Agent Forward <agent@email.forhemit.com>',
        to: [process.env.GMAIL_FORWARD_TARGET || 'stefanostokes86@gmail.com'],
        subject: `Fwd: ${email.subject}`,
        html: `
          <p><strong>Forwarded by Agent</strong></p>
          <p><strong>From:</strong> ${email.from}</p>
          <p><strong>Subject:</strong> ${email.subject}</p>
          <hr/>
          ${email.html || email.text}
        `,
      });

      return NextResponse.json({ received: true }, { status: 200 });
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
