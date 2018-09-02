import { MapboxModule } from './mapbox.module';

describe('MapboxModule', () => {
  let mapboxModule: MapboxModule;

  beforeEach(() => {
    mapboxModule = new MapboxModule();
  });

  it('should create an instance', () => {
    expect(mapboxModule).toBeTruthy();
  });
});
