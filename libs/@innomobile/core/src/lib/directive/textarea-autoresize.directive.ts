import { Directive, HostListener, OnInit, ElementRef } from '@angular/core';

@Directive({
  selector: '[imAutoresize]' // Attribute selector
})
export class TextareaAutoresizeDirective implements OnInit {

  @HostListener('input', ['$event.target'])
  onInput = (textArea: HTMLTextAreaElement): void => {
    this.adjust();
  }

  constructor(public element: ElementRef) { }

  ngOnInit(): void {
    const waitThenAdjust = (trial: number): void => {
      if (trial > 10) {
        // Give up.
        return;
      }

      const ta = this.element.nativeElement.querySelector('textarea');
      if (ta !== undefined && ta !== null) {
        this.adjust();
      } else {
        setTimeout(() => {
          waitThenAdjust(trial + 1);
        }, 0);
      }
    };

    // Wait for the textarea to properly exist in the DOM, then adjust it.
    waitThenAdjust(1);
  }

  adjust = (): void => {
    const ta = this.element.nativeElement.querySelector('textarea');
    if (ta !== undefined && ta !== null) {
      ta.style.overflow = 'hidden';
      ta.style.height = 'auto';
      ta.style.height = ta.scrollHeight + 'px';
    }
  }

}
