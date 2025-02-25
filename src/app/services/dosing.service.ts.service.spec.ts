import { TestBed } from '@angular/core/testing';

import { DosingServiceTsService } from './dosing.service';

describe('DosingServiceTsService', () => {
  let service: DosingServiceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DosingServiceTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
