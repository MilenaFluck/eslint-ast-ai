import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, model, OnInit, } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent, MatDialogModule,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { javascript } from '@codemirror/lang-javascript';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { select, Store } from '@ngxs/store';
import { basicSetup } from 'codemirror';
import { CodemirrorEditorComponent } from '../codemirror-editor/codemirror-editor.component';
import { Category, Framework, RuleType } from '../model';
import { SplitViewComponent } from '../split-view';
import { RuleCreatorState } from '../state';
import { RuleCreatorActions } from '../state/rule-creator.actions';

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
  ],
})
export class RuleCreatorViewComponent implements OnInit {
  creatorForm!: FormGroup;
  ruleForm!: FormGroup;

  readonly ruleEditorConfig = [basicSetup, javascript()];
  readonly store = inject(Store);
  readonly frameworks = Framework;
  readonly categories = Category;
  readonly ruleTypes = RuleType;

  readonly ressources = select(RuleCreatorState.ressources);
  readonly testResultStatus = select(RuleCreatorState.testResultStatus);
  readonly testResultDateTime = select(RuleCreatorState.testResultDateTime);
  readonly testPassed = select(RuleCreatorState.testPassed);

  readonly dialog = inject(MatDialog);

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
    this.store.dispatch(new RuleCreatorActions.Create());
  }

  export(): void {
    this.store.dispatch(new RuleCreatorActions.Export());
  }

  testRule(): void {
    this.store.dispatch(new RuleCreatorActions.Test());
  }

  copyTest(): void {
    navigator.clipboard.writeText(this.ruleForm.get('rule')?.value);
  }

  copyRule(): void {
    navigator.clipboard.writeText(this.ruleForm.get('ruleTest')?.value);
  }

  removeApiKey(): void {
    this.store.dispatch(new RuleCreatorActions.RemoveKey());
  }

  openApiKeyDialog(): void {
    const dialogRef = this.dialog.open(RuleCreatorViewApiKeyDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.store.dispatch(new RuleCreatorActions.AddKey(result));
      }
    });
  }

}

@Component({
  selector: 'rule-creator-view-api-key-dialog',
  templateUrl: 'rule-creator-view-api-key-dialog.html',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule
  ],
})
export class RuleCreatorViewApiKeyDialog {
  readonly dialogRef = inject(MatDialogRef<RuleCreatorViewApiKeyDialog>);
  readonly key = model('');
  onNoClick(): void {
    this.dialogRef.close();
  }
}
