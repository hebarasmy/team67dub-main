import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { LiveLocationService } from '../service/live-location.service';

import { LiveLocationComponent } from './live-location.component';

describe('LiveLocation Management Component', () => {
  let comp: LiveLocationComponent;
  let fixture: ComponentFixture<LiveLocationComponent>;
  let service: LiveLocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'live-location', component: LiveLocationComponent }]), HttpClientTestingModule],
      declarations: [LiveLocationComponent],
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
      .overrideTemplate(LiveLocationComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LiveLocationComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(LiveLocationService);

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
    expect(comp.liveLocations?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to liveLocationService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getLiveLocationIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getLiveLocationIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
