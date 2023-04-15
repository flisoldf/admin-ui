import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {ConfirmationService, MessageService} from 'primeng/api';
import {environment} from '../../../environments/environment';

interface GameBoxEvent {
  name: string,
  code: string
}

interface GameBoxEventDate {
  header: string,
  content: string
}

interface GameBoxEventTime {
  id: string,
  name: string,
  disabled: boolean,
  opened: boolean,
  canDefineStatus: boolean,
  tooltip: string,
  modalities: any[],
  modalityIcons: any[],
  modalityChips: any[],
  users: []
}

interface GameBoxEventSeat {
  id: number,
  user: string,
  modality: string,
  status: string
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  private readonly user: any;
  events: GameBoxEvent[] = [];
  selectedEvent: GameBoxEvent = {} as GameBoxEvent;
  dates: GameBoxEventDate[] = [];
  isDatesLoading = false;
  selectedDate: GameBoxEventDate = {} as GameBoxEventDate;
  isTimesLoading: boolean = false;
  times: GameBoxEventTime[] = [];
  selectedTime: GameBoxEventTime = {} as GameBoxEventTime;
  isSeatLoading: boolean = false;
  seats: GameBoxEventSeat[] = [];
  activeOnly: boolean = true;

  constructor(
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private confirmationService: ConfirmationService) {
    this.events = [];
    this.dates = [];
    this.times = [];
    this.seats = [];

    try {
      // @ts-ignore
      this.user = JSON.parse(localStorage.getItem('user'));

      if (this.user === null) {
        this.backToLogin();
      }
    } catch (e) {
      this.backToLogin();
    }

    if (this.user !== null) {
      this.events = [];
      this.http.get(environment.apiUrl + '/gamebox/events', {
        headers: {
          'Authorization': 'Bearer ' + this.user.token
        }
      }).subscribe({
        next: (r: any) => {
          // console.log(r);
          for (let i = 0; i < r.length; i++) {
            const evt = r[i];
            this.events.push({
              code: '' + evt.id,
              name: evt.period + ' - ' + evt.address + ', ' + evt.place
            } as GameBoxEvent);
          }

          this.selectedEvent = this.events[0];
          this.onChangeEvent();
        },
        error: (e) => {
          // console.log(e);
          this.backToLogin();
        },
        complete: () => {
        }
      });
    }
  }

  ngOnInit(): void {
  }

  onChangeEvent(event?: any): void {
    this.dates = [];
    this.selectedDate = {} as GameBoxEventDate;

    this.isDatesLoading = true;

    const now = new Date();
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    this.http.get(environment.apiUrl + '/gamebox/events/' + this.selectedEvent.code + '/dates', {
      headers: {
        'Authorization': 'Bearer ' + this.user.token
      }
    }).subscribe({
      next: (r: any) => {
        // console.log(r);
        for (let i = 0; i < r.length; i++) {
          const d = r[i];

          // Compare dates
          const year = parseInt(d.id.substring(0, 4), 10);
          const month = parseInt(d.id.substring(5, 7), 10);
          const date = parseInt(d.id.substring(8, 10), 10);
          const dateParsed = new Date(year, month - 1, date);

          if ((this.activeOnly) && (dateParsed < nowDate)) continue;

          this.dates.push({
            header: '' + d.name,
            content: d.id
          } as GameBoxEventDate);
        }

        this.cdr.detectChanges();
        this.selectedDate = this.dates[0];
        this.onChangeDate();
      },
      error: (e) => {
        // console.log(e);
        this.isDatesLoading = false;
        // this.backToLogin();
      },
      complete: () => {
        this.isDatesLoading = false;
      }
    });
  }

  onChangeActiveOnly(event?: any): void {
    // console.log(event);
    // console.log(this.activeOnly);
    this.onChangeEvent();
  }

  onChangeDate(event?: any): void {
    this.times = [];
    this.selectedTime = {} as GameBoxEventTime;

    if (event) {
      this.selectedDate = this.dates[event.index];
    }

    this.isTimesLoading = true;

    // console.log(this.selectedDate);
    const now = new Date();
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    // console.log(now.getHours(), now.getMinutes());

    // Compare dates
    const year = parseInt(this.selectedDate.content.substring(0, 4), 10);
    const month = parseInt(this.selectedDate.content.substring(5, 7), 10);
    const date = parseInt(this.selectedDate.content.substring(8, 10), 10);
    const dateParsed = new Date(year, month - 1, date);

    const today = (nowDate.getTime() === dateParsed.getTime());

    this.http.get(environment.apiUrl + '/gamebox/events/' + this.selectedEvent.code + '/dates/' + this.selectedDate.content, {
      headers: {
        'Authorization': 'Bearer ' + this.user.token
      }
    }).subscribe({
      next: (r: any) => {
        // console.log(r);

        for (let i = 0; i < r.length; i++) {
          const t = r[i];

          // Compare times
          const hours = parseInt(t.id.substring(0, 2), 10);
          const minutes = parseInt(t.id.substring(3, 5), 10);
          // console.log(t.id, hours, minutes);
          // console.log(now.getMinutes(), minutes);

          if ((today) && (this.activeOnly) && (hours < now.getHours() - 1)) continue;

          let disabled = false;
          let opened = false;
          let canDefineStatus = true;

          if (today) {
            const firstHalf = (0 <= minutes) && (30 > minutes);
            const secondHalf = (30 <= minutes) && (59 > minutes);
            // console.log(minutes, firstHalf, secondHalf);

            const nowFirstHalf = (0 <= now.getMinutes()) && (30 > now.getMinutes());
            const nowSecondHalf = (30 <= now.getMinutes()) && (59 > now.getMinutes());

            if (this.activeOnly) {
              if (hours < now.getHours()) {
                disabled = true;
              } else if (((hours <= now.getHours())) && ((firstHalf) && (nowSecondHalf))) {
                disabled = true;
              } else if ((hours == now.getHours()) && ((firstHalf === nowFirstHalf) || (secondHalf === nowSecondHalf))) {
                opened = true;
              }
            }
          } else {
            canDefineStatus = false;
          }

          const et = {
            id: '' + t.id,
            name: t.name,
            disabled,
            opened,
            canDefineStatus,
            tooltip: '<strong>' + this.selectedDate.header + ' - ' + t.name + '</strong>',
            modalities: t.modalities,
            modalityIcons: [],
            modalityChips: [],
            users: []
          } as GameBoxEventTime;

          if ((et.modalities) && ((et.modalities.length > 0))) {
            et.tooltip += '<ul>';

            for (let m = 0; m < et.modalities.length; m++) {
              const modality = et.modalities[m];

              if (modality.seats) {
                const seats = modality.seats;

                switch (modality.id) {

                  case 1: // Video game
                    if (seats.occupied === 1) {
                      et.tooltip += '<li style=\'color:green\'>' + seats.occupied + ' vídeo-game reservado</li>';
                      et.modalityChips.push({
                        label: seats.occupied + ' reservado',
                        icon: 'fal fa-gamepad-alt',
                        styleClass: 'mr-2 chip-occupied'
                      });
                    } else if (seats.occupied > 1) {
                      et.tooltip += '<li style=\'color:green\'>' + seats.occupied + ' vídeo-games reservados</li>';
                      et.modalityChips.push({
                        label: seats.occupied + ' reservados',
                        icon: 'fal fa-gamepad-alt',
                        styleClass: 'mr-2 chip-occupied'
                      });
                    } else {
                      et.modalityChips.push({
                        label: '0 reservado',
                        icon: 'fal fa-gamepad-alt',
                        styleClass: 'mr-2 chip-occupied'
                      });
                    }

                    if (seats.available === 1) {
                      et.tooltip += '<li style=\'color:tomato\'>' + seats.available + ' vídeo-game disponível</li>';
                      et.modalityChips.push({
                        label: seats.available + ' disponível',
                        icon: 'fal fa-gamepad-alt',
                        styleClass: 'mr-2 chip-available'
                      });
                    } else if (seats.available > 1) {
                      et.tooltip += '<li style=\'color:tomato\'>' + seats.available + ' vídeo-games disponíveis</li>';
                      et.modalityChips.push({
                        label: seats.available + ' disponíveis',
                        icon: 'fal fa-gamepad-alt',
                        styleClass: 'mr-2 chip-available'
                      });
                    } else {
                      et.modalityChips.push({
                        label: '0 disponível',
                        icon: 'fal fa-gamepad-alt',
                        styleClass: 'mr-2 chip-available'
                      });
                    }
                    break;

                  case 2: // Computer
                    if (seats.occupied === 1) {
                      et.tooltip += '<li style=\'color:green\'>' + seats.occupied + ' computador reservado</li>';
                      et.modalityChips.push({
                        label: seats.occupied + ' reservado',
                        icon: 'fal fa-keyboard',
                        styleClass: 'mr-2 chip-occupied'
                      });
                    } else if (seats.occupied > 1) {
                      et.tooltip += '<li style=\'color:green\'>' + seats.occupied + ' computadores reservados</li>';
                      et.modalityChips.push({
                        label: seats.occupied + ' reservados',
                        icon: 'fal fa-keyboard',
                        styleClass: 'mr-2 chip-occupied'
                      });
                    } else {
                      et.modalityChips.push({
                        label: '0 reservado',
                        icon: 'fal fa-keyboard',
                        styleClass: 'mr-2 chip-occupied'
                      });
                    }

                    if (seats.available === 1) {
                      et.tooltip += '<li style=\'color:tomato\'>' + seats.available + ' computador disponível</li>';
                      et.modalityChips.push({
                        label: seats.available + ' disponível',
                        icon: 'fal fa-keyboard',
                        styleClass: 'mr-2 chip-available'
                      });
                    } else if (seats.available > 1) {
                      et.tooltip += '<li style=\'color:tomato\'>' + seats.available + ' computadores disponíveis</li>';
                      et.modalityChips.push({
                        label: seats.available + ' disponíveis',
                        icon: 'fal fa-keyboard',
                        styleClass: 'mr-2 chip-available'
                      });
                    } else {
                      et.modalityChips.push({
                        label: '0 disponível',
                        icon: 'fal fa-keyboard',
                        styleClass: 'mr-2 chip-available'
                      });
                    }
                    break;
                }

                for (let s = 0; s < seats.occupied; s++) {
                  et.modalityIcons.push({
                    videoGame: modality.id === 1,
                    computer: modality.id === 2,
                    occupied: true,
                    available: false
                  });
                }

                for (let s = 0; s < seats.available; s++) {
                  et.modalityIcons.push({
                    videoGame: modality.id === 1,
                    computer: modality.id === 2,
                    occupied: false,
                    available: true
                  });
                }
              }
            }

            et.tooltip += '</ul>';
          }

          this.times.push(et);
        }

        this.cdr.detectChanges();
        this.selectedTime = this.times[0];
        // this.onTabTimeOpen();

        if ((this.times) && (this.times.length > 0)) {
          for (let i = 0; i < this.times.length; i++) {
            const time = this.times[i];

            if (time.opened) {
              this.selectedTime = time;
              this.onTabTimeOpen();
              break;
            }
          }
        }
      },
      error: (e) => {
        // console.log(e);
        this.isTimesLoading = false;
        // this.backToLogin();
      },
      complete: () => {
        this.isTimesLoading = false;
      }
    });
  }

  onTabTimeOpen(event?: any): void {
    this.seats = [];

    if (event) {
      this.selectedTime = this.times[event.index];
    }

    // console.log(this.selectedTime);

    this.isSeatLoading = true;

    this.http.get(environment.apiUrl + '/gamebox/events/' + this.selectedEvent.code + '/dates/' + this.selectedDate.content + '/times/' + encodeURIComponent(this.selectedTime.id), {
      headers: {
        'Authorization': 'Bearer ' + this.user.token
      }
    }).subscribe({
      next: (r: any) => {
        // console.log(r);

        for (let i = 0; i < r.length; i++) {
          const s = r[i];
          this.seats.push({
            id: s.id,
            user: s.user,
            modality: s.modality.name,
            status: s.status
          } as GameBoxEventSeat)
        }

        this.cdr.detectChanges();
      },
      error: (e) => {
        // console.log(e);
        this.isSeatLoading = false;
        // this.backToLogin();
      },
      complete: () => {
        this.isSeatLoading = false;
      }
    });
  }

  updateList(): void {
    this.onTabTimeOpen();

    // TODO: Update statics of this time
  }

  defineStatusAsPresented(seat: GameBoxEventSeat): void {
    this.confirmationService.confirm({
      message: 'Confirmar a presença de <strong>' + seat.user + '</strong> no dia <strong>' + this.selectedDate.header + ' às ' + this.selectedTime.name + 'h</strong>?',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.http.post(environment.apiUrl + '/gamebox/events/' + this.selectedEvent.code + '/seats/' + seat.id + '/status/presented', {
          notes: null
        }, {
          headers: {
            'Authorization': 'Bearer ' + this.user.token
          }
        }).subscribe({
          next: (r: any) => {
            // console.log(r);
            this.onTabTimeOpen();
            // this.cdr.detectChanges();
          },
          error: (e) => {
            // console.log(e);
            // this.backToLogin();
          },
          complete: () => {
          }
        });
      }
    });
  }

  defineStatusAsMissed(seat: GameBoxEventSeat): void {
    this.confirmationService.confirm({
      message: 'Ausência ou cancelamento de <strong>' + seat.user + '</strong> no dia <strong>' + this.selectedDate.header + ' às ' + this.selectedTime.name + 'h</strong>?',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.http.post(environment.apiUrl + '/gamebox/events/' + this.selectedEvent.code + '/seats/' + seat.id + '/status/missed', {
          notes: null
        }, {
          headers: {
            'Authorization': 'Bearer ' + this.user.token
          }
        }).subscribe({
          next: (r: any) => {
            // console.log(r);
            this.onTabTimeOpen();
            // this.cdr.detectChanges();
          },
          error: (e) => {
            // console.log(e);
            // this.backToLogin();
          },
          complete: () => {
          }
        });
      }
    });
  }

  private backToLogin(): void {
    try {
      localStorage.removeItem('user');
    } catch (e) {
      // Do nothing.
    }

    this.messageService.add({
      severity: 'error',
      summary: 'Falha',
      detail: 'Realize o login novamente.'
    });

    this.router.navigate(['/', 'login']);
  }

}
