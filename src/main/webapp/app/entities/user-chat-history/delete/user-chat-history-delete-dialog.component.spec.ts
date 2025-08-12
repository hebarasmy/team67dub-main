jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { UserChatHistoryService } from '../service/user-chat-history.service';

import { UserChatHistoryDeleteDialogComponent } from './user-chat-history-delete-dialog.component';

describe('UserChatHistory Management Delete Component', () => {
  let comp: UserChatHistoryDeleteDialogComponent;
  let fixture: ComponentFixture<UserChatHistoryDeleteDialogComponent>;
  let service: UserChatHistoryService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [UserChatHistoryDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(UserChatHistoryDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(UserChatHistoryDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(UserChatHistoryService);
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  describe('confirmDelete', () => {
    it('Should call delete service on confirmDelete', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({ body: {} })));

        // WHEN
        comp.confirmDelete(123);
        tick();

        // THEN
        expect(service.delete).toHaveBeenCalledWith(123);
        expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
      })
    ));

    it('Should not call delete service on clear', () => {
      // GIVEN
      jest.spyOn(service, 'delete');

      // WHEN
      comp.cancel();

      // THEN
      expect(service.delete).not.toHaveBeenCalled();
      expect(mockActiveModal.close).not.toHaveBeenCalled();
      expect(mockActiveModal.dismiss).toHaveBeenCalled();
    });
  });
});
