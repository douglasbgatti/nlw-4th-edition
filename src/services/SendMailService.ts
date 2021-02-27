import nodemailer, { Transporter } from "nodemailer";
import fs from "fs";
import path from "path";
import handlebars from "handlebars";

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

  async execute(mailProperties: MailProperties) {
    const html = this.getMailBodyHtml(mailProperties);

    const info = await this.client.sendMail({
      to: mailProperties.to,
      html,
      subject: mailProperties.subject,
      from: mailProperties.from || "NPS <noreply@nps.com>",
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }

  private getTemplateFileContent(templatePath: string[]) {
    const _templatePath = path.resolve(__dirname, ...templatePath);
    const templateFileContent = fs
      .readFileSync(_templatePath)
      .toString("utf-8");

    return templateFileContent;
  }

  private getMailBodyHtml(mailProperties: MailProperties) {
    const templateFileContent = this.getTemplateFileContent(
      mailProperties.templatePath
    );

    const mailTemplateParse = handlebars.compile(templateFileContent);

    const html = mailTemplateParse({
      ...mailProperties.variables,
    });

    return html;
  }
}

export default new SendMailService();
