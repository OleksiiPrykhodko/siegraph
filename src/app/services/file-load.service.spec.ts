import { TestBed } from '@angular/core/testing';

import { FileLoadService } from './file-load.service';

describe('FileLoadService', () => {
  let service: FileLoadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileLoadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
