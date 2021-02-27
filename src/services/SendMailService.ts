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
      subject: mailProperties.subject,
      html,
      from: mailProperties.from || "NPS <noreply@nps.com>",
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }

  private getTemplateFileContent(template: string) {
    const templatePath = path.resolve(
      __dirname,
      "..",
      "views",
      "emails",
      template
    );
    const templateFileContent = fs.readFileSync(templatePath).toString("utf-8");

    return templateFileContent;
  }

  private getMailBodyHtml(mailProperties: MailProperties) {
    const templateFileContent = this.getTemplateFileContent(
      mailProperties.templateName
    );

    const mailTemplateParse = handlebars.compile(templateFileContent);

    const html = mailTemplateParse({
      name: mailProperties.to,
      title: mailProperties.subject,
      description: mailProperties.body,
    });

    return html;
  }
}

export default new SendMailService();
