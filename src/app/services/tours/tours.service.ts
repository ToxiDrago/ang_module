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

  async deleteTours(): Promise<any> {
    return this.tourModel.deleteMany({});
  }

  async deleteTourById(id: string): Promise<Tour> {
    return this.tourModel.findByIdAndDelete(id);
  }
}
