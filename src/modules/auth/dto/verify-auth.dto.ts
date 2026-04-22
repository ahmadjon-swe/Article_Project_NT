import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumberString, IsString} from "class-validator";

export class VerifyAuthDto {
  @IsString()
  @IsEmail()
  @ApiProperty({default: "muhammadalishuhratjonov50@gmail.com"})
  email!: string;

  @IsNumberString()
  @ApiProperty({default: '000000'})
  otp!: string
}
