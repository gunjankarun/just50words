import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WritingStreakComponent } from './writing-streak.component';

describe('WritingStreakComponent', () => {
  let component: WritingStreakComponent;
  let fixture: ComponentFixture<WritingStreakComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WritingStreakComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WritingStreakComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
