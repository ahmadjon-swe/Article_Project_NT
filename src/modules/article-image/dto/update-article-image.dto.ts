import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";


export class UpdateArticleImageDto {
  @IsInt()
  @Type(()=>Number)
  @ApiProperty({default: 1, nullable: true})
  order?: number
}
