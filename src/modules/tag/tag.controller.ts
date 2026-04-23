import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { ApiBearerAuth, ApiBody, ApiInternalServerErrorResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesUser } from 'src/shared/enums/roles.enum';

@ApiBearerAuth("JWT-auth")
@ApiInternalServerErrorResponse({description: "Interval server error"})
@ApiTags("Tag")
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesUser.ADMIN, RolesUser.SUPERADMIN, RolesUser.USER)
  @Post('add_tag')
  @ApiBody({type: CreateTagDto})
  create(@Body() createTagDto: CreateTagDto, @Req() req) {
    return this.tagService.create(createTagDto, req.user.id)
  }

  @Get('get_all_tags')
  findAll() {
    return this.tagService.findAll();
  }

  @Get('get_tag/:id')
  findOne(@Param('id') id: string) {
    return this.tagService.findOne(+id);
  }

  
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesUser.ADMIN, RolesUser.SUPERADMIN, RolesUser.USER)
  @Patch('update_tag/:id')
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagService.update(+id, updateTagDto);
  }

  
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesUser.ADMIN, RolesUser.SUPERADMIN, RolesUser.USER)
  @Delete('delete_tag/:id')
  remove(@Param('id') id: string) {
    return this.tagService.remove(+id);
  }
}
