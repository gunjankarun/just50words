import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WritingPromptService } from '../../service/writing-prompt.service';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-writing-prompt',
  templateUrl: './writing-prompt.component.html',
  styleUrls: ['./writing-prompt.component.css']
})
export class WritingPromptComponent implements OnInit {
  prompts: any;
  keyword: string;
  list_title = '';

  constructor(
    public activeModal: NgbActiveModal,
    private _writingPromptService: WritingPromptService,
    private _electronService: ElectronService
  ) {}

  ngOnInit() {}

  get_prompts() {
    // console.log('Getting prompts');
    if (!this.keyword) {
      this.keyword = 'Keyword';
    }
    const scope = this;
    scope.prompts = [];
    this._writingPromptService.generate_prompts(this.keyword, 5, function(
      err,
      prompts
    ) {
      // console.log('100', prompts);
      scope.prompts = prompts;
      scope.list_title = 'Some writing prompts for "' + scope.keyword + '"';
      // console.log('Prompts are ', scope.prompts);
    });
  }

  select_prompt(event, prompt) {
    event.preventDefault();
    this._writingPromptService.selectPrompt(prompt);
    this.activeModal.dismiss('Prompt Selected');
  }

  search_google(event, prompt) {
    const url = 'https://www.google.co.in/search?q=' + prompt;
    event.preventDefault();
    if (this._electronService.isElectronApp) {
      this._electronService.shell.openExternal(url);
    } else {
      window.open(url, '_blank');
    }
  }
}
