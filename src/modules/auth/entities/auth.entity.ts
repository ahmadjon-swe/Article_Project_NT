import { BaseEntity } from "src/database/entities/base.entity";
import { RolesUser } from "src/shared/enums/roles.enum";
import { Column, Entity } from "typeorm";

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
}
