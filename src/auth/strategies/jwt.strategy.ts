import { Injectable } from "node_modules/@nestjs/common";
import { JwtService } from "node_modules/@nestjs/jwt";
import { CreateUserDto } from "src/dto/user.dto";
@Injectable()
export class JwtStrategy {
  constructor(private readonly jwtService: JwtService) {}

  async generateJwt(payload: CreateUserDto): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }
}
