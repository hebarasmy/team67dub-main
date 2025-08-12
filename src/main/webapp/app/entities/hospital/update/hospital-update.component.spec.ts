import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { HospitalFormService } from './hospital-form.service';
import { HospitalService } from '../service/hospital.service';
import { IHospital } from '../hospital.model';
import { ILiveLocation } from 'app/entities/live-location/live-location.model';
import { LiveLocationService } from 'app/entities/live-location/service/live-location.service';

import { HospitalUpdateComponent } from './hospital-update.component';

describe('Hospital Management Update Component', () => {
  let comp: HospitalUpdateComponent;
  let fixture: ComponentFixture<HospitalUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let hospitalFormService: HospitalFormService;
  let hospitalService: HospitalService;
  let liveLocationService: LiveLocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [HospitalUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(HospitalUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(HospitalUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    hospitalFormService = TestBed.inject(HospitalFormService);
    hospitalService = TestBed.inject(HospitalService);
    liveLocationService = TestBed.inject(LiveLocationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call LiveLocation query and add missing value', () => {
      const hospital: IHospital = { id: 456 };
      const liveLocation: ILiveLocation = { id: 22045 };
      hospital.liveLocation = liveLocation;

      const liveLocationCollection: ILiveLocation[] = [{ id: 28568 }];
      jest.spyOn(liveLocationService, 'query').mockReturnValue(of(new HttpResponse({ body: liveLocationCollection })));
      const additionalLiveLocations = [liveLocation];
      const expectedCollection: ILiveLocation[] = [...additionalLiveLocations, ...liveLocationCollection];
      jest.spyOn(liveLocationService, 'addLiveLocationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ hospital });
      comp.ngOnInit();

      expect(liveLocationService.query).toHaveBeenCalled();
      expect(liveLocationService.addLiveLocationToCollectionIfMissing).toHaveBeenCalledWith(
        liveLocationCollection,
        ...additionalLiveLocations.map(expect.objectContaining)
      );
      expect(comp.liveLocationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const hospital: IHospital = { id: 456 };
      const liveLocation: ILiveLocation = { id: 74653 };
      hospital.liveLocation = liveLocation;

      activatedRoute.data = of({ hospital });
      comp.ngOnInit();

      expect(comp.liveLocationsSharedCollection).toContain(liveLocation);
      expect(comp.hospital).toEqual(hospital);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHospital>>();
      const hospital = { id: 123 };
      jest.spyOn(hospitalFormService, 'getHospital').mockReturnValue(hospital);
      jest.spyOn(hospitalService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ hospital });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: hospital }));
      saveSubject.complete();

      // THEN
      expect(hospitalFormService.getHospital).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(hospitalService.update).toHaveBeenCalledWith(expect.objectContaining(hospital));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHospital>>();
      const hospital = { id: 123 };
      jest.spyOn(hospitalFormService, 'getHospital').mockReturnValue({ id: null });
      jest.spyOn(hospitalService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ hospital: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: hospital }));
      saveSubject.complete();

      // THEN
      expect(hospitalFormService.getHospital).toHaveBeenCalled();
      expect(hospitalService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHospital>>();
      const hospital = { id: 123 };
      jest.spyOn(hospitalService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ hospital });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(hospitalService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareLiveLocation', () => {
      it('Should forward to liveLocationService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(liveLocationService, 'compareLiveLocation');
        comp.compareLiveLocation(entity, entity2);
        expect(liveLocationService.compareLiveLocation).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
