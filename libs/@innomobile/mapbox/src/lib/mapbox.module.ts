import { HttpClientModule } from '@angular/common/http';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [
  ]
})
export class MapboxModule { 
  public static forRoot(mapboxToken: string): ModuleWithProviders {
    return {
      ngModule: MapboxModule,
      providers: [
        { provide: 'mapboxToken', useValue: mapboxToken }
      ]
    };
  }
}
