import { TestBed } from '@angular/core/testing';

import { RestDocumentService } from './rest-document.service';

describe('RestDocumentService', () => {
  let service: RestDocumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestDocumentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
