import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../dto/user.dto';


@Controller('auth')
export class AuthController {
    constructor(
        private authService : AuthService,
    ){}

    @HttpCode(HttpStatus.CREATED)
    @Post('signUp')
    signUp(@Body() signUpDto : CreateUserDto ){
      return signUpDto
    }
}