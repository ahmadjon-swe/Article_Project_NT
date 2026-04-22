import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsString, Length} from "class-validator";

export class LoginAuthDto {
  @IsString()
  @IsEmail()
  @ApiProperty({default: "muhammadalishuhratjonov50@gmail.com"})
  email!: string;

  @IsString()
  @Length(6, 18)
  @ApiProperty({default: "password123"})
  password!: string;
}
