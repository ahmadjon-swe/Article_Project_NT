import { BaseEntity } from "src/database/entities/base.entity";
import { Article } from "src/modules/article/entities/article.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity({name: "article_image"})
export class ArticleImage extends BaseEntity{
  @Column()
  order!: number

  @Column()
  url!: string

  @ManyToOne(()=>Article, article=>article.images)
  @JoinColumn({name: "article_id"})
  article!: Article
}
