import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ToursService } from '../../backend-services/tours.service';
import { Tour } from '../../../shemas/tour';
import { TourDto } from '../../../dto/tour-dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('tours')
@UseGuards(JwtAuthGuard)
export class ToursController {
  constructor(private toursService: ToursService) {}

  // Генерация туров (POST /tours/generate)
  @Post('generate')
  async initTours(): Promise<void> {
    await this.toursService.generateTours();
  }

  // Создание тура (POST /tours)
  @Post()
  async createTour(@Body() tourDto: TourDto): Promise<Tour> {
    return this.toursService.createTour(tourDto);
  }

  // Удаление всех туров (DELETE /tours)
  @Delete()
  async removeAllTours(): Promise<void> {
    await this.toursService.deleteTours();
  }

  // Удаление тура по id (DELETE /tours/:id)
  @Delete(':id')
  async deleteTourById(@Param('id') id: string): Promise<Tour> {
    return this.toursService.deleteTourById(id);
  }

  // Получение всех туров (GET /tours)
  @Get()
  getTours(): Promise<Tour[]> {
    return this.toursService.getAllTours();
  }

  // Получение тура по id (GET /tours/:id)
  @Get(':id')
  getTourById(@Param('id') id: string): Promise<Tour> {
    return this.toursService.getTourById(id);
  }
}
