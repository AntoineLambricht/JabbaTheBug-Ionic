import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Toast } from '@ionic-native/toast';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { Http, Headers, RequestOptions } from '@angular/http'
import { NgForm } from '@angular/forms';
import { Header } from 'ionic-angular/components/toolbar/toolbar-header';


const httpOptions = {
  headers: new Headers({
    'Content-Type':  'application/json'
  })
};


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {
  machineName = ""
  formValues = {}
  correctMachine:boolean = false;
  options: CameraOptions = {
    quality: 10,
    destinationType: this._camera.DestinationType.DATA_URL,
    encodingType: this._camera.EncodingType.JPEG,
    mediaType: this._camera.MediaType.PICTURE
  }
  imageTaken:boolean = false;
  imageSrc = "";
  path = "";


  constructor(public navCtrl: NavController,
    private _barcodeScanner: BarcodeScanner,
    private _toast: Toast,
    public dataService: DataServiceProvider,
    private _camera: Camera,
    private _http: Http) {
     this.path = "http://jabbathebug.tircher.be";
    }

  cancel(){
    this.correctMachine = false;
    this.imageTaken = false;
    this.imageSrc = "";
  }

  send(){
    if(this.imageSrc !== ""){
      this.formValues["photo"] = this.imageSrc;
    }
    
    this._http
    .post('http://jabbathebug.tircher.be/api/bugs',JSON.stringify(this.formValues),httpOptions)
    .subscribe(
            (response) => {
              this._toast.show("" + response.json(), '5000', 'bottom').subscribe(
                    toast => {
                      console.log("Send OK!");
                  }
                );
              this.correctMachine = false;
              this.imageTaken = false;
              this.imageSrc = "";
            }, (err) => {
              this._toast.show("Send Failed!", '5000', 'center').subscribe(
                toast => {
                  console.log("Send Failed!");
                }
              );
          }
          );

  }

  scan() {
    this._barcodeScanner.scan().then((barcodeData) => {
      var res = barcodeData.text.split("//");
      if (res[0] === "jabbathebug:"){
        this.machineName = res[1];
        this.correctMachine = true;
      }
      else {
        this.cancel()
        this._toast.show("Incompatible QR-Code", '5000', 'center').subscribe(
          toast => {
            console.log(toast);
          }
        );
      }
    }, (err) => {
      this._toast.show(err, '5000', 'center').subscribe(
        toast => {
          console.log(toast);
        }
      );
    });
  }

  takePhoto(){
    this._camera.getPicture(this.options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.imageSrc = 'data:image/jpeg;base64,' + imageData;
      this.imageTaken = true;
     }, (err) => {
      this._toast.show(err, '5000', 'center').subscribe(
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
