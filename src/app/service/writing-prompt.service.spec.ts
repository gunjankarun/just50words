import { TestBed, inject } from '@angular/core/testing';

import { WritingPromptService } from './writing-prompt.service';

describe('WritingPromptService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WritingPromptService]
    });
  });

  it('should be created', inject([WritingPromptService], (service: WritingPromptService) => {
    expect(service).toBeTruthy();
  }));
});
