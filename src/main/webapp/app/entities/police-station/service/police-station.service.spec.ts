import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPoliceStation } from '../police-station.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../police-station.test-samples';

import { PoliceStationService } from './police-station.service';

const requireRestSample: IPoliceStation = {
  ...sampleWithRequiredData,
};

describe('PoliceStation Service', () => {
  let service: PoliceStationService;
  let httpMock: HttpTestingController;
  let expectedResult: IPoliceStation | IPoliceStation[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PoliceStationService);
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

    it('should create a PoliceStation', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const policeStation = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(policeStation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PoliceStation', () => {
      const policeStation = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(policeStation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PoliceStation', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PoliceStation', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a PoliceStation', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPoliceStationToCollectionIfMissing', () => {
      it('should add a PoliceStation to an empty array', () => {
        const policeStation: IPoliceStation = sampleWithRequiredData;
        expectedResult = service.addPoliceStationToCollectionIfMissing([], policeStation);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(policeStation);
      });

      it('should not add a PoliceStation to an array that contains it', () => {
        const policeStation: IPoliceStation = sampleWithRequiredData;
        const policeStationCollection: IPoliceStation[] = [
          {
            ...policeStation,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPoliceStationToCollectionIfMissing(policeStationCollection, policeStation);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PoliceStation to an array that doesn't contain it", () => {
        const policeStation: IPoliceStation = sampleWithRequiredData;
        const policeStationCollection: IPoliceStation[] = [sampleWithPartialData];
        expectedResult = service.addPoliceStationToCollectionIfMissing(policeStationCollection, policeStation);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(policeStation);
      });

      it('should add only unique PoliceStation to an array', () => {
        const policeStationArray: IPoliceStation[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const policeStationCollection: IPoliceStation[] = [sampleWithRequiredData];
        expectedResult = service.addPoliceStationToCollectionIfMissing(policeStationCollection, ...policeStationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const policeStation: IPoliceStation = sampleWithRequiredData;
        const policeStation2: IPoliceStation = sampleWithPartialData;
        expectedResult = service.addPoliceStationToCollectionIfMissing([], policeStation, policeStation2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(policeStation);
        expect(expectedResult).toContain(policeStation2);
      });

      it('should accept null and undefined values', () => {
        const policeStation: IPoliceStation = sampleWithRequiredData;
        expectedResult = service.addPoliceStationToCollectionIfMissing([], null, policeStation, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(policeStation);
      });

      it('should return initial array if no PoliceStation is added', () => {
        const policeStationCollection: IPoliceStation[] = [sampleWithRequiredData];
        expectedResult = service.addPoliceStationToCollectionIfMissing(policeStationCollection, undefined, null);
        expect(expectedResult).toEqual(policeStationCollection);
      });
    });

    describe('comparePoliceStation', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePoliceStation(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePoliceStation(entity1, entity2);
        const compareResult2 = service.comparePoliceStation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePoliceStation(entity1, entity2);
        const compareResult2 = service.comparePoliceStation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePoliceStation(entity1, entity2);
        const compareResult2 = service.comparePoliceStation(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
