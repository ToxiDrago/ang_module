import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { MessageService } from 'primeng/api';

import { RestInterceptorsService } from './rest-interceptors.service';

describe('RestInterceptorsService', () => {
  let service: RestInterceptorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [MessageService],
    });
    service = TestBed.inject(RestInterceptorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
