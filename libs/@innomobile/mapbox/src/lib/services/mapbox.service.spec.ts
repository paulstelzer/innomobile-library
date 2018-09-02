import { TestBed, inject } from '@angular/core/testing';

import { MapboxService } from './mapbox.service';

describe('MapboxService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapboxService]
    });
  });

  it('should be created', inject([MapboxService], (service: MapboxService) => {
    expect(service).toBeTruthy();
  }));
});
