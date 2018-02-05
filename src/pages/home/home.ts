import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  color = "green";

  constructor(public navCtrl: NavController,private qrScanner: QRScanner) {

  }

  qrscanner(){
    this.color = "orange"
    this.qrScanner.prepare()
    .then((status: QRScannerStatus) => {

      this.color = "purple"

       if (status.authorized) {
         // camera permission was granted
  
         this.color = "yellow"
         // start scanning
         let scanSub = this.qrScanner.scan().subscribe((text: string) => {
           console.log('Scanned something', text);
            this.color = "blue"
           this.qrScanner.hide(); // hide camera preview
           scanSub.unsubscribe(); // stop scanning
         });
  
         // show camera preview
         this.qrScanner.show();
  
         // wait for user to scan something, then the observable callback will be called
  
       } else if (status.denied) {
          this.color = "red";       
         // camera permission was permanently denied
         // you must use QRScanner.openSettings() method to guide the user to the settings page
         // then they can grant the permission from there
       } else {
         this.color = "black";
         // permission was denied, but not permanently. You can ask for permission again at a later time.
       }
    })
    .catch((e: any) =>this.color = "Error is', "+e); 
  }
  

}
