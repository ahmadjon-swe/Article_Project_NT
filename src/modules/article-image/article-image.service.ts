import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleImageDto } from './dto/create-article-image.dto';
import { UpdateArticleImageDto } from './dto/update-article-image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleImage } from './entities/article-image.entity';
import { Repository } from 'typeorm';
import { Article } from '../article/entities/article.entity';
import fs from 'fs'
import path from 'path';

@Injectable()
export class ArticleImageService {
  constructor(
    @InjectRepository(ArticleImage) private articleImageRepo: Repository<ArticleImage>,
    @InjectRepository(Article) private articleRepo: Repository<Article>
){}

  async create(createArticleImageDto: CreateArticleImageDto, files: Express.Multer.File[]) {
    const foundedArticle = await this.articleRepo.findOne({where: {id: createArticleImageDto.articleId}, relations: ["images"]})

    if(!foundedArticle) throw new NotFoundException("Article is not found")

    if((foundedArticle.images.length+files.length)>10) throw new BadRequestException(`reached limit of images, ${10-foundedArticle.images.length} images can be added`)
    
    let order = (Math.max(...foundedArticle.images.map(v=>v.order)) || 0)+1

    const images: any = []
    for (const image of files) {
      const img = this.articleImageRepo.create({url: `/uploads/${image.filename}`, order, article: {id: createArticleImageDto.articleId}})
      images.push(await this.articleImageRepo.save(img))
      order++
    }

    return images
  }

  async findAll() {
    return await this.articleImageRepo.find();
  }

  async findByArticle(id: number) {
    const foundedArticle = await this.articleRepo.findOne({where: {id}, relations: ["images"]})

    if(!foundedArticle) throw new NotFoundException("Article is not found")

    return foundedArticle.images
  }

  

  async findOne(id: number) {
    return await this.articleImageRepo.findOne({where: {id}})
  }

  async update(id: number, updateArticleImageDto: UpdateArticleImageDto, file: Express.Multer.File) {
    const foundedImage = await this.articleImageRepo.findOne({where: {id}, relations: ["article"]})
    
    if(!foundedImage) throw new NotFoundException("article image is not found")

    if(updateArticleImageDto.order){
      const foundedImages = await this.articleImageRepo.find({where: {article: foundedImage.article}})
      const foundedOrder=foundedImages.find(v=>v.order===updateArticleImageDto.order)
      // berilgan orderda article-image bo'lsa orderini o'zgartiramiz
      if(foundedOrder){
        let order = (Math.max(...foundedImages.map(v=>v.order)) || 0)+1
        foundedOrder.order=order
        await this.articleImageRepo.save(foundedOrder)
      }
      foundedImage.order = updateArticleImageDto.order
    }

    if(file){
      const filePath = path.join(__dirname, `../../..${foundedImage.url}`)
      await fs.unlink(filePath, (err)=>{
        if(err){
          console.log(err.message);
          return
        }
        console.log("file o'chirildi");
      })

      foundedImage.url = `/uploads/${file.filename}`
    }

    return await this.articleImageRepo.save(foundedImage)
  }

  async remove(id: number) {
    const foundedImage = await this.articleImageRepo.findOne({where: {id}})
    
    if(!foundedImage) throw new NotFoundException("article image is not found")

    const filePath = path.join(__dirname, `../../..${foundedImage.url}`)
    await fs.unlink(filePath, (err)=>{
      if(err){
        console.log(err.message);
        return
      }
      console.log("file o'chirildi");
    })

    await this.articleImageRepo.delete({id})
  }
}
