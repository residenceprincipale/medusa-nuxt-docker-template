import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { name, email, message } = (req.body || {}) as {
    name?: string
    email?: string
    message?: string
  }
  if (!email || !message) {
    return res.status(400).json({ message: "Email and message are required" })
  }

  const notification = req.scope.resolve(Modules.NOTIFICATION)
  await notification.createNotifications({
    to: email,
    channel: "email",
    template: "contact-form",
    data: {
      subject: "Contact form submission",
      html: `<p>From: ${name || "anonymous"} (${email})</p><p>${message}</p>`,
    },
  })

  res.status(200).json({ ok: true })
}
