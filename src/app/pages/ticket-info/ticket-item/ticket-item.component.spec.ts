import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';

import { TicketItemComponent } from './ticket-item.component';
import { AuthService } from '../../../services/auth/auth.service';

describe('TicketItemComponent', () => {
  let component: TicketItemComponent;
  let fixture: ComponentFixture<TicketItemComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [], {
      user: { _id: 'test-user-id', login: 'test-user' },
    });

    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        CardModule,
        CalendarModule,
      ],
      declarations: [TicketItemComponent],
      providers: [
        MessageService,
        { provide: AuthService, useValue: authServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    mockAuthService = TestBed.inject(
      AuthService
    ) as jasmine.SpyObj<AuthService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketItemComponent);
    component = fixture.componentInstance;
    // Добавляем мок-объект ticket, чтобы избежать ошибки чтения name
    component.ticket = { name: 'Test Tour' } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
