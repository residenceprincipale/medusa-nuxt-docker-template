import { AbstractNotificationProviderService } from "@medusajs/framework/utils"
import { Logger } from "@medusajs/framework/types"
import nodemailer, { Transporter } from "nodemailer"

type SmtpOptions = {
  host?: string
  port?: number
  secure?: boolean
  user?: string
  pass?: string
  from?: string
}

class SmtpNotificationProviderService extends AbstractNotificationProviderService {
  static identifier = "smtp"
  protected logger_!: Logger
  protected transporter_!: Transporter
  protected from_: string
  protected host_: string

  constructor(container: { logger: Logger }, options: SmtpOptions) {
    super()
    this.logger_ = container.logger
    this.from_ = options.from || options.user || "no-reply@localhost"
    this.host_ = options.host || ""
    this.transporter_ = nodemailer.createTransport({
      host: options.host,
      port: Number(options.port) || 587,
      secure: options.secure ?? false,
      auth: options.user ? { user: options.user, pass: options.pass } : undefined,
    })
  }

  async send(notification: any): Promise<{ id: string }> {
    if (!this.host_) {
      this.logger_?.warn?.("SMTP not configured; skipping email to " + notification.to)
      return { id: "skipped" }
    }
    const data = notification.data ?? {}
    const info = await this.transporter_.sendMail({
      from: this.from_,
      to: notification.to,
      subject: data.subject ?? "Notification",
      html: data.html,
      text: data.text,
    })
    return { id: info.messageId }
  }
}

export default SmtpNotificationProviderService
