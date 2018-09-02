import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { Observable } from 'rxjs';
import { MapboxDirectionsOptions } from '../class/mapbox.interface';
import { GeoJson } from '../class/map.class';

@Injectable({
  providedIn: 'root'
})
export class MapboxService {

  constructor(
    @Inject('mapboxToken') private mapboxToken: string,
    private http: HttpClient
  ) {
    Object.getOwnPropertyDescriptor(mapboxgl, "accessToken").set(this.mapboxToken);
  }

  getDirections(coordinates: any[], options: MapboxDirectionsOptions = {}): Observable<any> {
    const mapboxOptions: MapboxDirectionsOptions = {
      api: 'https://api.mapbox.com/directions/v5/mapbox/',
      profile: 'driving',
      steps: false,
      overview: 'simplified',
      alternatives: false,
      geometries: 'polyline',
      access_token: this.mapboxToken,
      language: 'en',
      ...options
    };

    const mOptions = [];

    mOptions.push(`geometries=${mapboxOptions.geometries}`);
    mOptions.push(`language=${mapboxOptions.language}`);
    mOptions.push(`steps=${mapboxOptions.steps}`);
    mOptions.push(`overview=${mapboxOptions.overview}`);

    if (mapboxOptions.alternatives) mOptions.push(`alternatives=${mapboxOptions.alternatives}`);
    if (mapboxOptions.annotations) mOptions.push(`annotations=${mapboxOptions.annotations}`);
    if (mapboxOptions.approaches) mOptions.push(`approaches=${mapboxOptions.approaches}`);
    if (mapboxOptions.banner_instructions) mOptions.push(`banner_instructions=${mapboxOptions.banner_instructions}`);

    mOptions.push(`access_token=${mapboxOptions.access_token}`);

    const query = this.createQuery(coordinates);
    const url = `${mapboxOptions.api}${mapboxOptions.profile}/${query}?${mOptions.join('&')}`;

    return this.http.get(url);
  }

  createQuery(coordinates: any[]): string {
    let parameters = '';
    coordinates.forEach((element, index) => {
      if (index > 0) {
        parameters += ';';
      }
      parameters += element[0] + ',' + element[1];
    });
    return parameters;

  }

  getGeojsonData(route, requestType: string = 'polyline') {
    return (requestType === 'geojson')
      ? new GeoJson({ geometry: route })
      : new GeoJson({ type: 'LineString', coordinates: route });
  }

  getEncodedRoutes(geo: GeoJson): GeoJson {
    const route = geo.geometry.coordinates;
    geo.geometry.coordinates = this.polylineDecoder(route)
    return geo;
  }

  getSplittedLoops(markers, maxElements = 10) {
    const a = [];
    const rest = markers.length % maxElements;
    const queries = ((markers.length - rest) / maxElements);
    for (let i = 0; i <= queries; i++) {
      a.push(i);
    }
    return a;
  }
  getSplittedRoute(markers, i, maxElements = 10) {
    const start = (i === 0) ? i * maxElements : i * maxElements - 1;
    const end = i * maxElements + maxElements;
    const arr: any[] = markers.slice(start, end);
    if (arr.length === 0) return [];
    if (arr.length === 1) {
      const value = (i - 1) * maxElements + maxElements - 1;
      arr.unshift(markers[value])
    }
    return arr;
  }

  polylineDecoder(encoded) {
    // array that holds the points
    const points = []
    let index = 0, len = encoded.length;
    let lat = 0, lng = 0;
    while (index < len) {
      let b, shift = 0, result = 0;
      do {

        b = encoded.charAt(index++).charCodeAt(0) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      let dlat = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
      lat += dlat;
      shift = 0;
      result = 0;
      do {
        b = encoded.charAt(index++).charCodeAt(0) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      points.push([(lng / 1E5), (lat / 1E5)]);
      //points.push([(lat / 1E5), (lng / 1E5)]);

    }
    return points
  }


  async createGeometry(markers) {
    if (markers.length < 2) return;

    const promises = [];
    const splits = this.getSplittedLoops(markers);

    for (const i of splits) {
      const arr = this.getSplittedRoute(markers, i);
      if (arr.length === 0) break;

      promises.push(this.getDirections(arr).toPromise());
    }

    const routes = await Promise.all(promises);

    if (routes && routes.length > 0) {
      const obj = {
        distance: 0,
        duration: 0,
        geometry: [],
        steps: []
      }

      routes.forEach((route) => {
        if (route.routes[0] && route.code === 'Ok') {
          const r = route.routes[0];
          obj.distance += r.distance;
          obj.duration += r.duration;
          obj.geometry.push(r.geometry);

          r.legs.forEach(element => {
            obj.steps.push({
              distance: element.distance,
              duration: element.duration
            })
          });
        }

      });

      //console.log('obj', obj);
      return obj;
    }

    return null;
  }

  getAllGeoDataFromGeometry(data) {
    let route = [];
    data.geometry.forEach(element => {
      route = route.concat(this.polylineDecoder(element));
    });

    return new GeoJson({ type: 'LineString', coordinates: route });
  }

}
