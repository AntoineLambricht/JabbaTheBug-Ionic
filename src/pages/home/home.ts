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
  machineName = ""
  correctMachine:boolean = false;
  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }
  imageTaken:boolean = false;
  imageSrc = "";



  constructor(public navCtrl: NavController,
    private barcodeScanner: BarcodeScanner,
    private toast: Toast,
    public dataService: DataServiceProvider,
    private camera: Camera) {
     
    }

  cancel(){
    this.correctMachine = false;
    this.imageTaken = false;
    this.imageSrc = "";
  }
    
  send(){
    this.toast.show("Bug reported", '5000', 'center').subscribe(
          toast => {
          console.log(
          "Bug reported"
          );
        }
      );
    this.correctMachine = false;
    this.imageTaken = false;
    this.imageSrc = "";
  }

  scan() {
    this.barcodeScanner.scan().then((barcodeData) => {
      var res = barcodeData.text.split("//");
      if (res[0] === "jabbathebug:"){
        this.machineName = res[1];
        this.correctMachine = true;
      }
      else {
        this.cancel()
        this.toast.show("Incompatible QR-Code", '5000', 'center').subscribe(
          toast => {
            console.log(toast);
          }
        );
      }
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

  delPhoto(){
    this.imageTaken = false;
    this.imageSrc = "";
  }

}
