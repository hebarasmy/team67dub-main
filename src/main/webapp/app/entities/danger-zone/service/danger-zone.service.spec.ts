import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDangerZone } from '../danger-zone.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../danger-zone.test-samples';

import { DangerZoneService } from './danger-zone.service';

const requireRestSample: IDangerZone = {
  ...sampleWithRequiredData,
};

describe('DangerZone Service', () => {
  let service: DangerZoneService;
  let httpMock: HttpTestingController;
  let expectedResult: IDangerZone | IDangerZone[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DangerZoneService);
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

    it('should create a DangerZone', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const dangerZone = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(dangerZone).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a DangerZone', () => {
      const dangerZone = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(dangerZone).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a DangerZone', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of DangerZone', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a DangerZone', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addDangerZoneToCollectionIfMissing', () => {
      it('should add a DangerZone to an empty array', () => {
        const dangerZone: IDangerZone = sampleWithRequiredData;
        expectedResult = service.addDangerZoneToCollectionIfMissing([], dangerZone);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(dangerZone);
      });

      it('should not add a DangerZone to an array that contains it', () => {
        const dangerZone: IDangerZone = sampleWithRequiredData;
        const dangerZoneCollection: IDangerZone[] = [
          {
            ...dangerZone,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addDangerZoneToCollectionIfMissing(dangerZoneCollection, dangerZone);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a DangerZone to an array that doesn't contain it", () => {
        const dangerZone: IDangerZone = sampleWithRequiredData;
        const dangerZoneCollection: IDangerZone[] = [sampleWithPartialData];
        expectedResult = service.addDangerZoneToCollectionIfMissing(dangerZoneCollection, dangerZone);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(dangerZone);
      });

      it('should add only unique DangerZone to an array', () => {
        const dangerZoneArray: IDangerZone[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const dangerZoneCollection: IDangerZone[] = [sampleWithRequiredData];
        expectedResult = service.addDangerZoneToCollectionIfMissing(dangerZoneCollection, ...dangerZoneArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const dangerZone: IDangerZone = sampleWithRequiredData;
        const dangerZone2: IDangerZone = sampleWithPartialData;
        expectedResult = service.addDangerZoneToCollectionIfMissing([], dangerZone, dangerZone2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(dangerZone);
        expect(expectedResult).toContain(dangerZone2);
      });

      it('should accept null and undefined values', () => {
        const dangerZone: IDangerZone = sampleWithRequiredData;
        expectedResult = service.addDangerZoneToCollectionIfMissing([], null, dangerZone, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(dangerZone);
      });

      it('should return initial array if no DangerZone is added', () => {
        const dangerZoneCollection: IDangerZone[] = [sampleWithRequiredData];
        expectedResult = service.addDangerZoneToCollectionIfMissing(dangerZoneCollection, undefined, null);
        expect(expectedResult).toEqual(dangerZoneCollection);
      });
    });

    describe('compareDangerZone', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareDangerZone(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareDangerZone(entity1, entity2);
        const compareResult2 = service.compareDangerZone(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareDangerZone(entity1, entity2);
        const compareResult2 = service.compareDangerZone(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareDangerZone(entity1, entity2);
        const compareResult2 = service.compareDangerZone(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
