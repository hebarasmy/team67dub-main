import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IUserChatHistory } from '../user-chat-history.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../user-chat-history.test-samples';

import { UserChatHistoryService, RestUserChatHistory } from './user-chat-history.service';

const requireRestSample: RestUserChatHistory = {
  ...sampleWithRequiredData,
  messageDateTime: sampleWithRequiredData.messageDateTime?.toJSON(),
};

describe('UserChatHistory Service', () => {
  let service: UserChatHistoryService;
  let httpMock: HttpTestingController;
  let expectedResult: IUserChatHistory | IUserChatHistory[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(UserChatHistoryService);
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

    it('should create a UserChatHistory', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const userChatHistory = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(userChatHistory).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a UserChatHistory', () => {
      const userChatHistory = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(userChatHistory).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a UserChatHistory', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of UserChatHistory', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a UserChatHistory', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addUserChatHistoryToCollectionIfMissing', () => {
      it('should add a UserChatHistory to an empty array', () => {
        const userChatHistory: IUserChatHistory = sampleWithRequiredData;
        expectedResult = service.addUserChatHistoryToCollectionIfMissing([], userChatHistory);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userChatHistory);
      });

      it('should not add a UserChatHistory to an array that contains it', () => {
        const userChatHistory: IUserChatHistory = sampleWithRequiredData;
        const userChatHistoryCollection: IUserChatHistory[] = [
          {
            ...userChatHistory,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addUserChatHistoryToCollectionIfMissing(userChatHistoryCollection, userChatHistory);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a UserChatHistory to an array that doesn't contain it", () => {
        const userChatHistory: IUserChatHistory = sampleWithRequiredData;
        const userChatHistoryCollection: IUserChatHistory[] = [sampleWithPartialData];
        expectedResult = service.addUserChatHistoryToCollectionIfMissing(userChatHistoryCollection, userChatHistory);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userChatHistory);
      });

      it('should add only unique UserChatHistory to an array', () => {
        const userChatHistoryArray: IUserChatHistory[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const userChatHistoryCollection: IUserChatHistory[] = [sampleWithRequiredData];
        expectedResult = service.addUserChatHistoryToCollectionIfMissing(userChatHistoryCollection, ...userChatHistoryArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const userChatHistory: IUserChatHistory = sampleWithRequiredData;
        const userChatHistory2: IUserChatHistory = sampleWithPartialData;
        expectedResult = service.addUserChatHistoryToCollectionIfMissing([], userChatHistory, userChatHistory2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userChatHistory);
        expect(expectedResult).toContain(userChatHistory2);
      });

      it('should accept null and undefined values', () => {
        const userChatHistory: IUserChatHistory = sampleWithRequiredData;
        expectedResult = service.addUserChatHistoryToCollectionIfMissing([], null, userChatHistory, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userChatHistory);
      });

      it('should return initial array if no UserChatHistory is added', () => {
        const userChatHistoryCollection: IUserChatHistory[] = [sampleWithRequiredData];
        expectedResult = service.addUserChatHistoryToCollectionIfMissing(userChatHistoryCollection, undefined, null);
        expect(expectedResult).toEqual(userChatHistoryCollection);
      });
    });

    describe('compareUserChatHistory', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareUserChatHistory(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareUserChatHistory(entity1, entity2);
        const compareResult2 = service.compareUserChatHistory(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareUserChatHistory(entity1, entity2);
        const compareResult2 = service.compareUserChatHistory(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareUserChatHistory(entity1, entity2);
        const compareResult2 = service.compareUserChatHistory(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
