import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tour, TourDocument } from '../../../shemas/tour';
import { TourDto } from '../../../dto/tour-dto';

@Injectable()
export class ToursService {
  constructor(@InjectModel(Tour.name) private tourModel: Model<TourDocument>) {}

  async getAllTours(): Promise<Tour[]> {
    return this.tourModel.find();
  }

  async getTourById(id: string): Promise<Tour> {
    return this.tourModel.findById(id);
  }

  async createTour(data: TourDto): Promise<Tour> {
    const tourData = new this.tourModel(data);
    return tourData.save();
  }

  async updateTour(id: string, body: Partial<TourDto>): Promise<Tour> {
    return this.tourModel.findByIdAndUpdate(id, body, { new: true });
  }

  async deleteTourById(id: string): Promise<Tour> {
    return this.tourModel.findByIdAndDelete(id);
  }

  async deleteTours(): Promise<void> {
    await this.tourModel.deleteMany({});
  }

  async generateTours(): Promise<void> {
    // Здесь должна быть логика генерации туров (например, создание N тестовых туров)
    const tours: TourDto[] = [
      {
        id: '',
        name: 'Test Tour 1',
        description: 'Description 1',
        tourOperator: 'Operator 1',
        price: '1000',
        img: 'pic1.jpg',
        type: 'single',
        date: '2024-06-01',
      },
      {
        id: '',
        name: 'Test Tour 2',
        description: 'Description 2',
        tourOperator: 'Operator 2',
        price: '2000',
        img: 'pic2.jpg',
        type: 'multi',
        date: '2024-06-02',
      },
    ];
    await this.tourModel.deleteMany({});
    await this.tourModel.insertMany(tours);
  }
}
