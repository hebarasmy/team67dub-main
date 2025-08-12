import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { UserChatHistoryFormService } from './user-chat-history-form.service';
import { UserChatHistoryService } from '../service/user-chat-history.service';
import { IUserChatHistory } from '../user-chat-history.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { UserChatHistoryUpdateComponent } from './user-chat-history-update.component';

describe('UserChatHistory Management Update Component', () => {
  let comp: UserChatHistoryUpdateComponent;
  let fixture: ComponentFixture<UserChatHistoryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let userChatHistoryFormService: UserChatHistoryFormService;
  let userChatHistoryService: UserChatHistoryService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [UserChatHistoryUpdateComponent],
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
      .overrideTemplate(UserChatHistoryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserChatHistoryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    userChatHistoryFormService = TestBed.inject(UserChatHistoryFormService);
    userChatHistoryService = TestBed.inject(UserChatHistoryService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const userChatHistory: IUserChatHistory = { id: 456 };
      const user: IUser = { id: 72489 };
      userChatHistory.user = user;

      const userCollection: IUser[] = [{ id: 1892 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userChatHistory });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const userChatHistory: IUserChatHistory = { id: 456 };
      const user: IUser = { id: 74250 };
      userChatHistory.user = user;

      activatedRoute.data = of({ userChatHistory });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.userChatHistory).toEqual(userChatHistory);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserChatHistory>>();
      const userChatHistory = { id: 123 };
      jest.spyOn(userChatHistoryFormService, 'getUserChatHistory').mockReturnValue(userChatHistory);
      jest.spyOn(userChatHistoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userChatHistory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userChatHistory }));
      saveSubject.complete();

      // THEN
      expect(userChatHistoryFormService.getUserChatHistory).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(userChatHistoryService.update).toHaveBeenCalledWith(expect.objectContaining(userChatHistory));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserChatHistory>>();
      const userChatHistory = { id: 123 };
      jest.spyOn(userChatHistoryFormService, 'getUserChatHistory').mockReturnValue({ id: null });
      jest.spyOn(userChatHistoryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userChatHistory: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userChatHistory }));
      saveSubject.complete();

      // THEN
      expect(userChatHistoryFormService.getUserChatHistory).toHaveBeenCalled();
      expect(userChatHistoryService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserChatHistory>>();
      const userChatHistory = { id: 123 };
      jest.spyOn(userChatHistoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userChatHistory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(userChatHistoryService.update).toHaveBeenCalled();
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
