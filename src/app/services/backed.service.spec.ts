import { TestBed } from '@angular/core/testing';

import { BackedService } from './backed.service';

describe('BackedService', () => {
  let service: BackedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
