import { Body, Controller, Post } from '@nestjs/common';
import { BoxService } from './box.service';

@Controller('box')
export class BoxController {
  constructor(private readonly boxService: BoxService) {}
  @Post()
  async createBox(@Body() box) {
    return this.boxService.createBox(box);
  }
}
