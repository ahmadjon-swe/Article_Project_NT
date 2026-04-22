import {PickType} from "@nestjs/mapped-types";
import {CreateAuthDto} from "./create-auth.dto";
import { IsEmail, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

// export class ForgotPasswordAuthDto extends PickType(CreateAuthDto, ["email"]) {}

// Swagger uchun alohida yozildi
export class ForgotPasswordAuthDto {
  @IsString()
  @IsEmail()
  @ApiProperty({default: "muhammadalishuhratjonov50@gmail.com"})
  email!: string;
}
