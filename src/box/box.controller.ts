import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BoxService } from './box.service';

@Controller('box')
export class BoxController {
  constructor(private readonly boxService: BoxService) {}

  @Get(':id')
  async getBox(@Param('id') id) {
    return this.boxService.getBox({ id: +id });
  }

  @Post()
  async createBox(@Body() box) {
    return this.boxService.createBox(box);
  }
}
