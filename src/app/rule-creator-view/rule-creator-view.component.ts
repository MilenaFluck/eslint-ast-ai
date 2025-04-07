import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { Store } from '@ngxs/store';
import { basicSetup } from 'codemirror';
import { CodemirrorEditorComponent } from '../codemirror-editor/codemirror-editor.component';
import { Category, Framework, RuleType } from '../model';
import { SplitViewComponent } from '../split-view';
import { RuleCreatorActions } from '../state/rule-creator.actions';
import { javascript } from '@codemirror/lang-javascript';

@Component({
  selector: 'app-rule-creator-view',
  templateUrl: './rule-creator-view.component.html',
  styleUrl: './rule-creator-view.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    NgxsFormPluginModule,
    FormsModule,
    SplitViewComponent,
    MatToolbarModule,
    CodemirrorEditorComponent,
  ]
})
export class RuleCreatorViewComponent implements OnInit {

  creatorForm!: FormGroup;
  ruleForm!: FormGroup;
  readonly ruleEditorConfig = [basicSetup, javascript()];
  readonly store = inject(Store);
  readonly frameworks = Framework;
  readonly categories = Category;
  readonly ruleTypes = RuleType;

  ngOnInit(): void {
    this.creatorForm = new FormGroup({
      framework: new FormControl(Framework.NONE),
      description: new FormControl(null, Validators.required),
      category: new FormControl(Category.NONE),
      type: new FormControl(RuleType.PROBLEM),
      failureExample: new FormControl(null),
      fixable: new FormControl(false),
    });

    this.ruleForm = new FormGroup({
      rule: new FormControl(null),
      ruleTest: new FormControl(null),
    });
  }

  create(): void {
    this.store.dispatch(new RuleCreatorActions.Create);
  }

  export(): void {
    this.store.dispatch(new RuleCreatorActions.Export);
  }

  testRule(): void {
    this.store.dispatch(new RuleCreatorActions.Test);
  }

  copyTest(): void {
  }

  copyRule(): void {
  }
}
