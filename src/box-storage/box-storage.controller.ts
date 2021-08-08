import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { BoxStorageService } from './box-storage.service';
import { BoxStorage } from '@prisma/client';
import { CreateBoxStorageDto } from './dto/create-box-storage.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('boxStorage')
@Controller('box-storage')
export class BoxStorageController {
  constructor(private readonly boxStorageService: BoxStorageService) {}

  @Get()
  async getBoxStorage(): Promise<BoxStorage[]> {
    return await this.boxStorageService.getBoxStorage();
  }

  @Get(':id')
  async getUserBoxStorage(@Param('id') id: string): Promise<BoxStorage[]> {
    return await this.boxStorageService.getUserBoxStorage({ ownerId: id });
  }

  @Post()
  async createBoxStorage(
    @Body() body: CreateBoxStorageDto,
  ): Promise<BoxStorage | ForbiddenException> {
    return this.boxStorageService.createBoxStorage(body);
  }

  @Delete(':id')
  async deleteBoxStorage(@Param('id') id: number) {
    return this.boxStorageService.deleteBoxStorage({ id: id });
  }
}
