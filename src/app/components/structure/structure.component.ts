import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

interface Edition {
  id: number,
  name: string,
}

@Component({
  selector: 'app-structure',
  templateUrl: './structure.component.html',
  styleUrls: ['./structure.component.scss']
})
export class StructureComponent implements OnInit {

  editions: Edition[] = [];
  selectedEdition: Edition = {} as Edition;

  constructor(
    private http: HttpClient,
  ) {
    this.http.get(environment.apiUrl + '/editions', {
      // headers: {
      //   'Authorization': 'Bearer ' + this.user.token
      // }
    }).subscribe({
      next: (r: any) => {
        // console.log(r);
        for (let i = 0; i < r.length; i++) {
          const evt = r[i];
          this.editions.push({
            id: evt.id,
            name: evt.name
          } as Edition);
        }

        this.selectedEdition = this.editions[0];
        // this.onChangeEvent();
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

}
