import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ArticleModule } from './modules/article/article.module';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Article } from "./modules/article/entities/article.entity";
import { Auth } from "./modules/auth/entities/auth.entity";
import { TagModule } from "./modules/tag/tag.module";
import { Tag } from "./modules/tag/entities/tag.entity";
import { ArticleImageModule } from "./modules/article-image/article-image.module";
import { ArticleImage } from "./modules/article-image/entities/article-image.entity";


@Module({
  imports: [
    ConfigModule.forRoot({envFilePath: ".env", isGlobal: true}),
    TypeOrmModule.forRoot({
      type: "postgres",
      port: 5432,
      username: "postgres",
      host: "localhost",
      database: String(process.env.DB_NAME as string),
      password: String(process.env.DB_PASSWORD as string),
      entities: [Auth, Article, Tag, ArticleImage],
      synchronize: true,
      // dropSchema: true,
      logging: false  
    }),
    ArticleModule,
    AuthModule,
    TagModule,
    ArticleImageModule
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}