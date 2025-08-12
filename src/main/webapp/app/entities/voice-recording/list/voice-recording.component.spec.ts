import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { VoiceRecordingService } from '../service/voice-recording.service';
import { VoiceRecordingComponent } from './voice-recording.component';

describe('VoiceRecording Management Component', () => {
  let comp: VoiceRecordingComponent;
  let fixture: ComponentFixture<VoiceRecordingComponent>;
  let service: VoiceRecordingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'voice-recording', component: VoiceRecordingComponent }]),
        HttpClientTestingModule
      ],
      declarations: [VoiceRecordingComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({ defaultSort: 'id,asc' }),
            queryParamMap: of(jest.requireActual('@angular/router').convertToParamMap({
              page: '1',
              size: '1',
              sort: 'id,desc',
            })),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(VoiceRecordingComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VoiceRecordingComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(VoiceRecordingService);

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
    expect(comp.recordings?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to voiceRecordingService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getVoiceRecordingIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getVoiceRecordingIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
