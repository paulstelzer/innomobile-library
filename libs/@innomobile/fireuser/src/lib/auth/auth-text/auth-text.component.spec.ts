import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthTextComponent } from './auth-text.component';

describe('AuthTextComponent', () => {
  let component: AuthTextComponent;
  let fixture: ComponentFixture<AuthTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
