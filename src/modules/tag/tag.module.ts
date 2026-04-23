import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Auth } from '../auth/entities/auth.entity';
import { Tag } from './entities/tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auth, Tag]),
    AuthModule
  ],
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}
