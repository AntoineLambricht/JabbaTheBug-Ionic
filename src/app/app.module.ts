import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Camera } from '@ionic-native/camera';
import { Toast } from '@ionic-native/toast';
import { HttpModule } from '@angular/http';
import { HTTP } from '@ionic-native/http';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { DataServiceProvider } from '../providers/data-service/data-service';

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HTTP,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BarcodeScanner,
    Toast,
    Camera,
    DataServiceProvider
  ]
})
export class AppModule {}
