import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Toast } from '@ionic-native/toast';
import { DataServiceProvider } from '../../providers/data-service/data-service';
//import { Http, Headers, RequestOptions } from '@angular/http'
import { HTTP } from '@ionic-native/http';
import { NgForm } from '@angular/forms';
import { Header } from 'ionic-angular/components/toolbar/toolbar-header';

//let $ = require('jquery');

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  machineName = ""
  formValues = {}
  correctMachine:boolean = false;
  options: CameraOptions = {
    quality: 100,
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
    private http: HTTP){
    //private _http: Http) {
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
    this._toast.show(JSON.stringify(this.formValues), '5000', 'bottom').subscribe(
      toast => {
        console.log("Send OK!");
    }
  );
  this.http.post(this.path + '/api/bugs', this.formValues, {headers : {'Content-Type':'application/json'}})
  .then(data => {
    this._toast.show("" +data.status, '5000', 'bottom').subscribe(
                       toast => {
                         console.log("Send OK!");
                     }
                   );
    console.log(data.status);
    console.log(data.data); // data received by server
    console.log(data.headers);

  })
  .catch(error => {
    this._toast.show("" +error.status, '5000', 'bottom').subscribe(
      toast => {
        console.log("Send OK!");
    }
  );
    console.log(error.status);
    console.log(error.error); // error message as string
    console.log(error.headers);

  });
    // this._http.post('http://jabbathebug.tircher.be/api/bugs',JSON.stringify(this.formValues)
    //     ).then(
    //         (response) => {
    //           this._toast.show("" + response.toString(), '5000', 'bottom').subscribe(
    //                 toast => {
    //                   console.log("Send OK!");
    //               }
    //             );
    //           this.correctMachine = false;
    //           this.imageTaken = false;
    //           this.imageSrc = "";
    //         }, (err) => {
    //           //this._alerteService.error("Subscribe Failed!");
    //           this._toast.show("Send Failed!", '5000', 'center').subscribe(
    //             toast => {
    //               console.log("Send Failed!");
    //             }
    //           );
    //       }
    //       );

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
