import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { StatisticService } from './statistic.service';

describe('StatisticService', () => {
  let service: StatisticService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(StatisticService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
