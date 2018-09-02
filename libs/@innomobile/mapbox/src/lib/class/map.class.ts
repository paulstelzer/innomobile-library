export interface GeometryModel {
  type: string;
  coordinates: number[];
}

export interface GeoJsonModel {
  type: string;
  geometry: GeometryModel;
  properties?: any;
  $key?: string;
}

export class GeoJson implements GeoJsonModel {
  type = 'Feature';
  geometry: GeometryModel;
  properties = {};

  constructor(data: {
    type?: string;
    coordinates?: any;
    geometry?: any;
    properties?: any;
  }) {
    if (data.geometry) {
      this.geometry = data.geometry;
    } else {
      this.geometry = {
        type: data.type,
        coordinates: data.coordinates
      }
    }

    if (data.properties) {
      this.properties = data.properties;
    }

  }
}

export class FeatureCollection {
  type = 'FeatureCollection'
  constructor(public features: Array<GeoJson>) { }
}