import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { TicketRestService } from './ticket-rest.service';

describe('TicketRestService', () => {
  let service: TicketRestService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(TicketRestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
