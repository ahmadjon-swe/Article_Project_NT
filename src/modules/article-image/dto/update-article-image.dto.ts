import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";


export class UpdateArticleImageDto {
  @IsInt()
  @ApiProperty({default: 1, nullable: true})
  order?: number
}
