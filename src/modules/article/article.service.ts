import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ArticleService {
  constructor(@InjectRepository(Article) private articleRepo: Repository<Article>){}

  async create(createArticleDto: CreateArticleDto, file: Express.Multer.File) {
    const article = this.articleRepo.create(createArticleDto)
    article.backgroundImage = `/uploads/${file.filename}`;
    return await this.articleRepo.save(article)
  }

  async findAll() {
    try {
      
      return await this.articleRepo.find()
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async findOne(id: number): Promise<Article> {
    const foundArticle =  await this.articleRepo.findOne({where: {id}})
    if(!foundArticle) throw new NotFoundException("Article is not found")
    return foundArticle
  }

  async update(id: number, updateArticleDto: UpdateArticleDto): Promise<{message: string}> {
    const foundArticle =  await this.articleRepo.findOne({where: {id}})
    if(!foundArticle) throw new NotFoundException("Article is not found")

    // await this.articleRepo.update({id: foundArticle.id}, updateArticleDto)

    const merged = this.articleRepo.merge(foundArticle, updateArticleDto)

    await this.articleRepo.save(merged)

    return {message: "Article updated"};
  }

  async remove(id: number): Promise<{message: string}> {
    const foundArticle =  await this.articleRepo.findOne({where: {id}})
    if(!foundArticle) throw new NotFoundException("Article is not found")

    await this.articleRepo.delete({id})
    return {message: "Article deleted"}
  }
}
