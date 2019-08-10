import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TinyMceEditorComponent } from './editor.component';

describe('TinyMceEditorComponent', () => {
  let component: TinyMceEditorComponent;
  let fixture: ComponentFixture<TinyMceEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TinyMceEditorComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TinyMceEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
