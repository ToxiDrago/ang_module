import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ToursService } from '../../services/tours/tours.service';
import { Tour } from '../../../shemas/tour';
import { TourDto } from '../../../dto/tour-dto';

@Controller('tours')
export class ToursController {
  constructor(private toursService: ToursService) {}

  @Get()
  getAllTours(): Promise<Tour[]> {
    return this.toursService.getAllTours();
  }

  @Get(':id')
  getTourById(@Param('id') id: string): Promise<Tour> {
    return this.toursService.getTourById(id);
  }

  @Post()
  createTour(@Body() data: TourDto): Promise<Tour> {
    return this.toursService.createTour(data);
  }

  @Put(':id')
  updateTour(
    @Param('id') id: string,
    @Body() data: Partial<TourDto>
  ): Promise<Tour> {
    return this.toursService.updateTour(id, data);
  }

  @Delete()
  deleteTours(): Promise<any> {
    return this.toursService.deleteTours();
  }

  @Delete(':id')
  deleteTourById(@Param('id') id: string): Promise<Tour> {
    return this.toursService.deleteTourById(id);
  }
}
