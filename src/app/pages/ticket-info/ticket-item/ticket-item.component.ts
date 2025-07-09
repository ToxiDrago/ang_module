import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketStorageService } from '../../../services/ticket-storage/ticket-storage.service';
import { INearestTour, ITour, ITourLocation } from '../../../models/tours';
import { IUser } from '../../../models/users';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { forkJoin, fromEvent, Subscription } from 'rxjs';
import { TicketService } from '../../../services/ticket/ticket.service';
import { OrdersService } from '../../../services/orders/orders.service';
import { ToursHttpService } from '../../../services/tours/tours-http.service';

@Component({
  selector: 'app-ticket-item',
  templateUrl: './ticket-item.component.html',
  styleUrls: ['./ticket-item.component.scss'],
})
export class TicketItemComponent implements OnInit {
  ticket: ITour;
  isNotFound: boolean = false;

  user: IUser;
  userForm: FormGroup;

  nearestTours: INearestTour[] = [];
  tourLocations: ITourLocation[] = [];
  ticketSearchValue: string = '';
  @ViewChild('ticketSearch') ticketSearch: ElementRef;
  private ticketSearchSubsc: Subscription;
  private ticketRestSub: Subscription;
  searchTypes = [1, 2, 3];
  uploadTour: any = {};
  selectedFile: File | null = null;
  filePreviewUrl: string | ArrayBuffer | null = null;
  allTours: ITour[] = [];
  foundTours: ITour[] = [];

  constructor(
    private route: ActivatedRoute,
    private ticketStorage: TicketStorageService,
    private authService: AuthService,
    private ticketService: TicketService,
    private ordersService: OrdersService,
    private toursHttp: ToursHttpService // добавлен сервис
  ) {}

  ngOnInit(): void {
    this.ticketStorage
      .fetchTickets()
      .subscribe(this.setCurrentTicket.bind(this));
    this.setCurrentTicket();

    this.user = this.authService.user!;

    this.userForm = new FormGroup({
      firstName: new FormControl('', { validators: Validators.required }),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
      ]),
      cardNumber: new FormControl(''),
      birthday: new FormControl(''),
      age: new FormControl(22),
      citizenship: new FormControl(''),
    });

    this.toursHttp.getTours().subscribe((tours) => {
      this.allTours = tours;
    });

    forkJoin([
      this.ticketService.getNearestTours(),
      this.ticketService.getTourLocations(),
    ]).subscribe(([tours, locations]) => {
      this.tourLocations = locations;
      this.nearestTours = this.ticketService.transformData(tours, locations);
    });
  }

  ngAfterViewInit() {
    if (!this.ticketSearch) {
      return;
    }
    const fromEventObserver = fromEvent(
      this.ticketSearch.nativeElement,
      'keyup'
    );
    this.ticketSearchSubsc = fromEventObserver.subscribe((e) =>
      this.initSearchTour()
    );
  }

  ngOnDestroy() {
    this.ticketSearchSubsc?.unsubscribe();
  }

  getTourCountry(tour: INearestTour) {
    return (
      this.tourLocations.find(({ id }) => tour.locationId === id)?.name || '-'
    );
  }

  ngOnChange() {
    this.setCurrentTicket();
  }

  setCurrentTicket() {
    const routerId = this.route.snapshot.paramMap.get('id');
    if (routerId) {
      this.ticketService.getTicketById(routerId).subscribe({
        next: (ticket) => {
          if (!ticket) {
            this.isNotFound = true;
            return;
          }
          this.isNotFound = false;
          this.ticket = ticket;
        },
        error: () => {
          this.isNotFound = true;
        },
      });
    }
  }

  selectDate(ev: Date | PointerEvent) {
    const selected = ev instanceof PointerEvent ? undefined : ev;
    this.userForm.patchValue({
      birthday: selected,
    });
  }

  onSubmit() {
    if (!this.ticket || !this.user) return;
    const order = {
      age: this.userForm.value.age?.toString() ?? '',
      birthDay: this.userForm.value.birthday ?? '',
      cardNumber: this.userForm.value.cardNumber ?? '',
      tourId: this.ticket._id || this.ticket.id,
      userId: this.user._id,
    };
    this.ordersService.createOrder(order).subscribe(console.log);
  }

  initSearchTour() {
    const type = Math.floor(Math.random() * this.searchTypes.length);
    if (this.ticketRestSub && !this.ticketRestSub.closed) {
      this.ticketRestSub.unsubscribe();
    }

    this.ticketRestSub = this.ticketService
      .getRandomNearestEvent(type)
      .subscribe((data: any) => {
        this.nearestTours = this.ticketService.transformData(
          [data],
          this.tourLocations
        );
      });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.filePreviewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.selectedFile = null;
      this.filePreviewUrl = null;
    }
  }

  onUploadTour() {
    if (
      !this.uploadTour.name ||
      !this.uploadTour.description ||
      !this.uploadTour.price ||
      !this.selectedFile
    ) {
      return;
    }
    const formData = new FormData();
    formData.append('name', this.uploadTour.name);
    formData.append('description', this.uploadTour.description);
    formData.append('price', this.uploadTour.price);
    formData.append('file', this.selectedFile);
    this.toursHttp.uploadTour(formData).subscribe({
      next: (tour) => {
        alert('Тур успешно загружен!');
        this.uploadTour = {};
        this.selectedFile = null;
        // обновить список туров, если нужно
        this.ticketService.getTickets().subscribe();
      },
      error: (err) => {
        alert('Ошибка загрузки тура: ' + (err.error?.message || err.message));
      },
    });
  }

  searchToursByName(name: string) {
    const search = name.trim();
    if (!search) {
      this.foundTours = [];
      return;
    }
    this.toursHttp.searchToursByName(search).subscribe((tours) => {
      this.foundTours = tours;
    });
  }
}
