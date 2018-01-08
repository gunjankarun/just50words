import { TestBed, inject } from '@angular/core/testing';

import { WordCountService } from './word-count.service';

describe('WordCountService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WordCountService]
    });
  });

  it('should be created', inject([WordCountService], (service: WordCountService) => {
    expect(service).toBeTruthy();
  }));
});
