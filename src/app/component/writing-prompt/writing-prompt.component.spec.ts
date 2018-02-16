import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WritingPromptComponent } from './writing-prompt.component';

describe('WritingPromptComponent', () => {
  let component: WritingPromptComponent;
  let fixture: ComponentFixture<WritingPromptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WritingPromptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WritingPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
