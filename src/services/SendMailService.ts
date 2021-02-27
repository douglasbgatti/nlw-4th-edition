import nodemailer, { Transporter } from "nodemailer";

class SendMailService {
  private client: Transporter;

  constructor() {
    nodemailer
      .createTestAccount()
      .then((account) => {
        const transporter = nodemailer.createTransport({
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure,
          auth: {
            user: account.user,
            pass: account.pass,
          },
        });

        this.client = transporter;
      })
      .catch((err) => {
        console.error(`[SendMailService.createTestAccount] ${err.message}`);
      });
  }

  async execute(to: string, subject: string, body: string) {
    const info = await this.client.sendMail({
      to,
      subject,
      html: body,
      from: "NPS <noreply@nps.com>",
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }
}

export default new SendMailService();
