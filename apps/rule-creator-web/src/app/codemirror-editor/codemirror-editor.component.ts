import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DoCheck,
  ElementRef,
  forwardRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  Compartment,
  EditorState,
  Extension,
  StateEffect,
} from '@codemirror/state';
import { EditorView, ViewUpdate } from '@codemirror/view';

function normalizeLineEndings(str: string): string {
  if (!str) {
    return str;
  }
  return str.replace(/\r\n|\r/g, '\n');
}

@Component({
  selector: 'app-codemirror-editor',
  templateUrl: './codemirror-editor.component.html',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CodemirrorEditorComponent),
      multi: true,
    },
  ],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodemirrorEditorComponent
  implements AfterViewInit, OnDestroy, ControlValueAccessor, DoCheck
{
  @Input()
  initialValue = '';

  @Input()
  extensions: Extension[] = [];

  @Input()
  preserveScrollPosition = false;

  @ViewChild('editorRef')
  editorRef!: ElementRef;

  private value!: string;
  private editor!: EditorView;

  private onChange: any;
  private onTouched: any;

  private disabledCompartment = new Compartment();

  private innerExtensions = [
    EditorView.updateListener.of((viewUpdate: ViewUpdate) =>
      this.handleValueChanged(viewUpdate)
    ),
    EditorView.focusChangeEffect.of(() => this.handleFocusChanged()),
    this.disabledCompartment.of(EditorState.readOnly.of(false)),
  ];

  ngAfterViewInit(): void {
    if (!this.editorRef) {
      console.error('Missing editor reference');
      return;
    }

    const editorNativeElement = this.editorRef.nativeElement;
    if (!editorNativeElement) {
      console.error('Missing native element on editor reference');
      return;
    }

    if (!this.value) {
      this.value = this.initialValue;
    }

    try {
      const state = EditorState.create({
        doc: this.value,
        extensions: [...this.extensions, ...this.innerExtensions],
      });

      this.editor = new EditorView({
        state,
        parent: editorNativeElement,
      });
    } catch (e) {
      console.error(e);
    }
  }

  private handleValueChanged(viewUpdate: ViewUpdate): void {
    const changedValue = viewUpdate.state.doc.toString();
    if (this.value !== changedValue) {
      this.value = changedValue;
      this.onChange(this.value);
    }
  }

  private handleFocusChanged(): StateEffect<any> | null {
    this.onTouched();
    return null;
  }

  // eslint-disable-next-line custom/correct-order-of-lifecycle-hooks
  ngDoCheck(): void {
    if (!this.editor) {
      return;
    }
  }

  ngOnDestroy(): void {
    if (!this.editor) {
      return;
    }
    this.editor.destroy();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(value: string): void {
    if (!value) {
      return;
    }

    if (!this.editor) {
      this.value = value;
      return;
    }

    const currentValueLength = this.editor.state.doc.length;
    const currentValue = this.editor.state.doc.toString();
    const scrollSnapshot = this.editor.scrollSnapshot();

    if (
      value !== currentValue &&
      normalizeLineEndings(currentValue) !== normalizeLineEndings(value)
    ) {
      this.value = value;
      this.editor.dispatch({
        changes: { from: 0, to: currentValueLength, insert: value },
      });

      if (this.preserveScrollPosition) {
        this.editor.dispatch({ effects: scrollSnapshot });
      }
    }
  }

  setDisabledState(isDisabled: boolean) {
    if (!this.editor) {
      return;
    }
    this.editor.dispatch({
      effects: this.disabledCompartment.reconfigure(
        EditorState.readOnly.of(isDisabled)
      ),
    });
  }
}
