import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WritingTimerComponent } from './writing-timer.component';

describe('WritingTimerComponent', () => {
  let component: WritingTimerComponent;
  let fixture: ComponentFixture<WritingTimerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WritingTimerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WritingTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
