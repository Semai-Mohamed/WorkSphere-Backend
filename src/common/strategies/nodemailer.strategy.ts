/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { BadGatewayException, Injectable } from 'node_modules/@nestjs/common';
import { ConfigService } from 'node_modules/@nestjs/config';
import * as nodemailer from 'nodemailer';
import { EmailCheckDto } from 'src/dto/auth.dto';

@Injectable()
export class NodeMailderStrategy {
  constructor(private readonly configService: ConfigService) {}
  async sendResetEmail({ email }: EmailCheckDto, link: string) {
    const transporter = nodemailer.createTransport({
      host: this.configService.get<string>('HOST'),
      port: 587,
      secure: false,
      auth: {
        user: this.configService.get<string>('EMAIL'),
        pass: this.configService.get<string>('APP_PASSWORD'),
      },
    });
    try {
      await transporter.sendMail({
        from: 'WorkSphere',
        to: email,
        subject: 'Password Reset Request',
        html: `<p>You requested a password reset.</p>
             <p>Click <a href="${link}">here</a> to reset your password.</p>
             <p>This link will expire in 15 minutes.</p>`,
      });
    } catch (err: any) {
      throw new BadGatewayException(err);
    }
  }
}
