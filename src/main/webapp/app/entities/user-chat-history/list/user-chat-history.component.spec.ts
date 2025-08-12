import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { UserChatHistoryService } from '../service/user-chat-history.service';

import { UserChatHistoryComponent } from './user-chat-history.component';

describe('UserChatHistory Management Component', () => {
  let comp: UserChatHistoryComponent;
  let fixture: ComponentFixture<UserChatHistoryComponent>;
  let service: UserChatHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'user-chat-history', component: UserChatHistoryComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [UserChatHistoryComponent],
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
      .overrideTemplate(UserChatHistoryComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserChatHistoryComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(UserChatHistoryService);

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
    expect(comp.userChatHistories?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to userChatHistoryService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getUserChatHistoryIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getUserChatHistoryIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
