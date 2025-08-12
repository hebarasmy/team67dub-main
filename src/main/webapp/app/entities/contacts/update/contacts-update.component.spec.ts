import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ContactsFormService } from './contacts-form.service';
import { ContactsService } from '../service/contacts.service';
import { IContacts } from '../contacts.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ISOSButton } from 'app/entities/sos-button/sos-button.model';
import { SOSButtonService } from 'app/entities/sos-button/service/sos-button.service';

import { ContactsUpdateComponent } from './contacts-update.component';

describe('Contacts Management Update Component', () => {
  let comp: ContactsUpdateComponent;
  let fixture: ComponentFixture<ContactsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let contactsFormService: ContactsFormService;
  let contactsService: ContactsService;
  let userService: UserService;
  let sOSButtonService: SOSButtonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ContactsUpdateComponent],
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
      .overrideTemplate(ContactsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ContactsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    contactsFormService = TestBed.inject(ContactsFormService);
    contactsService = TestBed.inject(ContactsService);
    userService = TestBed.inject(UserService);
    sOSButtonService = TestBed.inject(SOSButtonService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const contacts: IContacts = { id: 456 };
      const users: IUser[] = [{ id: 9177 }];
      contacts.users = users;

      const userCollection: IUser[] = [{ id: 72100 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [...users];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ contacts });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call SOSButton query and add missing value', () => {
      const contacts: IContacts = { id: 456 };
      const sOSButton: ISOSButton = { id: 978 };
      contacts.sOSButton = sOSButton;

      const sOSButtonCollection: ISOSButton[] = [{ id: 58885 }];
      jest.spyOn(sOSButtonService, 'query').mockReturnValue(of(new HttpResponse({ body: sOSButtonCollection })));
      const additionalSOSButtons = [sOSButton];
      const expectedCollection: ISOSButton[] = [...additionalSOSButtons, ...sOSButtonCollection];
      jest.spyOn(sOSButtonService, 'addSOSButtonToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ contacts });
      comp.ngOnInit();

      expect(sOSButtonService.query).toHaveBeenCalled();
      expect(sOSButtonService.addSOSButtonToCollectionIfMissing).toHaveBeenCalledWith(
        sOSButtonCollection,
        ...additionalSOSButtons.map(expect.objectContaining)
      );
      expect(comp.sOSButtonsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const contacts: IContacts = { id: 456 };
      const user: IUser = { id: 17765 };
      contacts.users = [user];
      const sOSButton: ISOSButton = { id: 68210 };
      contacts.sOSButton = sOSButton;

      activatedRoute.data = of({ contacts });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.sOSButtonsSharedCollection).toContain(sOSButton);
      expect(comp.contacts).toEqual(contacts);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IContacts>>();
      const contacts = { id: 123 };
      jest.spyOn(contactsFormService, 'getContacts').mockReturnValue(contacts);
      jest.spyOn(contactsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ contacts });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: contacts }));
      saveSubject.complete();

      // THEN
      expect(contactsFormService.getContacts).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(contactsService.update).toHaveBeenCalledWith(expect.objectContaining(contacts));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IContacts>>();
      const contacts = { id: 123 };
      jest.spyOn(contactsFormService, 'getContacts').mockReturnValue({ id: null });
      jest.spyOn(contactsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ contacts: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: contacts }));
      saveSubject.complete();

      // THEN
      expect(contactsFormService.getContacts).toHaveBeenCalled();
      expect(contactsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IContacts>>();
      const contacts = { id: 123 };
      jest.spyOn(contactsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ contacts });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(contactsService.update).toHaveBeenCalled();
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

    describe('compareSOSButton', () => {
      it('Should forward to sOSButtonService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(sOSButtonService, 'compareSOSButton');
        comp.compareSOSButton(entity, entity2);
        expect(sOSButtonService.compareSOSButton).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
