import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Toast } from '@ionic-native/toast';
import { DataServiceProvider } from '../../providers/data-service/data-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  detected:boolean = false;
  value:string = "Not Yet";

  constructor(public navCtrl: NavController,
    private barcodeScanner: BarcodeScanner,
    private toast: Toast){
    // public dataService: DataServiceProvider) {
    //   this.dataService.getProducts()
    //     .subscribe((response)=> {
    //         this.products = response
    //         console.log(this.products);
    //     });
  }

  scan() {
    // this.selectedProduct = {};
    this.barcodeScanner.scan().then((barcodeData) => {
      /*this.selectedProduct = this.products.find(product => product.plu === barcodeData.text);
      if(this.selectedProduct !== undefined) {
        this.productFound = true;
        console.log(this.selectedProduct);
      } else {
        this.selectedProduct = {};
        this.productFound = false;
        this.toast.show('Product not found', '5000', 'center').subscribe(
          toast => {
            console.log(toast);
          }
        );
      }*/
      this.detected = true;
      this.value = barcodeData.text;
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

}
