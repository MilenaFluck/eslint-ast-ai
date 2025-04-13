import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Renderer2,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-split-view',
  templateUrl: './split-view.component.html',
  styleUrls: ['./split-view.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SplitViewComponent implements AfterViewInit {
  @ViewChild('divider') divider!: ElementRef;
  @ViewChild('leftContent') leftContent!: ElementRef;
  @ViewChild('rightContent') rightContent!: ElementRef;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    const divider = this.divider.nativeElement;
    const leftContent = this.leftContent.nativeElement;
    const rightContent = this.rightContent.nativeElement;

    let isResizing = false;

    const startResize = (event: MouseEvent) => {
      if (event.button !== 0) return;
      isResizing = true;
      event.preventDefault();
      document.addEventListener('mousemove', resize);
      document.addEventListener('mouseup', stopResize);
      document.addEventListener('mouseleave', stopResize);
    };

    const resize = (event: MouseEvent) => {
      if (!isResizing) return;

      const offset = event.clientX;
      const totalWidth = leftContent.parentElement.offsetWidth;

      const leftWidth = (offset / totalWidth) * 100;
      const rightWidth = 100 - leftWidth;

      this.renderer.setStyle(leftContent, 'width', `${leftWidth}%`);
      this.renderer.setStyle(rightContent, 'width', `${rightWidth}%`);
    };

    const stopResize = (event: MouseEvent) => {
      if (event.button !== 0) return;
      isResizing = false;
      document.removeEventListener('mousemove', resize);
      document.removeEventListener('mouseup', stopResize);
      document.removeEventListener('mouseleave', stopResize);
    };

    this.renderer.listen(divider, 'mousedown', startResize);
  }
}
