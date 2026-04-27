import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, Search } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Tag } from '../tag/entities/tag.entity';
import { QueryArticleDto } from './dto/query.dto';

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

  async findAll(dto: QueryArticleDto) {

    const {search, page=1, limit=10} = dto

    const queryBuilder = this.articleRepo.createQueryBuilder("article")
    .leftJoinAndSelect("article.tags", "tags")
    .where("article.deletedAt is null")

    if(search) {
      queryBuilder.andWhere("article.title ILIKE :search or article.content ILIKE :search or tags.name ILIKE :search", 
        {search: `%${search}%`})
    }

    const result = queryBuilder
    .orderBy("article.id", "ASC")
    .skip((page - 1)*limit)
    .limit(limit)
    .getMany

    const totalPage = Math.ceil((await queryBuilder.getCount()/limit))

    return {
      totalPage,
      prev: page>1?page-1:undefined,
      next: page<totalPage?page+1:undefined,
      result
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
