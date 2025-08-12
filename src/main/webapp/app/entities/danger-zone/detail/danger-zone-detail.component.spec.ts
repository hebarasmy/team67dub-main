import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DangerZoneDetailComponent } from './danger-zone-detail.component';

describe('DangerZone Management Detail Component', () => {
  let comp: DangerZoneDetailComponent;
  let fixture: ComponentFixture<DangerZoneDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DangerZoneDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ dangerZone: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DangerZoneDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DangerZoneDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load dangerZone on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.dangerZone).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
