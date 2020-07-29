import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/model/produto';
import { of, Subject, Observable } from 'rxjs';
import { switchMap, debounceTime } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StockService } from 'src/app/services/stock/stock.service';

@Component({
  selector: 'app-list-stok',
  templateUrl: './list-stok.component.html',
  styleUrls: ['./list-stok.component.css']
})
export class ListStokComponent implements OnInit {
  public loadingPage: boolean = false
  public loadingMessage: string
  public message: string
  public product: Product
  public products: Product[]
  public productsAux: Product[]
  public subjectSearchNameProduct: Subject<string> = new Subject
  public observableSearchNameProduct: Observable<Product[]>
  public productView: Product

  public formUpdateProduct: FormGroup = new FormGroup({
    'unataryValue': new FormControl(null, [Validators.required, Validators.min(1)]),
    'nameProduct': new FormControl(null, [Validators.required, Validators.min(2)]),
    'quantity': new FormControl(null, [Validators.required, Validators.min(1)])
  })
  constructor(private stockService: StockService) {
    this.loadingMessage = 'Aguarde... Buscando todos os Produtos'
    this.loadingPage = true
    this.products = []
  }

  ngOnInit() {
    this.stockService.getStock()
      .subscribe(
        (products: Product[]) => {
          this.products = products
          this.productsAux = products
          if (this.products.length <= 0) {
            this.loadingMessage = 'Estoque vazio'
          }
          this.loadingPage = false
          this.loadingMessage = ''
        },
        (error) => {
          this.loadingPage = false
          console.log(error)
          this.loadingMessage = 'Erro na solicitação'
        })

    this.observableSearchNameProduct = this.subjectSearchNameProduct.pipe(
      debounceTime(1000),
      switchMap((name: string) => {
        if (name.trim() === '') {
          this.loadingPage = false
          return of<Product[]>(this.productsAux)
        }
        let products: Product[] = [];
        this.products.filter((p: Product) => {
          if (p.name.toLowerCase().match(new RegExp(name.toLowerCase()))) {
            products.push(p);
          }
        })
        this.loadingPage = false
        return of<Product[]>(products)

      })
    )
    this.observableSearchNameProduct.subscribe(
      (products: Product[]) => this.products = products
    )
  }

  public clearMessage() {
    this.message = ''
  }

  public viewProduct(idProduto: String) {
    this.productView = this.products.find((product) => {
      return product.id === idProduto
    })
    this.formUpdateProduct.get('nameProduct').setValue(this.productView.name)
    this.formUpdateProduct.get('unataryValue').setValue(this.productView.unitaryValue)
    this.formUpdateProduct.get('quantity').setValue(this.productView.quantityInStock)
  }

  public searchNameProduct(nameProduct: string) {
    this.subjectSearchNameProduct.next(nameProduct)
    this.loadingPage = true
  }

  public updateProduct() {
    this.loadingPage = true
    this.productView.name = this.formUpdateProduct.value.nameProduct
    this.productView.unitaryValue = this.formUpdateProduct.value.unataryValue
    this.productView.quantityInStock = this.formUpdateProduct.value.quantity

    this.stockService.updateProduct(this.productView).subscribe(
      (data) => {
        this.stockService.getStock().subscribe((products: Product[]) => { this.products = products; this.productsAux = this.products })
        this.loadingPage = false
        this.message = 'Produto atualizado com sucesso !!!'
      },
      (erro) => {
        this.loadingPage = false
        this.message = erro.error.message
      }
    )

  }
}
