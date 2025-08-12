import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { HospitalService } from '../service/hospital.service';

import { HospitalComponent } from './hospital.component';

describe('Hospital Management Component', () => {
  let comp: HospitalComponent;
  let fixture: ComponentFixture<HospitalComponent>;
  let service: HospitalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'hospital', component: HospitalComponent }]), HttpClientTestingModule],
      declarations: [HospitalComponent],
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
      .overrideTemplate(HospitalComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(HospitalComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(HospitalService);

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
    expect(comp.hospitals?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to hospitalService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getHospitalIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getHospitalIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
