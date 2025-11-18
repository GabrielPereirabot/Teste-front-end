import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciaVisita } from './gerencia-visita';

describe('GerenciaVisita', () => {
  let component: GerenciaVisita;
  let fixture: ComponentFixture<GerenciaVisita>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciaVisita]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GerenciaVisita);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
