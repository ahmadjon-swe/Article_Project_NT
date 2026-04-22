import { ApiProperty } from "@nestjs/swagger"
import { IsString} from "class-validator"
import { CreateArticleDto } from "./create-article.dto"

export class CreateFileArticleDto extends CreateArticleDto {
  @IsString()
  @ApiProperty({type: "string", format: "binary"})
  file!: any
}
