import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

interface Speaker {
  id: number,
  name: string
}

interface Talk {
  id: number,
  title: string,
  subject: string,
  description: string,
  kind: any,
  shift: any,
  speakers: Speaker[],
  internalNote: string,
}

@Component({
  selector: 'app-talk-list',
  templateUrl: './talk-list.component.html',
  styleUrls: ['./talk-list.component.scss']
})
export class TalkListComponent implements OnInit {

  talks: Talk[] = [];

  constructor(
    private http: HttpClient,
  ) {
    this.http.get(environment.apiUrl + '/talks/?year=2022', {
      // headers: {
      //   'Authorization': 'Bearer ' + this.user.token
      // }
    }).subscribe({
      next: (r: any) => {
        // console.log(r);
        for (let i = 0; i < r.length; i++) {
          const t = r[i];
          this.talks.push({
            id: t.id,
            title: t.title,
            subject: t.subject,
            description: t.description,
            kind: t.kind,
            shift: t.shift,
            speakers: t.speakers,
            internalNote: t.internalNote,
          } as Talk);
        }
      },
      error: (e) => {
        // console.log(e);
        // this.backToLogin();
      },
      complete: () => {
      }
    });
  }

  ngOnInit(): void {
  }

  downloadPhoto(speaker: any) {
    console.log(speaker);
    window.open(speaker.photoUrl);
  }
}
