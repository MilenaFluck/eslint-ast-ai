import { Component } from '@angular/core';
import { RuleCreatorViewComponent } from './rule-creator-view';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    RuleCreatorViewComponent
  ],
})
export class AppComponent {}
