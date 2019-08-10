import { Component, AfterViewInit, Input, ElementRef, OnDestroy, forwardRef, NgZone, Inject, PLATFORM_ID, Optional } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import * as ScriptLoader from '../utils/ScriptLoader';
import { uuid, isTextarea, bindHandlers, mergePlugins } from '../utils/Utils';
import { getTinymce } from '../classes/TinyMCE';
import { Events } from '../classes/Events';
import { isPlatformBrowser } from '@angular/common';
import { TINYMCE_SCRIPT_URL } from '../classes/tinymce-script-url';

const scriptState = ScriptLoader.create();

const EDITOR_COMPONENT_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TinyMceEditorComponent),
  multi: true
};

@Component({
  selector: 'innomobile-tinymce-editor',
  template: '<ng-template></ng-template>',
  styles: [':host { display: block; }'],
  providers: [EDITOR_COMPONENT_VALUE_ACCESSOR]
})
export class TinyMceEditorComponent extends Events implements AfterViewInit, ControlValueAccessor, OnDestroy {
  private elementRef: ElementRef;
  private element: Element | undefined = undefined;
  private editor: any;

  ngZone: NgZone;

  @Input() cloudChannel: string | undefined;
  @Input() init: { [key: string]: any } | undefined;
  @Input() id = '';
  @Input() initialValue: string | undefined;
  @Input() inline: boolean | undefined;
  @Input() tagName: string | undefined;
  @Input() plugins: string | undefined;
  @Input() toolbar: string | string[] | null = null;

  private _disabled: boolean | undefined;
  @Input()
  set disabled(val) {
    this._disabled = val;
    if (this.editor && this.editor.initialized) {
      this.editor.setMode(val ? 'readonly' : 'design');
    }
  }
  get disabled() {
    return this._disabled;
  }

  private onTouchedCallback = () => { };
  private onChangeCallback = (x: any) => { };

  constructor(
    elementRef: ElementRef,
    ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject(TINYMCE_SCRIPT_URL) private scriptUrl: string,
  ) {
    super();
    this.elementRef = elementRef;
    this.ngZone = ngZone;
    this.initialise = this.initialise.bind(this);
  }

  writeValue(value: string | null): void {
    this.initialValue = value || this.initialValue;

    if (this.editor && this.editor.initialized && typeof value === 'string') {
      this.editor.setContent(value);
    }
  }

  registerOnChange(fn: (_: any) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean) {
    if (this.editor) {
      this.editor.setMode(isDisabled ? 'readonly' : 'design');
    } else if (isDisabled) {
      this.init = { ...this.init, readonly: true };
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.id = this.id || uuid('tiny-angular');
      this.inline =
        typeof this.inline !== 'undefined' ? (typeof this.inline === 'boolean' ? this.inline : true) : this.init && this.init.inline;
      this.createElement();
      if (getTinymce() !== null) {
        this.initialise();
      } else if (this.element && this.element.ownerDocument) {
        const doc = this.element.ownerDocument;
        const scriptUrl = this.scriptUrl || `http://cloud.tinymce.com/5-testing/tinymce.min.js`;

        ScriptLoader.load(scriptState, doc, scriptUrl, this.initialise);
      }
    }
  }

  ngOnDestroy() {
    if (getTinymce() !== null) {
      getTinymce().remove(this.editor);
    }
  }

  createElement() {
    const tagName = typeof this.tagName === 'string' ? this.tagName : 'div';
    this.element = document.createElement(this.inline ? tagName : 'textarea');
    if (this.element) {
      this.element.id = this.id;
      if (isTextarea(this.element)) {
        this.element.style.visibility = 'hidden';
      }
      this.elementRef.nativeElement.appendChild(this.element);
    }
  }

  initialise() {
    setTimeout(() => {
      const finalInit = {
        ...this.init,
        target: this.element,
        inline: this.inline,
        readonly: this.disabled,
        plugins: mergePlugins(this.init && this.init.plugins, this.plugins),
        toolbar: this.toolbar || (this.init && this.init.toolbar),
        setup: (editor: any) => {
          this.editor = editor;
          editor.on('init', (e: Event) => {
            this.initEditor(e, editor);
          });

          if (this.init && typeof this.init.setup === 'function') {
            this.init.setup(editor);
          }
        }
      };

      if (isTextarea(this.element)) {
        this.element.style.visibility = '';
      }

      this.ngZone.runOutsideAngular(() => {
        getTinymce().init(finalInit);
      });
    }, 500)

  }

  private initEditor(initEvent: Event, editor: any) {
    if (typeof this.initialValue === 'string') {
      this.ngZone.run(() => editor.setContent(this.initialValue));
    }
    editor.once('blur', () => this.ngZone.run(() => this.onTouchedCallback()));
    editor.on(
      'setcontent',
      ({ content, format }: any) => format === 'html' && content && this.ngZone.run(() => this.onChangeCallback(content))
    );
    editor.on('change keyup undo redo', () => this.ngZone.run(() => this.onChangeCallback(editor.getContent())));
    bindHandlers(this, editor, initEvent);
  }
}
