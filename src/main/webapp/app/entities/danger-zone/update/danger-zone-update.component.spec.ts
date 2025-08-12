import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DangerZoneFormService } from './danger-zone-form.service';
import { DangerZoneService } from '../service/danger-zone.service';
import { IDangerZone } from '../danger-zone.model';

import { DangerZoneUpdateComponent } from './danger-zone-update.component';

describe('DangerZone Management Update Component', () => {
  let comp: DangerZoneUpdateComponent;
  let fixture: ComponentFixture<DangerZoneUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let dangerZoneFormService: DangerZoneFormService;
  let dangerZoneService: DangerZoneService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DangerZoneUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(DangerZoneUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DangerZoneUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    dangerZoneFormService = TestBed.inject(DangerZoneFormService);
    dangerZoneService = TestBed.inject(DangerZoneService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const dangerZone: IDangerZone = { id: 456 };

      activatedRoute.data = of({ dangerZone });
      comp.ngOnInit();

      expect(comp.dangerZone).toEqual(dangerZone);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDangerZone>>();
      const dangerZone = { id: 123 };
      jest.spyOn(dangerZoneFormService, 'getDangerZone').mockReturnValue(dangerZone);
      jest.spyOn(dangerZoneService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ dangerZone });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: dangerZone }));
      saveSubject.complete();

      // THEN
      expect(dangerZoneFormService.getDangerZone).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(dangerZoneService.update).toHaveBeenCalledWith(expect.objectContaining(dangerZone));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDangerZone>>();
      const dangerZone = { id: 123 };
      jest.spyOn(dangerZoneFormService, 'getDangerZone').mockReturnValue({ id: null });
      jest.spyOn(dangerZoneService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ dangerZone: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: dangerZone }));
      saveSubject.complete();

      // THEN
      expect(dangerZoneFormService.getDangerZone).toHaveBeenCalled();
      expect(dangerZoneService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDangerZone>>();
      const dangerZone = { id: 123 };
      jest.spyOn(dangerZoneService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ dangerZone });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(dangerZoneService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
