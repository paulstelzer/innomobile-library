import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TinyMceEditorComponent } from './editor/editor.component';
import { TINYMCE_SCRIPT_URL } from './classes/tinymce-script-url';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [TinyMceEditorComponent],
  exports: [TinyMceEditorComponent]
})
export class TinyMceEditorModule {
  public static forRoot(tinymceScriptUrl?: string): ModuleWithProviders {
    return {
      ngModule: TinyMceEditorModule,
      providers: [
        { provide: TINYMCE_SCRIPT_URL, useValue: tinymceScriptUrl },
      ]
    };
  }
}
