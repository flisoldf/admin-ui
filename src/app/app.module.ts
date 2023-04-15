import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClient, HttpClientModule} from '@angular/common/http';

import {registerLocaleData} from '@angular/common';
import localePt from '@angular/common/locales/pt';
import {TranslateLoader, TranslateModule, TranslateService, TranslateStore} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './pages/login/login.component';
import {CheckboxModule} from 'primeng/checkbox';
import {NgxCaptchaModule} from 'ngx-captcha';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ChipModule} from 'primeng/chip';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {RippleModule} from 'primeng/ripple';
import {TableModule} from 'primeng/table';
import {ImageModule} from 'primeng/image';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService, MessageService} from 'primeng/api';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {ToastModule} from 'primeng/toast';
import {BlockUIModule} from 'primeng/blockui';
import {ProgressBarModule} from 'primeng/progressbar';
import {MainComponent} from './pages/main/main.component';
import {StyleClassModule} from 'primeng/styleclass';
import {CaptchaModule} from 'primeng/captcha';
import {StructureComponent} from './components/structure/structure.component';
import {DropdownModule} from 'primeng/dropdown';
import {TabViewModule} from 'primeng/tabview';
import {AccordionModule} from 'primeng/accordion';
import {TooltipModule} from 'primeng/tooltip';
import {SkeletonModule} from 'primeng/skeleton';
import {EditionListComponent} from './pages/records/editions/edition-list/edition-list.component';
import {ParticipantListComponent} from './pages/records/participants/participant-list/participant-list.component';
import {SpeakerListComponent} from './pages/records/speakers/speaker-list/speaker-list.component';
import {CollaboratorListComponent} from './pages/records/collaborators/collaborator-list/collaborator-list.component';
import {UserListComponent} from './pages/records/users/user-list/user-list.component';
import {TalkListComponent} from './pages/talks/talk-list/talk-list.component';
import {ConfirmationListComponent} from './pages/confirmation-list/confirmation-list.component';
import {AvatarModule} from 'primeng/avatar';
import {AvatarGroupModule} from 'primeng/avatargroup';
import {SelectButtonModule} from 'primeng/selectbutton';
import {SearchFilterPipe} from './pipes/search-filter/search-filter.pipe';
import {CardModule} from "primeng/card";
import {ConfirmationStatusPipe} from './pipes/confirmation-status/confirmation-status.pipe';

registerLocaleData(localePt);

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    StructureComponent,
    EditionListComponent,
    ParticipantListComponent,
    SpeakerListComponent,
    CollaboratorListComponent,
    UserListComponent,
    TalkListComponent,
    ConfirmationListComponent,
    SearchFilterPipe,
    ConfirmationStatusPipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NgxCaptchaModule,
    ReactiveFormsModule,
    CheckboxModule,
    InputTextModule,
    ChipModule,
    ButtonModule,
    RippleModule,
    TableModule,
    ImageModule,
    ConfirmDialogModule,
    MessagesModule,
    MessageModule,
    ToastModule,
    BlockUIModule,
    ProgressBarModule,
    TranslateModule.forChild(
      {
        loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
        }

      }),
    StyleClassModule,
    CaptchaModule,
    DropdownModule,
    FormsModule,
    TabViewModule,
    AccordionModule,
    TooltipModule,
    SkeletonModule,
    AvatarModule,
    AvatarGroupModule,
    SelectButtonModule,
    CardModule,
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'pt-BR'},
    //{provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
    TranslateService,
    TranslateStore,
    MessageService,
    ConfirmationService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
