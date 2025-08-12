import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILiveLocation } from '../live-location.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../live-location.test-samples';

import { LiveLocationService } from './live-location.service';

const requireRestSample: ILiveLocation = {
  ...sampleWithRequiredData,
};

describe('LiveLocation Service', () => {
  let service: LiveLocationService;
  let httpMock: HttpTestingController;
  let expectedResult: ILiveLocation | ILiveLocation[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LiveLocationService);
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

    it('should create a LiveLocation', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const liveLocation = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(liveLocation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a LiveLocation', () => {
      const liveLocation = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(liveLocation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a LiveLocation', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of LiveLocation', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a LiveLocation', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addLiveLocationToCollectionIfMissing', () => {
      it('should add a LiveLocation to an empty array', () => {
        const liveLocation: ILiveLocation = sampleWithRequiredData;
        expectedResult = service.addLiveLocationToCollectionIfMissing([], liveLocation);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(liveLocation);
      });

      it('should not add a LiveLocation to an array that contains it', () => {
        const liveLocation: ILiveLocation = sampleWithRequiredData;
        const liveLocationCollection: ILiveLocation[] = [
          {
            ...liveLocation,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addLiveLocationToCollectionIfMissing(liveLocationCollection, liveLocation);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a LiveLocation to an array that doesn't contain it", () => {
        const liveLocation: ILiveLocation = sampleWithRequiredData;
        const liveLocationCollection: ILiveLocation[] = [sampleWithPartialData];
        expectedResult = service.addLiveLocationToCollectionIfMissing(liveLocationCollection, liveLocation);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(liveLocation);
      });

      it('should add only unique LiveLocation to an array', () => {
        const liveLocationArray: ILiveLocation[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const liveLocationCollection: ILiveLocation[] = [sampleWithRequiredData];
        expectedResult = service.addLiveLocationToCollectionIfMissing(liveLocationCollection, ...liveLocationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const liveLocation: ILiveLocation = sampleWithRequiredData;
        const liveLocation2: ILiveLocation = sampleWithPartialData;
        expectedResult = service.addLiveLocationToCollectionIfMissing([], liveLocation, liveLocation2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(liveLocation);
        expect(expectedResult).toContain(liveLocation2);
      });

      it('should accept null and undefined values', () => {
        const liveLocation: ILiveLocation = sampleWithRequiredData;
        expectedResult = service.addLiveLocationToCollectionIfMissing([], null, liveLocation, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(liveLocation);
      });

      it('should return initial array if no LiveLocation is added', () => {
        const liveLocationCollection: ILiveLocation[] = [sampleWithRequiredData];
        expectedResult = service.addLiveLocationToCollectionIfMissing(liveLocationCollection, undefined, null);
        expect(expectedResult).toEqual(liveLocationCollection);
      });
    });

    describe('compareLiveLocation', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareLiveLocation(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareLiveLocation(entity1, entity2);
        const compareResult2 = service.compareLiveLocation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareLiveLocation(entity1, entity2);
        const compareResult2 = service.compareLiveLocation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareLiveLocation(entity1, entity2);
        const compareResult2 = service.compareLiveLocation(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
