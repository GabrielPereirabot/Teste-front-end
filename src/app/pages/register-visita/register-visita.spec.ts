import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterVisita } from './register-visita';

describe('RegisterVisita', () => {
  let component: RegisterVisita;
  let fixture: ComponentFixture<RegisterVisita>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterVisita]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterVisita);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
