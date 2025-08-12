import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PoliceStationFormService } from './police-station-form.service';
import { PoliceStationService } from '../service/police-station.service';
import { IPoliceStation } from '../police-station.model';
import { ILiveLocation } from 'app/entities/live-location/live-location.model';
import { LiveLocationService } from 'app/entities/live-location/service/live-location.service';

import { PoliceStationUpdateComponent } from './police-station-update.component';

describe('PoliceStation Management Update Component', () => {
  let comp: PoliceStationUpdateComponent;
  let fixture: ComponentFixture<PoliceStationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let policeStationFormService: PoliceStationFormService;
  let policeStationService: PoliceStationService;
  let liveLocationService: LiveLocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PoliceStationUpdateComponent],
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
      .overrideTemplate(PoliceStationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PoliceStationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    policeStationFormService = TestBed.inject(PoliceStationFormService);
    policeStationService = TestBed.inject(PoliceStationService);
    liveLocationService = TestBed.inject(LiveLocationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call LiveLocation query and add missing value', () => {
      const policeStation: IPoliceStation = { id: 456 };
      const liveLocation: ILiveLocation = { id: 72390 };
      policeStation.liveLocation = liveLocation;

      const liveLocationCollection: ILiveLocation[] = [{ id: 85790 }];
      jest.spyOn(liveLocationService, 'query').mockReturnValue(of(new HttpResponse({ body: liveLocationCollection })));
      const additionalLiveLocations = [liveLocation];
      const expectedCollection: ILiveLocation[] = [...additionalLiveLocations, ...liveLocationCollection];
      jest.spyOn(liveLocationService, 'addLiveLocationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ policeStation });
      comp.ngOnInit();

      expect(liveLocationService.query).toHaveBeenCalled();
      expect(liveLocationService.addLiveLocationToCollectionIfMissing).toHaveBeenCalledWith(
        liveLocationCollection,
        ...additionalLiveLocations.map(expect.objectContaining)
      );
      expect(comp.liveLocationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const policeStation: IPoliceStation = { id: 456 };
      const liveLocation: ILiveLocation = { id: 56975 };
      policeStation.liveLocation = liveLocation;

      activatedRoute.data = of({ policeStation });
      comp.ngOnInit();

      expect(comp.liveLocationsSharedCollection).toContain(liveLocation);
      expect(comp.policeStation).toEqual(policeStation);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPoliceStation>>();
      const policeStation = { id: 123 };
      jest.spyOn(policeStationFormService, 'getPoliceStation').mockReturnValue(policeStation);
      jest.spyOn(policeStationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ policeStation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: policeStation }));
      saveSubject.complete();

      // THEN
      expect(policeStationFormService.getPoliceStation).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(policeStationService.update).toHaveBeenCalledWith(expect.objectContaining(policeStation));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPoliceStation>>();
      const policeStation = { id: 123 };
      jest.spyOn(policeStationFormService, 'getPoliceStation').mockReturnValue({ id: null });
      jest.spyOn(policeStationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ policeStation: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: policeStation }));
      saveSubject.complete();

      // THEN
      expect(policeStationFormService.getPoliceStation).toHaveBeenCalled();
      expect(policeStationService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPoliceStation>>();
      const policeStation = { id: 123 };
      jest.spyOn(policeStationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ policeStation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(policeStationService.update).toHaveBeenCalled();
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
