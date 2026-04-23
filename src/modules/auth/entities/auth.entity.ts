import { BaseEntity } from "src/database/entities/base.entity";
import { Article } from "src/modules/article/entities/article.entity";
import { Tag } from "src/modules/tag/entities/tag.entity";
import { RolesUser } from "src/shared/enums/roles.enum";
import { Column, Entity, OneToMany } from "typeorm";

@Entity({name: "auth"})
export class Auth extends BaseEntity{
  @Column({
    type: "varchar",
    nullable: false
  })
  username!: string

  @Column({
    type: "varchar",
    nullable: false
  })
  email!: string

  @Column({
    type: "enum",
    enum: RolesUser,
    default: RolesUser.USER
  })
  role!: string

  @Column({
    type: "varchar",
    nullable: false
  })
  password!: string

  @Column({
    type: "varchar",
    nullable: true
  })
  otp?: string

  @Column({type: "bigint", nullable: true})
  otpTime?: number

  @OneToMany(()=>Article, article=>article.createdBy, {nullable: true})
  articles?: Article[]

  @OneToMany(()=>Tag, tag=>tag.createdBy, {nullable: true})
  tags?: Tag[]
}
