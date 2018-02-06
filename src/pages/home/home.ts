import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Toast } from '@ionic-native/toast';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { Http } from '@angular/http'

let $ = require('jquery');

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  machineName = ""
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
    private _http: Http) {
     this.path = "jabbathebug.tircher.be";
    }

  cancel(){
    this.correctMachine = false;
    this.imageTaken = false;
    this.imageSrc = "";
  }
    
  getValues(){
    var values = {};

    //values["machineName"] = ;
  }


  send(){
    //{"machinename":"LEN1407",
    //"mailuser":"antoine.lambricht@student.vinci.be",
    //"descrip":"bluescreen of death", 
    //"photo":....}
    var data = this.getValues();
    this._http.post('http://jabbathebug.tircher.be/api/bugs', '{"machinename":"LEN1408","mailuser":"antoine.lambricht@student.vinci.be","descrip":"bluescreen of death"}')
            .subscribe(
            (response) => {
              this._toast.show("" + response.toString, '5000', 'center').subscribe(
                    toast => {
                      console.log("Send OK!");
                  }
                );
              this.correctMachine = false;
              this.imageTaken = false;
              this.imageSrc = "";
            }, (err) => {
              //this._alerteService.error("Subscribe Failed!");
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
