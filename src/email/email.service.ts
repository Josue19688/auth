import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendEmailDto } from './dto/sendEmail.dto';

@Injectable()
export class EmailService {
  constructor(private mailService:MailerService){}

  async sendEmail(sendEmailDto:SendEmailDto){
    const {email} = sendEmailDto;
    const response =await this.mailService.sendMail({
      to:email,
      from:'advinjosuev899@gmail.com',
      subject:'Enviado de Nest Js',
      template: 'index',
      context: {  // Data to be sent to template engine.
        code: 'cf1a3f828287',
        username: 'john doe',
      },
    })
    return response;
  }
}
