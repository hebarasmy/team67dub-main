import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SOSButtonService } from '../service/sos-button.service';

import { SOSButtonComponent } from './sos-button.component';

describe('SOSButton Management Component', () => {
  let comp: SOSButtonComponent;
  let fixture: ComponentFixture<SOSButtonComponent>;
  let service: SOSButtonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'sos-button', component: SOSButtonComponent }]), HttpClientTestingModule],
      declarations: [SOSButtonComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(SOSButtonComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SOSButtonComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SOSButtonService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.sOSButtons?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to sOSButtonService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getSOSButtonIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getSOSButtonIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
