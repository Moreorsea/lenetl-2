import nodemailer from 'nodemailer'

export type NewSubmissionMailPayload = {
  id: number
  name: string
  phone: string
  email: string
  message: string
  filesCount: number
}

function getMailConfig() {
  const host = process.env.SMTP_HOST?.trim() || 'smtp.mail.ru'
  const port = Number(process.env.SMTP_PORT || 465)
  const user = process.env.SMTP_USER?.trim()
  const pass = process.env.SMTP_PASS?.trim()
  const from = process.env.SMTP_FROM?.trim() || (user ? `ЛенЭТЛ <${user}>` : undefined)
  const to = process.env.NOTIFY_EMAIL?.trim() || 'dastast@mail.ru'

  return { host, port, user, pass, from, to }
}

export function isMailConfigured(): boolean {
  const { host, user, pass, from } = getMailConfig()
  return Boolean(host && user && pass && from)
}

export async function sendNewSubmissionEmail(payload: NewSubmissionMailPayload): Promise<void> {
  const { host, port, user, pass, from, to } = getMailConfig()

  if (!host || !user || !pass || !from) {
    console.warn(
      '[mail] SMTP не настроен (SMTP_HOST / SMTP_USER / SMTP_PASS). Письмо о заявке не отправлено.',
    )
    return
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })

  const subject = `Новая заявка #${payload.id} — ЛенЭТЛ`
  const text = [
    `Поступила новая заявка #${payload.id}`,
    '',
    `Имя: ${payload.name}`,
    `Телефон: ${payload.phone}`,
    `Email: ${payload.email}`,
    `Файлов: ${payload.filesCount}`,
    '',
    'Сообщение:',
    payload.message,
    '',
    'Открыть в админке: /admin/submissions/' + payload.id,
  ].join('\n')

  const html = `
    <div style="font-family:Segoe UI,Arial,sans-serif;line-height:1.5;color:#0d1b2a">
      <h2 style="margin:0 0 12px">Новая заявка #${payload.id}</h2>
      <p style="margin:0 0 16px">На сайте ЛенЭТЛ появилась новая заявка.</p>
      <table style="border-collapse:collapse;width:100%;max-width:560px">
        <tr><td style="padding:6px 0;color:#546e7a">Имя</td><td style="padding:6px 0"><strong>${escapeHtml(payload.name)}</strong></td></tr>
        <tr><td style="padding:6px 0;color:#546e7a">Телефон</td><td style="padding:6px 0"><a href="tel:${escapeHtml(payload.phone)}">${escapeHtml(payload.phone)}</a></td></tr>
        <tr><td style="padding:6px 0;color:#546e7a">Email</td><td style="padding:6px 0"><a href="mailto:${escapeHtml(payload.email)}">${escapeHtml(payload.email)}</a></td></tr>
        <tr><td style="padding:6px 0;color:#546e7a">Файлов</td><td style="padding:6px 0">${payload.filesCount}</td></tr>
      </table>
      <p style="margin:16px 0 6px;color:#546e7a">Сообщение</p>
      <pre style="white-space:pre-wrap;margin:0;padding:12px;background:#f2f5f8;border:1px solid rgba(13,27,42,0.08)">${escapeHtml(payload.message)}</pre>
    </div>
  `

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  })
}

/** Не блокирует сохранение заявки при ошибке почты */
export function notifyNewSubmission(payload: NewSubmissionMailPayload): void {
  void sendNewSubmissionEmail(payload).catch((error) => {
    console.error('[mail] Не удалось отправить уведомление о заявке:', error)
  })
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}
