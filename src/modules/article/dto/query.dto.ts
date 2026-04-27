import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString } from "class-validator";

export class QueryArticleDto {
  @IsInt()
  @Type(()=>Number)
  @ApiProperty({default: 1, minimum: 1})
  @IsOptional()
  page?: number

  @IsInt()
  @Type(()=>Number)
  @ApiProperty({default: 10, minimum: 1})
  @IsOptional()
  limit?: number

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  search?: number
}