import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { DangerZoneService } from '../service/danger-zone.service';

import { DangerZoneComponent } from './danger-zone.component';

describe('DangerZone Management Component', () => {
  let comp: DangerZoneComponent;
  let fixture: ComponentFixture<DangerZoneComponent>;
  let service: DangerZoneService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'danger-zone', component: DangerZoneComponent }]), HttpClientTestingModule],
      declarations: [DangerZoneComponent],
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
      .overrideTemplate(DangerZoneComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DangerZoneComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(DangerZoneService);

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
    expect(comp.dangerZones?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to dangerZoneService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getDangerZoneIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getDangerZoneIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
