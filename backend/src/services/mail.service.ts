import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  constructor(private configService: ConfigService) {}

  async sendEmail(to: string, subject: string, html: string) {
    const transporter = await this.startTransporter();

    await transporter.sendMail({
      from: this.configService.get<string>('EMAIL_SENDER'),
      to,
      subject,
      html,
    });

    transporter.close();
  }

  private async startTransporter() {
    const emailSender = this.configService.get<string>('EMAIL_SENDER');
    const emailPassword = this.configService.get<string>('EMAIL_PASSWORD');
    const smtpServer = this.configService.get<string>('SMTP_SERVER');
    const smtpPort = this.configService.get<string>('SMTP_PORT');

    return nodemailer.createTransport({
      host: smtpServer,
      port: +smtpPort,
      secure: smtpPort === '465',
      auth: {
        user: emailSender,
        pass: emailPassword,
      },
    });
  }
}
