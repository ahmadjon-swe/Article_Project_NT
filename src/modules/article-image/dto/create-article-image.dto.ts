import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";

export class CreateArticleImageDto {
  @IsInt()
  @Type(()=>Number)
  @IsNotEmpty()
  @ApiProperty({default: 1})
  articleId!: number
}
