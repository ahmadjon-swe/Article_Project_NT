import { BaseEntity } from "src/database/entities/base.entity";
import { Article } from "src/modules/article/entities/article.entity";
import { Auth } from "src/modules/auth/entities/auth.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from "typeorm";

@Entity({name: "tag"})
export class Tag extends BaseEntity{
  @Column({
    type: "varchar",
    nullable: false,
    unique: true
  })
  name!: string

  @ManyToOne(()=>Auth, auth=>auth.tags, {nullable: false})
  @JoinColumn({name: "user_id"})
  createdBy!: Auth

  @ManyToMany(()=>Article, article=>article.tags, {nullable: true})
  articles?: Article[]
}