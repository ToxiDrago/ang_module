import { ITour } from '../app/models/tours';

export class TourDto implements ITour {
  id: string;
  name: string;
  description: string;
  tourOperator: string;
  price: string;
  img: string;
  type?: string;
  date?: string;
}
