import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { to, hospitals, shareUrl } = await request.json()

    if (!to || !hospitals?.length) {
      return NextResponse.json(
        { error: 'Recipient email and hospitals are required' },
        { status: 400 }
      )
    }

    const hospitalList = hospitals
      .map(
        (h: { name: string; city: string; ownership: string }) =>
          `<li><strong>${h.name}</strong> — ${h.city} (${h.ownership})</li>`
      )
      .join('')

    const { data, error } = await resend.emails.send({
      from: 'Carefinder <onboarding@resend.dev>',
      to: [to],
      subject: `Hospital list shared via Carefinder`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <div style="background: #5B50F0; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🏥 Carefinder</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">Nigeria's Hospital Directory</p>
          </div>

          <div style="border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; padding: 24px;">
            <p style="color: #374151;">Someone shared a hospital list with you:</p>

            <ul style="color: #374151; line-height: 2;">
              ${hospitalList}
            </ul>

            
             <a href="${shareUrl}"
              style="display: inline-block; background: #5B50F0; color: white; padding: 12px 24px; border-radius: 999px; text-decoration: none; font-weight: 600; margin-top: 16px;"
            >
              View full list on Carefinder
            </a>

            <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">
              Carefinder · Nigeria's Civic Hospital Directory · Free and open health data
            </p>
          </div>
        </div>
      `,
    })

    if (error) {
      if (error.name === 'rate_limit_exceeded') {
        return NextResponse.json(
          { error: 'Too many emails sent. Please try again later.' },
          { status: 429 }
        )
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
