import { TestBed, inject } from '@angular/core/testing';

import { WritingStreakService } from './writing-streak.service';

describe('WritingStreakService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WritingStreakService]
    });
  });

  it('should be created', inject([WritingStreakService], (service: WritingStreakService) => {
    expect(service).toBeTruthy();
  }));
});
