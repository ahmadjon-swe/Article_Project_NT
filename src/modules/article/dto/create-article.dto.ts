import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsString, Length } from "class-validator"

export class CreateArticleDto {
  @IsString()
  @ApiProperty({default: "Express.js or Nest.js"})
  title!: string

  @IsString()
  @ApiProperty({default: "Express.js is easier to learn, Nesj.js is easy after you learn it."})
  content!: string
}
