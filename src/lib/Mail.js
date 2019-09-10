import nodemailer from 'nodemailer';
import { resolve } from 'path';
import hbsexpress from 'express-handlebars';
import nodemailerhbs from 'nodemailer-express-handlebars';
import mail from '../config/mail';

class Mail {
  constructor() {
    const { host, port, secure, auth } = mail;
    this.transponder = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: mail.auth ? auth : null,
    });

    this.configureTemplate();
  }

  configureTemplate() {
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');
    this.transponder.use(
      'compile',
      nodemailerhbs({
        viewEngine: hbsexpress.create({
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
          defaultLayout: 'default',
          extname: '.hbs',
        }),
        viewPath,
        extName: '.hbs',
      })
    );
  }

  sendMail(message) {
    return this.transponder.sendMail({
      ...mail.default,
      ...message,
    });
  }
}

export default new Mail();
