import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";
import { CreateArticleImageDto } from "./create-article-image.dto";

export class CreateImageDto extends CreateArticleImageDto{
  @IsArray()
  @ApiProperty({
    type: "array", 
    items: {
      type: "string",
      format: "binary"
    }
  })
  files: Express.Multer.File[]
}