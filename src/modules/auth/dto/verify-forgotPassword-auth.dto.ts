import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumberString, IsString, Length} from "class-validator";

export class VerifyForgotPasswordAuthDto {
  @IsString()
  @IsEmail()
  @ApiProperty({default: "muhammadalishuhratjonov50@gmail.com"})
  email!: string;

  @IsNumberString()
  @ApiProperty({default: "000000"})
  otp!: string

  @IsString()
  @Length(6, 18)
  @ApiProperty({default: "password123"})
  password!: string;
}
