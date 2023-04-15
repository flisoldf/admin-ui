import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

interface ParticipantItem {
  id: number,
  name: string,
  email: string,
  phone: string,
  confirmed: boolean,
}

interface ParticipantItem {
  id: number,
  name: string,
  email: string,
  phone: string,
  confirmed: boolean,
}

interface TalkItem {
  id: number,
  name: string,
  speakers: string,
  confirmed: boolean,
}


@Component({
  selector: 'app-confirmation-list',
  templateUrl: './confirmation-list.component.html',
  styleUrls: ['./confirmation-list.component.scss']
})
export class ConfirmationListComponent implements OnInit {

  blockedDocument: boolean = false;
  kinds: any[] = [
    {name: 'Participantes', code: 'participants'},
    {name: 'Colaboradores', code: 'collaborators'},
    {name: 'Palestras', code: 'talks'},
  ];
  kind: any = {name: 'Participantes', code: 'participants'};
  filter: string = '';
  columns: any[] = [];
  items: any[] = [];

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.filter = '';
    this.columns = [];
    this.items = [];

    switch (this.kind.code) {
      case 'participants':
        this.columns.push({label: '#', field: 'id'});
        this.columns.push({label: 'Nome', field: 'name'});
        this.columns.push({label: 'E-mail', field: 'email'});
        this.columns.push({label: 'Telefone', field: 'phone'});
        this.columns.push({label: 'Situação', field: 'confirmed'});
        break;

      case 'collaborators':
        this.columns.push({label: '#', field: 'id'});
        this.columns.push({label: 'Nome', field: 'name'});
        this.columns.push({label: 'E-mail', field: 'email'});
        this.columns.push({label: 'Telefone', field: 'phone'});
        this.columns.push({label: 'Situação', field: 'confirmed'});
        break;

      case 'talks':
        this.columns.push({label: '#', field: 'id'});
        this.columns.push({label: 'Título', field: 'title'});
        this.columns.push({label: 'Palestrantes', field: 'speakers'});
        this.columns.push({label: 'Situação', field: 'confirmed'});
        break;
    }

    this.http.get(`${environment.apiUrl}/${this.kind.code}`)
      .subscribe(data => {
        console.log(data);

        switch (this.kind.code) {
          case 'participants':
            // @ts-ignore
            data.forEach(d =>
              this.items.push({
                id: d.id,
                name: d.name,
                email: d.email,
                phone: d.phone,
                confirmed: d.presented_at != null,
              }));
            break;

          case 'collaborators':
            // @ts-ignore
            data.forEach(d =>
              this.items.push({
                id: d.id,
                name: d.name,
                email: d.email,
                phone: d.phone,
                confirmed: d.presented_at != null,
              }));
            break;

          case 'talks':
            // @ts-ignore
            data.forEach((d: any) => {
              let speakers = '';
              d.speakers?.forEach((speaker: any) => {
                if (speakers.length > 0) //
                  speakers += ', ';

                speakers += speaker.name;
              });

              this.items.push({
                id: d.id,
                title: d.title,
                speakers: speakers,
                confirmed: d.confirmedAt != null,
              });
            });
            break;
        }
      });
  }

  confirm(item: any): void {
    this.blockedDocument = true;

    this.http.get(`${environment.apiUrl}/${this.kind.code}/${item.id}/presented`)
      .subscribe({
        next: (data) => {
          this.blockedDocument = false;
          console.log(data);
          // // @ts-ignore
          // data.forEach(d => {
          //   this.participants.push({
          //     id: d.id,
          //     name: d.name,
          //     email: d.email,
          //     phone: d.phone,
          //     confirmed: d.presented_at != null,
          //   });
          // });
          item.confirmed = true;
        }, error: () => {
          this.blockedDocument = false;
        }
      });
  }

  onKindChange(event: any): void {
    this.reload();
  }
}
