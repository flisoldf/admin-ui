import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TalkListComponent} from './talk-list.component';

describe('TalkListComponent', () => {
  let component: TalkListComponent;
  let fixture: ComponentFixture<TalkListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TalkListComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TalkListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
