import { Component, OnInit } from '@angular/core';
import { PlanesPaypalService } from '../../service/planes-paypal.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductPaypalService } from '../../service/product-paypal.service';
import { PlanesAddComponent } from '../planes-add/planes-add.component';
import { PlanesEditComponent } from '../planes-edit/planes-edit.component';

@Component({
  selector: 'app-planes-list',
  templateUrl: './planes-list.component.html',
  styleUrls: ['./planes-list.component.scss']
})
export class PlanesListComponent implements OnInit {

  search:any = null;
  PRODUCTS: any [];
  PLANES: any [];

  isLoading:any;
  constructor(
    public modalService: NgbModal,
    public productPaypalService: ProductPaypalService,
    public planesPaypalService: PlanesPaypalService,
  ) { }

  ngOnInit(): void {
    this.isLoading = this.planesPaypalService.isLoading$;
    this.listProducts();
    this.listPlanes();
  }

  listPlanes(){
    this.planesPaypalService.listPlanes(this.search).subscribe((resp:any) => {
      console.log(resp);
      this.PLANES = resp.plans;
    })
  }

  listProducts(){
    this.productPaypalService.listProducts().subscribe((resp:any) => {
      console.log(resp);
      this.PRODUCTS = resp.products;
    })
  }

  registerPlane(){
    const modalRef = this.modalService.open(PlanesAddComponent,{centered: true, size: 'md'});

    modalRef.componentInstance.ProductC.subscribe((Product:any) => {
      this.PRODUCTS.unshift(Product);
    });
  }

  editPlane(PRODUCT:any){
    const modalRef = this.modalService.open(PlanesEditComponent,{centered: true, size: 'md'});
    modalRef.componentInstance.product_selected = PRODUCT;

    modalRef.componentInstance.ProductE.subscribe((Product:any) => {

     let index = this.PRODUCTS.findIndex((item:any) => item.id == Product.id);
     if(index != -1){
      this.PRODUCTS[index] = Product;
     }
    });
}

}
