import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { ConfigService } from './config.service';

describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(ConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
