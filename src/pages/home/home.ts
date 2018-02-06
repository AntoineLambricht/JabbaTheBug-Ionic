import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Toast } from '@ionic-native/toast';
import { DataServiceProvider } from '../../providers/data-service/data-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  machineName = "PAS TEST"
  correctMachine = false;
  products: any[] = [];
  selectedProduct: any;
  productFound:boolean = false;
  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }
  imageTaken = false;
  imageSrc = "";



  constructor(public navCtrl: NavController,
    private barcodeScanner: BarcodeScanner,
    private toast: Toast,
    public dataService: DataServiceProvider,
    private camera: Camera) {
     
    }


    
    
    

  scan() {
    this.barcodeScanner.scan().then((barcodeData) => {
      this.machineName = barcodeData.text
      this.correctMachine = true;
      this.toast.show(barcodeData.text, '5000', 'center').subscribe(
        toast => {
          console.log(barcodeData.text);
        }
      );
    }, (err) => {
      this.toast.show(err, '5000', 'center').subscribe(
        toast => {
          console.log(toast);
        }
      );
    });
  }

  takePhoto(){
    this.camera.getPicture(this.options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.imageSrc = 'data:image/jpeg;base64,' + imageData;
      this.imageTaken = true;
     }, (err) => {
      this.toast.show(err, '5000', 'center').subscribe(
        toast => {
          console.log(toast);
        }
      );
     });
  }

}
