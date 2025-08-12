import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PoliceStationDetailComponent } from './police-station-detail.component';

describe('PoliceStation Management Detail Component', () => {
  let comp: PoliceStationDetailComponent;
  let fixture: ComponentFixture<PoliceStationDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PoliceStationDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ policeStation: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PoliceStationDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PoliceStationDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load policeStation on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.policeStation).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
