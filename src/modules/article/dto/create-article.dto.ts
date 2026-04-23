import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsArray, IsInt, IsString } from "class-validator"

export class CreateArticleDto {
  @IsString()
  @ApiProperty({default: "Express.js or Nest.js"})
  title!: string

  @IsString()
  @ApiProperty({default: "Express.js is easier to learn, Nesj.js is easy after you learn it."})
  content!: string

  @IsArray()
  @Transform(({value})=>typeof value ==="string"?value.split(",").map(item=>Number(item)):value)
  @IsInt({each: true})
  @ApiProperty({default: [1, 2, 3]})
  tags!: number[]
}
