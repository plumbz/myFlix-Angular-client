import { TestBed } from '@angular/core/testing';

import { MovieApiService } from './fetch-api-data.service';

describe('FetchApiDataService', () => {
  let service: MovieApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovieApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
