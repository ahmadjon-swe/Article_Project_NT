import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Tag } from '../tag/entities/tag.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article) private articleRepo: Repository<Article>,
    @InjectRepository(Tag) private tagRepo: Repository<Tag>,
  ){}

  async create(createArticleDto: CreateArticleDto, file: Express.Multer.File, userId) {

    const {title, content} = createArticleDto

    const tags = await this.tagRepo.find({where: {id: In(createArticleDto.tags)}})

    if(tags.length===0) throw new BadRequestException("you must add real tags")

    const article = this.articleRepo.create({title, content, tags, createdBy: userId})
    

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
    const foundArticle =  await this.articleRepo.findOne({where: {id}, relations: ["createdBy", "tags"]})
    if(!foundArticle) throw new NotFoundException("Article is not found")
    return foundArticle
  }

  async update(id: number, updateArticleDto: UpdateArticleDto): Promise<{message: string}> {
    const foundArticle =  await this.articleRepo.findOne({where: {id}})
    if(!foundArticle) throw new NotFoundException("Article is not found")

    const {title, content} = updateArticleDto

    // await this.articleRepo.update({id: foundArticle.id}, updateArticleDto)

    if(title) foundArticle.title = title
    if(content) foundArticle.content = content

    if(updateArticleDto.tags){
      const tags = await this.tagRepo.find({where: {id: In(updateArticleDto.tags)}})
      if(tags.length===0) throw new BadRequestException("you must add real tags")
    }
    

    await this.articleRepo.save(foundArticle)

    return {message: "Article updated"};
  }

  async remove(id: number): Promise<{message: string}> {
    const foundArticle =  await this.articleRepo.findOne({where: {id}})
    if(!foundArticle) throw new NotFoundException("Article is not found")

    await this.articleRepo.softDelete({id})
    return {message: "Article deleted"}
  }
}
