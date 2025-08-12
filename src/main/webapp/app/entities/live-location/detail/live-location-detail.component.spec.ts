import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LiveLocationDetailComponent } from './live-location-detail.component';

describe('LiveLocation Management Detail Component', () => {
  let comp: LiveLocationDetailComponent;
  let fixture: ComponentFixture<LiveLocationDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LiveLocationDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ liveLocation: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(LiveLocationDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(LiveLocationDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load liveLocation on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.liveLocation).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
