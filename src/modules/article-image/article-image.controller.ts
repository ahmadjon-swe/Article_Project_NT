import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFiles, UploadedFile } from '@nestjs/common';
import { ArticleImageService } from './article-image.service';
import { CreateArticleImageDto } from './dto/create-article-image.dto';
import { UpdateArticleImageDto } from './dto/update-article-image.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiInternalServerErrorResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesUser } from 'src/shared/enums/roles.enum';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path from 'path';
import { CreateImageDto } from './dto/create-image.dto';
import { ArticleImage } from './entities/article-image.entity';
import { UpdateImageDto } from './dto/update-image.dto';

@ApiBearerAuth("JWT-auth")
@ApiInternalServerErrorResponse({description: "Interval server error"})
@Controller('article_image')
export class ArticleImageController {
  constructor(private readonly articleImageService: ArticleImageService) {}

  @UseGuards(AuthGuard, RolesGuard)
    @Roles(RolesUser.ADMIN, RolesUser.SUPERADMIN, RolesUser.USER)
    @Post('add_article_image')
    @ApiOperation({ summary: 'Create a new article' })
    @ApiBody({ type: CreateImageDto })
    @ApiResponse({ status: 201, description: 'Article successfully created', type: ArticleImage })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiConsumes("multipart/form-data")
    @UseInterceptors(
      FilesInterceptor("files", 10, {
        storage: diskStorage({
          destination: path.join(process.cwd(), "uploads"),
          filename: (req, file, cb) => {
            const uniqueSuffix = `${file.originalname}-${Date.now()}`
            const ext = path.extname(file.originalname)
            cb(null, `${uniqueSuffix}${ext}`)
          }
        })
      })
    )
  create(@Body() createArticleImageDto: CreateArticleImageDto, @UploadedFiles() files: Express.Multer.File[]) {
    return this.articleImageService.create(createArticleImageDto, files);
  }

  @Get('get_all_images')
  findAll() {
    return this.articleImageService.findAll();
  }

  @Get('get_images_by_article')
  findByArticle(@Param('id') id: string) {
    return this.articleImageService.findByArticle(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleImageService.findOne(+id);
  }

  @UseGuards(AuthGuard, RolesGuard)
    @Roles(RolesUser.ADMIN, RolesUser.SUPERADMIN, RolesUser.USER)
    @Post('add_article')
    @ApiOperation({ summary: 'Create a new article' })
    @ApiBody({ type: UpdateImageDto })
    @ApiResponse({ status: 201, description: 'Article successfully created', type: ArticleImage })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiConsumes("multipart/form-data")
    @UseInterceptors(
      FileInterceptor("file", {
        storage: diskStorage({
          destination: path.join(process.cwd(), "uploads"),
          filename: (req, file, cb) => {
            const uniqueSuffix = `${file.originalname}-${Date.now()}`
            const ext = path.extname(file.originalname)
            cb(null, `${uniqueSuffix}${ext}`)
          }
        })
      })
    )
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleImageDto: UpdateArticleImageDto, @UploadedFile() file: Express.Multer.File) {
    return this.articleImageService.update(+id, updateArticleImageDto, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleImageService.remove(+id);
  }
}
