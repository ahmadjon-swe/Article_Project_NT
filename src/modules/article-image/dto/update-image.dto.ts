import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { UpdateArticleImageDto } from "./update-article-image.dto";

export class UpdateImageDto extends UpdateArticleImageDto{
  @IsString()
  @ApiProperty({
      type: "string",
      format: "binary",
      nullable: true
  })
  file?: Express.Multer.File
}