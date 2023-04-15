import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ConfirmationListComponent} from './confirmation-list.component';

describe('ConfirmationListComponent', () => {
  let component: ConfirmationListComponent;
  let fixture: ComponentFixture<ConfirmationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmationListComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
