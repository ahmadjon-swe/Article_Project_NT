import { Module } from '@nestjs/common';
import { ArticleImageService } from './article-image.service';
import { ArticleImageController } from './article-image.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleImage } from './entities/article-image.entity';
import { AuthModule } from '../auth/auth.module';
import { Article } from '../article/entities/article.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleImage, Article]), AuthModule],
  controllers: [ArticleImageController],
  providers: [ArticleImageService],
})
export class ArticleImageModule {}
