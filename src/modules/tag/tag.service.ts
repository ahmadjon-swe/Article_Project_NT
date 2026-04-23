import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { Auth } from '../auth/entities/auth.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag) private tagRepo: Repository<Tag>,
    @InjectRepository(Auth) private authRepo: Repository<Auth>
  ){}

  async create(createTagDto: CreateTagDto, userId) {
    const foundedTag = await this.tagRepo.findOne({where: {name: createTagDto.name}})

    if(foundedTag) throw new BadRequestException("Tag already exists")

    const createdBy = await this.authRepo.findOne({where: {id: userId}})

    if(!createdBy) throw new ForbiddenException("you are not authorized")
      
    const tag = this.tagRepo.create({...createTagDto, createdBy})

    await this.tagRepo.save(tag)
    return {message: "added new tag"}
  }

  async findAll() {
    return await this.tagRepo.find()
  }

  async findOne(id: number) {
    return await this.tagRepo.findOne({
      where: {id},
      relations: ["createdBy", "articles"]
    })
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
     const foundedTag = await this.tagRepo.findOne({where: {id}})

    if(!foundedTag) throw new BadRequestException("Tag is not exists")

    const updatedTag = this.tagRepo.merge(foundedTag, updateTagDto)
    await this.tagRepo.save(updatedTag)

    return {message: "tag has been updated"}
  }

  async remove(id: number) {
    const foundedTag = await this.tagRepo.findOne({where: {id}})

    if(!foundedTag) throw new BadRequestException("Tag is not exists")

    await this.tagRepo.delete({id})

    return {message: "Deleted"}
  }
}
