import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SOSButtonDetailComponent } from './sos-button-detail.component';

describe('SOSButton Management Detail Component', () => {
  let comp: SOSButtonDetailComponent;
  let fixture: ComponentFixture<SOSButtonDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SOSButtonDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ sOSButton: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SOSButtonDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SOSButtonDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load sOSButton on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.sOSButton).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
