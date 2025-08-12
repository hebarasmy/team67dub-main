import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { UserChatHistoryDetailComponent } from './user-chat-history-detail.component';

describe('UserChatHistory Management Detail Component', () => {
  let comp: UserChatHistoryDetailComponent;
  let fixture: ComponentFixture<UserChatHistoryDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserChatHistoryDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ userChatHistory: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(UserChatHistoryDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(UserChatHistoryDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load userChatHistory on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.userChatHistory).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
