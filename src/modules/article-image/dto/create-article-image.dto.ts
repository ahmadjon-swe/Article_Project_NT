import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";

export class CreateArticleImageDto {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({default: 1})
  articleId!: number
}
