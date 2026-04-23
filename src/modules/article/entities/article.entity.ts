import { BaseEntity } from "src/database/entities/base.entity";
import { Auth } from "src/modules/auth/entities/auth.entity";
import { Tag } from "src/modules/tag/entities/tag.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from "typeorm";

@Entity({name: "article"})
export class Article extends BaseEntity {
  @Column({
    type: "varchar",
    nullable: false
  })
  title!: string

  @Column({
    type: "varchar",
    nullable: false
  })
  content!: string

  @Column()
  backgroundImage!: string

  @ManyToOne(()=>Auth, auth=>auth.articles, {nullable: false})
  @JoinColumn({name: "user_id"})
  createdBy: Auth

  @ManyToMany(()=>Tag, tag=>tag.articles, {nullable: false})
  @JoinTable({name: "tag_id"})
  tags: Tag[]

  
  @DeleteDateColumn({nullable: true})
  deletedAt?: Date
} 
