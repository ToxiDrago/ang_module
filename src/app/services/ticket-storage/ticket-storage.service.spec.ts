import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { TicketStorageService } from './ticket-storage.service';

describe('TicketStorageService', () => {
  let service: TicketStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(TicketStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
