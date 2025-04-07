import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { RuleCreatorViewComponent } from './rule-creator-view.component';

describe('RuleCreatorViewComponent', () => {
  let spectator: Spectator<RuleCreatorViewComponent>;

  const createComponent = createComponentFactory({
    component: RuleCreatorViewComponent,
    imports: [CommonModule, NgxsModule.forRoot([]), HttpClientTestingModule],
    detectChanges: true,
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should be created', () => {
    expect(spectator.component).toBeTruthy();
  });
});
