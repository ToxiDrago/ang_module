import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { StatisticRestService } from './statistic-rest.service';

describe('StatisticRestService', () => {
  let service: StatisticRestService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(StatisticRestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
