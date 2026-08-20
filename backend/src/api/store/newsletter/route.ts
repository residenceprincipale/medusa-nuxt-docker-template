import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { email } = (req.body || {}) as { email?: string }
  if (!email) {
    return res.status(400).json({ message: "Email is required" })
  }

  const notification = req.scope.resolve(Modules.NOTIFICATION)
  await notification.createNotifications({
    to: email,
    channel: "email",
    template: "newsletter-welcome",
    data: {
      subject: "You're subscribed!",
      html: `<h1>Thanks for subscribing!</h1><p>You're now on our newsletter list (${email}).</p>`,
    },
  })

  res.status(200).json({ ok: true })
}
