import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { VoiceRecordingDetailComponent } from './voice-recording-detail.component';

describe('VoiceRecording Management Detail Component', () => {
  let comp: VoiceRecordingDetailComponent;
  let fixture: ComponentFixture<VoiceRecordingDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VoiceRecordingDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ voiceRecording: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(VoiceRecordingDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(VoiceRecordingDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load voiceRecording on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.voiceRecording).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
