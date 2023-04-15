import {Component, DoCheck, OnInit, ViewChild} from '@angular/core';

import {PrimeNGConfig} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core'
import {Toast} from 'primeng/toast';
import {DomHandler} from 'primeng/dom';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, DoCheck {

  @ViewChild(Toast)
  toast?: Toast;

  title = 'admin-ui';

  constructor(private config: PrimeNGConfig, private translateService: TranslateService) {
  }

  ngOnInit() {
    this.config.ripple = true;
    //this.translateService.setDefaultLang('en');
    this.translateService.setDefaultLang('pt-BR');
  }

  // DONE: 2022-01-13 Francisco: Fix problem with toast behind elements
  ngDoCheck(): void {
    if (!(this.toast && this.toast.containerViewChild)) return;
    const requiredZIndex = `${DomHandler.zindex}`;
    const el = this.toast.containerViewChild.nativeElement as HTMLElement;
    if (el.style.zIndex !== requiredZIndex) el.style.zIndex = requiredZIndex;
  }

  // translate(lang: string) {
  //   this.translateService.use(lang);
  //   this.translateService.get('primeng').subscribe(res => this.config.setTranslation(res));
  // }

}
