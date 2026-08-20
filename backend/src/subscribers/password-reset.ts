import { SubscriberArgs, type SubscriberConfig } from "@medusajs/medusa"
import { Modules } from "@medusajs/framework/utils"

export default async function resetPasswordTokenHandler({
  event: {
    data: { entity_id: email, token, actor_type },
  },
  container,
}: SubscriberArgs<{ entity_id: string; token: string; actor_type: string }>) {
  const notification = container.resolve(Modules.NOTIFICATION)
  const config = container.resolve("configModule")

  const base =
    actor_type === "customer"
      ? config.admin.storefrontUrl || "http://localhost:3000"
      : `${config.admin.backendUrl || "http://localhost:9000"}${config.admin.path || ""}`

  const resetUrl = `${base}/auth/reset-password?token=${token}&email=${encodeURIComponent(email)}`

  await notification.createNotifications({
    to: email,
    channel: "email",
    template: "password-reset",
    data: {
      subject: "Reset your password",
      html: `
        <h1>Reset your password</h1>
        <p>We received a request to reset your password. Click the link below to choose a new one. This link expires soon.</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      `,
    },
  })
}

export const config: SubscriberConfig = {
  event: "auth.password_reset",
}
