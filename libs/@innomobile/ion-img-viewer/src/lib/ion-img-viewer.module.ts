import { NgModule, ModuleWithProviders } from '@angular/core';
import { IonicModule } from '@ionic/angular';


@NgModule({
    imports: [
        IonicModule
    ],
    declarations: [
    ],
    exports: [
    ],
    entryComponents: [
    ]
})
export class IonImgViewerModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: IonImgViewerModule
        };
    }
}
