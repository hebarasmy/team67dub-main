import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SOSButtonFormService } from './sos-button-form.service';
import { SOSButtonService } from '../service/sos-button.service';
import { ISOSButton } from '../sos-button.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ILiveLocation } from 'app/entities/live-location/live-location.model';
import { LiveLocationService } from 'app/entities/live-location/service/live-location.service';

import { SOSButtonUpdateComponent } from './sos-button-update.component';

describe('SOSButton Management Update Component', () => {
  let comp: SOSButtonUpdateComponent;
  let fixture: ComponentFixture<SOSButtonUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let sOSButtonFormService: SOSButtonFormService;
  let sOSButtonService: SOSButtonService;
  let userService: UserService;
  let liveLocationService: LiveLocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SOSButtonUpdateComponent],
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
      .overrideTemplate(SOSButtonUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SOSButtonUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    sOSButtonFormService = TestBed.inject(SOSButtonFormService);
    sOSButtonService = TestBed.inject(SOSButtonService);
    userService = TestBed.inject(UserService);
    liveLocationService = TestBed.inject(LiveLocationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const sOSButton: ISOSButton = { id: 456 };
      const user: IUser = { id: 20229 };
      sOSButton.user = user;

      const userCollection: IUser[] = [{ id: 70500 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ sOSButton });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call liveLocation query and add missing value', () => {
      const sOSButton: ISOSButton = { id: 456 };
      const liveLocation: ILiveLocation = { id: 59610 };
      sOSButton.liveLocation = liveLocation;

      const liveLocationCollection: ILiveLocation[] = [{ id: 85700 }];
      jest.spyOn(liveLocationService, 'query').mockReturnValue(of(new HttpResponse({ body: liveLocationCollection })));
      const expectedCollection: ILiveLocation[] = [liveLocation, ...liveLocationCollection];
      jest.spyOn(liveLocationService, 'addLiveLocationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ sOSButton });
      comp.ngOnInit();

      expect(liveLocationService.query).toHaveBeenCalled();
      expect(liveLocationService.addLiveLocationToCollectionIfMissing).toHaveBeenCalledWith(liveLocationCollection, liveLocation);
      expect(comp.liveLocationsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const sOSButton: ISOSButton = { id: 456 };
      const user: IUser = { id: 4750 };
      sOSButton.user = user;
      const liveLocation: ILiveLocation = { id: 31707 };
      sOSButton.liveLocation = liveLocation;

      activatedRoute.data = of({ sOSButton });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.liveLocationsCollection).toContain(liveLocation);
      expect(comp.sOSButton).toEqual(sOSButton);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISOSButton>>();
      const sOSButton = { id: 123 };
      jest.spyOn(sOSButtonFormService, 'getSOSButton').mockReturnValue(sOSButton);
      jest.spyOn(sOSButtonService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sOSButton });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sOSButton }));
      saveSubject.complete();

      // THEN
      expect(sOSButtonFormService.getSOSButton).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(sOSButtonService.update).toHaveBeenCalledWith(expect.objectContaining(sOSButton));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISOSButton>>();
      const sOSButton = { id: 123 };
      jest.spyOn(sOSButtonFormService, 'getSOSButton').mockReturnValue({ id: null });
      jest.spyOn(sOSButtonService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sOSButton: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sOSButton }));
      saveSubject.complete();

      // THEN
      expect(sOSButtonFormService.getSOSButton).toHaveBeenCalled();
      expect(sOSButtonService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISOSButton>>();
      const sOSButton = { id: 123 };
      jest.spyOn(sOSButtonService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sOSButton });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(sOSButtonService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });

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
