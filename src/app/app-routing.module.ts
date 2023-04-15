import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import {MainComponent} from './pages/main/main.component';
import {EditionListComponent} from './pages/records/editions/edition-list/edition-list.component';
import {ParticipantListComponent} from './pages/records/participants/participant-list/participant-list.component';
import {SpeakerListComponent} from './pages/records/speakers/speaker-list/speaker-list.component';
import {CollaboratorListComponent} from './pages/records/collaborators/collaborator-list/collaborator-list.component';
import {UserListComponent} from './pages/records/users/user-list/user-list.component';
import {TalkListComponent} from './pages/talks/talk-list/talk-list.component';
import {ConfirmationListComponent} from './pages/confirmation-list/confirmation-list.component';

// const routes: Routes = [];
const routes: Routes = [
  // {path: 'main', component: MainComponent},
  // {path: 'water-system', component: WaterSystemComponent},
  // {path: 'water-system/:acronym', component: WaterSystemComponent},
  // {path: 'meeting', component: MeetingComponent},
  // {path: 'meeting/:id', component: MeetingDetailComponent},
  // {path: '', redirectTo: '/main', pathMatch: 'full'},
  // {path: '**', redirectTo: '/main'}
  {path: 'login', component: LoginComponent},
  {path: 'main', component: MainComponent},
  {path: 'records/editions', component: EditionListComponent},
  {path: 'records/participants', component: ParticipantListComponent},
  {path: 'records/speakers', component: SpeakerListComponent},
  {path: 'records/collaborators', component: CollaboratorListComponent},
  {path: 'records/users', component: UserListComponent},
  {path: 'talks', component: TalkListComponent},
  {path: 'confirmation-list', component: ConfirmationListComponent},
  // {path: 'product', component: ProductComponent},
  // {path: 'product/to-download', component: ProductToDownloadComponent},
  // {path: 'product/to-order', component: ProductToOrderComponent},
  // {path: 'product/:id', component: ProductDetailComponent},
  // {path: 'order', component: OrderComponent},
  // {path: 'order/to-purge', component: OrderToPurgeComponent},
  // {path: 'order/:id', component: OrderDetailComponent},
  // {path: 'order/cart', component: OrderCartComponent},
  // {path: 'help-center', component: HelpCenterComponent},
  // {path: 'help-center/educational', component: HelpCenterEducationalComponent},
  // {path: 'help-center/faq', component: HelpCenterFaqComponent},
  // {path: 'help-center/contact', component: HelpCenterContactComponent},
  // {path: 'profile', component: ProfileComponent},
  {path: '', redirectTo: '/talks', pathMatch: 'full'},
  {path: '**', redirectTo: '/talks'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
