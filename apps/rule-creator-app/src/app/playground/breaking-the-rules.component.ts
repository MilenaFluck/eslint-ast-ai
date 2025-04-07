import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-breaking-the-rules',
  template: '',
  standalone: true,
})
export class BreakingTheRulesComponent implements OnInit, OnDestroy {
  test = '';

  ngOnDestroy() {
    this.test = 'Happens last';
  }

  ngOnInit() {
    this.test = 'Happens first.';
  }
}
