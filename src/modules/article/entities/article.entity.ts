import { BaseEntity } from "src/database/entities/base.entity";
import { Column, Entity } from "typeorm";

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
}
