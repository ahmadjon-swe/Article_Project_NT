import {
  Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
  Query
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth,
  ApiConsumes,
  ApiInternalServerErrorResponse
} from '@nestjs/swagger';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { CreateFileArticleDto } from './dto/create-file-article.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path from 'path';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesUser } from 'src/shared/enums/roles.enum';
import { QueryArticleDto } from './dto/query.dto';

@ApiBearerAuth("JWT-auth")
@ApiTags('Articles')
@ApiInternalServerErrorResponse({description: "Interval server error"})
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  // POST /article
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesUser.ADMIN, RolesUser.SUPERADMIN, RolesUser.USER)
  @Post('add_article')
  @ApiOperation({ summary: 'Create a new article' })
  @ApiBody({ type: CreateFileArticleDto })
  @ApiResponse({ status: 201, description: 'Article successfully created', type: Article })
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
  create(@Body() createArticleDto: CreateArticleDto, @UploadedFile() file: Express.Multer.File, @Req() req) {
    return this.articleService.create(createArticleDto, file, req.user.id);
  }

  // GET /article
  @Get('get_all_articles')
  @ApiOperation({ summary: 'Get all articles' })
  @ApiResponse({ status: 200, description: 'List of all articles', type: [Article] })
  findAll(@Query() queryArticleDto: QueryArticleDto) {
    return this.articleService.findAll(queryArticleDto);
  }

  // GET /article/:id
  @Get('get_article/:id')
  @ApiOperation({ summary: 'Get article by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Article ID' })
  @ApiResponse({ status: 200, description: 'Article found', type: Article })
  @ApiResponse({ status: 404, description: 'Article not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.articleService.findOne(id);
  }

  // PATCH /article/:id
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesUser.ADMIN, RolesUser.SUPERADMIN, RolesUser.USER)
  @Patch('update_article/:id')
  @ApiOperation({ summary: 'Update article by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Article ID' })
  @ApiBody({ type: UpdateArticleDto })
  @ApiResponse({ status: 200, description: 'Article successfully updated' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(id, updateArticleDto);
  }

  // DELETE /article/:id
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesUser.ADMIN, RolesUser.SUPERADMIN, RolesUser.USER)
  @Delete('delete_article/:id')
  @ApiOperation({ summary: 'Delete article by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Article ID' })
  @ApiResponse({ status: 200, description: 'Article successfully deleted' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.articleService.remove(id);
  }
}