interface MailProperties {
  to: string;
  from?: string;
  subject: string;
  body: string;
  variables: Object;
  templatePath: string[];
}
