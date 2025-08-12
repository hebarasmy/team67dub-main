import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISOSButton } from '../sos-button.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../sos-button.test-samples';

import { SOSButtonService } from './sos-button.service';

const requireRestSample: ISOSButton = {
  ...sampleWithRequiredData,
};

describe('SOSButton Service', () => {
  let service: SOSButtonService;
  let httpMock: HttpTestingController;
  let expectedResult: ISOSButton | ISOSButton[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SOSButtonService);
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

    it('should create a SOSButton', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const sOSButton = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(sOSButton).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SOSButton', () => {
      const sOSButton = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(sOSButton).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a SOSButton', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SOSButton', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a SOSButton', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSOSButtonToCollectionIfMissing', () => {
      it('should add a SOSButton to an empty array', () => {
        const sOSButton: ISOSButton = sampleWithRequiredData;
        expectedResult = service.addSOSButtonToCollectionIfMissing([], sOSButton);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sOSButton);
      });

      it('should not add a SOSButton to an array that contains it', () => {
        const sOSButton: ISOSButton = sampleWithRequiredData;
        const sOSButtonCollection: ISOSButton[] = [
          {
            ...sOSButton,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSOSButtonToCollectionIfMissing(sOSButtonCollection, sOSButton);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SOSButton to an array that doesn't contain it", () => {
        const sOSButton: ISOSButton = sampleWithRequiredData;
        const sOSButtonCollection: ISOSButton[] = [sampleWithPartialData];
        expectedResult = service.addSOSButtonToCollectionIfMissing(sOSButtonCollection, sOSButton);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sOSButton);
      });

      it('should add only unique SOSButton to an array', () => {
        const sOSButtonArray: ISOSButton[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const sOSButtonCollection: ISOSButton[] = [sampleWithRequiredData];
        expectedResult = service.addSOSButtonToCollectionIfMissing(sOSButtonCollection, ...sOSButtonArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const sOSButton: ISOSButton = sampleWithRequiredData;
        const sOSButton2: ISOSButton = sampleWithPartialData;
        expectedResult = service.addSOSButtonToCollectionIfMissing([], sOSButton, sOSButton2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sOSButton);
        expect(expectedResult).toContain(sOSButton2);
      });

      it('should accept null and undefined values', () => {
        const sOSButton: ISOSButton = sampleWithRequiredData;
        expectedResult = service.addSOSButtonToCollectionIfMissing([], null, sOSButton, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sOSButton);
      });

      it('should return initial array if no SOSButton is added', () => {
        const sOSButtonCollection: ISOSButton[] = [sampleWithRequiredData];
        expectedResult = service.addSOSButtonToCollectionIfMissing(sOSButtonCollection, undefined, null);
        expect(expectedResult).toEqual(sOSButtonCollection);
      });
    });

    describe('compareSOSButton', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSOSButton(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareSOSButton(entity1, entity2);
        const compareResult2 = service.compareSOSButton(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareSOSButton(entity1, entity2);
        const compareResult2 = service.compareSOSButton(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareSOSButton(entity1, entity2);
        const compareResult2 = service.compareSOSButton(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
