import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
  Put,
} from '@nestjs/common';
import { ToursService } from '../../backend-services/tours.service';
import { Tour } from '../../../shemas/tour';
import { TourDto } from '../../../dto/tour-dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';

@Controller('tours')
@UseGuards(JwtAuthGuard)
export class ToursController {
  constructor(private toursService: ToursService) {}

  @Post('generate')
  async initTours(): Promise<void> {
    await this.toursService.generateTours();
  }

  @Post()
  async createTour(@Body() tourDto: TourDto): Promise<Tour> {
    return this.toursService.createTour(tourDto);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public',
        filename: (
          req: Request,
          file: Express.Multer.File,
          cb: (error: Error | null, filename: string) => void
        ) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowed = ['.jpg', '.jpeg', '.png'];
        const ext = extname(file.originalname).toLowerCase();
        if (!allowed.includes(ext)) {
          return cb(new Error('Только .jpg и .png файлы разрешены!'), false);
        }
        cb(null, true);
      },
    })
  )
  async uploadTour(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any
  ): Promise<Tour> {
    const tourDto: TourDto = {
      ...body,
      img: file ? file.filename : 'default.jpg',
    };
    return this.toursService.createTour(tourDto);
  }

  @Delete()
  async removeAllTours(): Promise<void> {
    await this.toursService.deleteTours();
  }

  @Delete(':id')
  async deleteTourById(@Param('id') id: string): Promise<Tour> {
    return this.toursService.deleteTourById(id);
  }

  @Put(':id')
  async updateTourById(
    @Param('id') id: string,
    @Body() tourDto: TourDto
  ): Promise<Tour> {
    return this.toursService.updateTour(id, tourDto);
  }

  @Get()
  getTours(): Promise<Tour[]> {
    return this.toursService.getAllTours();
  }

  @Get(':id')
  getTourById(@Param('id') id: string): Promise<Tour> {
    return this.toursService.getTourById(id);
  }

  @Get('search')
  async searchToursByName(@Query('name') name: string): Promise<Tour[]> {
    return this.toursService.getToursByName(name);
  }
}
