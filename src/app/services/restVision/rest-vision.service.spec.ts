import { TestBed } from '@angular/core/testing';

import { RestVisionService } from './rest-vision.service';

describe('RestVisionService', () => {
  let service: RestVisionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestVisionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
