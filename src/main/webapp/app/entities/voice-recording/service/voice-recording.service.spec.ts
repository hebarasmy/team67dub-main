import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IVoiceRecording } from '../voice-recording.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../voice-recording.test-samples';

import { VoiceRecordingService, RestVoiceRecording } from './voice-recording.service';

const requireRestSample: RestVoiceRecording = {
  ...sampleWithRequiredData,
  recordingDate: sampleWithRequiredData.recordingDate?.toJSON(),
};

describe('VoiceRecording Service', () => {
  let service: VoiceRecordingService;
  let httpMock: HttpTestingController;
  let expectedResult: IVoiceRecording | IVoiceRecording[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(VoiceRecordingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a VoiceRecording', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const voiceRecording = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(voiceRecording).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a VoiceRecording', () => {
      const voiceRecording = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(voiceRecording).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a VoiceRecording', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of VoiceRecording', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a VoiceRecording', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addVoiceRecordingToCollectionIfMissing', () => {
      it('should add a VoiceRecording to an empty array', () => {
        const voiceRecording: IVoiceRecording = sampleWithRequiredData;
        expectedResult = service.addVoiceRecordingToCollectionIfMissing([], voiceRecording);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(voiceRecording);
      });

      it('should not add a VoiceRecording to an array that contains it', () => {
        const voiceRecording: IVoiceRecording = sampleWithRequiredData;
        const voiceRecordingCollection: IVoiceRecording[] = [
          {
            ...voiceRecording,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addVoiceRecordingToCollectionIfMissing(voiceRecordingCollection, voiceRecording);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a VoiceRecording to an array that doesn't contain it", () => {
        const voiceRecording: IVoiceRecording = sampleWithRequiredData;
        const voiceRecordingCollection: IVoiceRecording[] = [sampleWithPartialData];
        expectedResult = service.addVoiceRecordingToCollectionIfMissing(voiceRecordingCollection, voiceRecording);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(voiceRecording);
      });

      it('should add only unique VoiceRecording to an array', () => {
        const voiceRecordingArray: IVoiceRecording[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const voiceRecordingCollection: IVoiceRecording[] = [sampleWithRequiredData];
        expectedResult = service.addVoiceRecordingToCollectionIfMissing(voiceRecordingCollection, ...voiceRecordingArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const voiceRecording: IVoiceRecording = sampleWithRequiredData;
        const voiceRecording2: IVoiceRecording = sampleWithPartialData;
        expectedResult = service.addVoiceRecordingToCollectionIfMissing([], voiceRecording, voiceRecording2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(voiceRecording);
        expect(expectedResult).toContain(voiceRecording2);
      });

      it('should accept null and undefined values', () => {
        const voiceRecording: IVoiceRecording = sampleWithRequiredData;
        expectedResult = service.addVoiceRecordingToCollectionIfMissing([], null, voiceRecording, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(voiceRecording);
      });

      it('should return initial array if no VoiceRecording is added', () => {
        const voiceRecordingCollection: IVoiceRecording[] = [sampleWithRequiredData];
        expectedResult = service.addVoiceRecordingToCollectionIfMissing(voiceRecordingCollection, undefined, null);
        expect(expectedResult).toEqual(voiceRecordingCollection);
      });
    });

    describe('compareVoiceRecording', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareVoiceRecording(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareVoiceRecording(entity1, entity2);
        const compareResult2 = service.compareVoiceRecording(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareVoiceRecording(entity1, entity2);
        const compareResult2 = service.compareVoiceRecording(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareVoiceRecording(entity1, entity2);
        const compareResult2 = service.compareVoiceRecording(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
