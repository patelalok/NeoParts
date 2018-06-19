import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { BackendService } from '../services/backend.service';
import { Router, Route, Routes, ActivatedRoute } from '@angular/router';
import { GlobalService } from '../global-service.service';
import { CustomerService } from '../customer/customer.service';
import { ServicesService } from '../shared/services.service';
import { Customer } from '../customer/customer.component';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit {
  productList: Product[] = [];
  menuDto: MenuDto[] = [];
  categoryList: Category[] = [];
  cartCount: number = 0;
  alok: Product[] = [];

  constructor(private http:Http,private globalService:GlobalService, private backendService: BackendService,private router: Router, private route: ActivatedRoute, private customerService: CustomerService, private persistService: ServicesService) { 
  }
  
    ngOnInit() {

      this.route.params.subscribe(params => {
        // PARAMS CHANGED .. TO SOMETHING REALLY COOL HERE ..
   
        // for example extract the id..

        let id = +params['id'];
        if(params['type']== 'model'){
           // (+) converts string 'id' to a number
          this.getProductByModelId(id);
        }
        else if(params['type']== 'category'){
          this.getProductByCategoryId(id);
        }   
      });
        // console.log(this.backendService.appleInfo);
        this.getMenuDetails();

      
    }

    getProductByModelId(id: number){
      //let id = +this.route.snapshot.paramMap.get('id');
      console.log("model id", id);
      this.backendService.getProductByModelId(id)
      .subscribe((product) =>{
        //this.productList = product;
        let selectedCustomer:Customer = this.persistService.getCustomerDetailsForSale();
        console.log('selected customer', selectedCustomer);

        if(selectedCustomer){

            product.forEach((product)=>{
            if(selectedCustomer.tier == 3){
              product.retail = product.tier3;
            }
            else if(selectedCustomer.tier == 2){
              product.retail = product.tier2;
            }
            else if(selectedCustomer.tier == 1){
              product.retail = product.tier1;
            }
          });
        }
        this.productList = product;
        this.productList = this.productList.slice();
        console.log('product list', this.productList);
      })
    }

    getProductByCategoryId(id: number){
      this.backendService.getProductByCategoryId(id)
      .subscribe((product) =>{
        this.productList = product;
        this.productList = this.productList.slice();
        console.log('product list', this.productList);
      });
    }
  
    getMenuDetails(){
  
      this.backendService.getData()
      .subscribe((data)=>{
        //console.log('menu', data);
  
        for(var i =0;i<data.categoryDtoList.length;i++){
          var str = data.categoryDtoList[i].name;
          //console.log('str', str);
  
          this.categoryList.push(data.categoryDtoList[i]);
        }
        this.categoryList = this.categoryList.slice();
  })
    }
  
    addProductToCart(product: Product){

      let selectedCustomer: Customer = this.persistService.getCustomerDetailsForSale();

     // console.log('product', product);
      product.customerPhoneNo = selectedCustomer.phoneNo;
      product.status = 'Online';
      product.date = '2018-03-11 09:41:27';

      console.log('Product Quanity to add from ui', product.saleQuantity);

      if(product.saleQuantity > 0){
        this.globalService.addProductToCart(product);

      }
      else {
        alert("Please Enter Valid Quantity");
      }
        
      //console.log('added cart product List', this.backendService.productList);
    }
  
  }

  export class Product {
    transactionLineItemId: number;
    productNo: string;
    description: string;
    categoryId: number;
    brandId: number;
    vendorId: number;
    modelId: number;
    cost: number;
    retail: number;
    tier1:number;
    tier2:number;
    tier3:number;
    saleQuantity: number;
    ecommerce: boolean;
    tax:boolean
    image: any;
    customerPhoneNo: string;
    date: any;
    status: any;
  }
  
  
  
  export class Category {
    name: string;
    categoryId: number;
  }
  export class Brand {
    name: string;
    brandId: number;
  }
  export class Model{
    name: string;
    modelId: number;
  }
  
  export class MenuDto{
    categoryDtoList: Category[];
    webBrandDtoList: Brand[];
    modelDtoList: Model[];
  }
  