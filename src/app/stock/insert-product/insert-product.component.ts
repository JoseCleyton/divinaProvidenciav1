import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/model/produto';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StockService } from 'src/app/services/stock/stock.service';

@Component({
  selector: 'app-insert-product',
  templateUrl: './insert-product.component.html',
  styleUrls: ['./insert-product.component.css']
})
export class InsertProductComponent implements OnInit {
  public formInsertProduct: FormGroup
  public product: Product
  public message: String
  public loading: boolean
  public panelTips: boolean = true

  constructor(private stockService: StockService) { }

  ngOnInit() {
    this.formInsertProduct = new FormGroup({
      'unitaryValue': new FormControl(null, [Validators.required, Validators.min(1)]),
      'nameProduct': new FormControl(null, [Validators.required, Validators.min(2)]),
      'quantity': new FormControl(null, [Validators.required, Validators.min(1)])
    })
  }

  public insertProduct() {
    this.product = new Product(
      this.formInsertProduct.value.nameProduct,
      this.formInsertProduct.value.unitaryValue
    )

    this.product.quantityInStock = this.formInsertProduct.value.quantity
  }

  public insertProductStock() {
    this.message = 'Aguarde operação...'
    this.loading = true;
    this.stockService.insertInStock(this.product)
      .subscribe(() => {
        this.loading = false;
        this.message = 'Produto cadastrado com sucesso !'
        this.formInsertProduct.reset();
      }, () => {
        this.message = "Erro na solicitação"
      })
  }
  public clearMessage() {
    this.message = ''
  }
  public tips() {
    this.panelTips = !this.panelTips
  }
}
