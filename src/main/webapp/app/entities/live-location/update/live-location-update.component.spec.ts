import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LiveLocationFormService } from './live-location-form.service';
import { LiveLocationService } from '../service/live-location.service';
import { ILiveLocation } from '../live-location.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { LiveLocationUpdateComponent } from './live-location-update.component';

describe('LiveLocation Management Update Component', () => {
  let comp: LiveLocationUpdateComponent;
  let fixture: ComponentFixture<LiveLocationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let liveLocationFormService: LiveLocationFormService;
  let liveLocationService: LiveLocationService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LiveLocationUpdateComponent],
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
      .overrideTemplate(LiveLocationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LiveLocationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    liveLocationFormService = TestBed.inject(LiveLocationFormService);
    liveLocationService = TestBed.inject(LiveLocationService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const liveLocation: ILiveLocation = { id: 456 };
      const user: IUser = { id: 56051 };
      liveLocation.user = user;

      const userCollection: IUser[] = [{ id: 3496 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ liveLocation });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const liveLocation: ILiveLocation = { id: 456 };
      const user: IUser = { id: 73185 };
      liveLocation.user = user;

      activatedRoute.data = of({ liveLocation });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.liveLocation).toEqual(liveLocation);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILiveLocation>>();
      const liveLocation = { id: 123 };
      jest.spyOn(liveLocationFormService, 'getLiveLocation').mockReturnValue(liveLocation);
      jest.spyOn(liveLocationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ liveLocation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: liveLocation }));
      saveSubject.complete();

      // THEN
      expect(liveLocationFormService.getLiveLocation).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(liveLocationService.update).toHaveBeenCalledWith(expect.objectContaining(liveLocation));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILiveLocation>>();
      const liveLocation = { id: 123 };
      jest.spyOn(liveLocationFormService, 'getLiveLocation').mockReturnValue({ id: null });
      jest.spyOn(liveLocationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ liveLocation: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: liveLocation }));
      saveSubject.complete();

      // THEN
      expect(liveLocationFormService.getLiveLocation).toHaveBeenCalled();
      expect(liveLocationService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILiveLocation>>();
      const liveLocation = { id: 123 };
      jest.spyOn(liveLocationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ liveLocation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(liveLocationService.update).toHaveBeenCalled();
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
  });
});
