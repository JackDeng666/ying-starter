import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { createTransport, Transporter } from 'nodemailer'
import { mailConfig } from '@/server/config'

@Injectable()
export class MailService {
  transporter: Transporter

  constructor(
    @Inject(mailConfig.KEY)
    private readonly mailConf: ConfigType<typeof mailConfig>
  ) {
    this.transporter = createTransport({
      host: this.mailConf.host,
      port: this.mailConf.port,
      auth: {
        user: this.mailConf.user,
        pass: this.mailConf.code
      }
    })
  }

  async sendMail(email: string, subject: string, html: string) {
    await this.transporter.sendMail({
      from: this.mailConf.user,
      to: email,
      subject,
      html
    })
  }
}
