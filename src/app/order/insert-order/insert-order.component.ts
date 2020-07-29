import { Component, OnInit } from '@angular/core';
import { OrderIten } from 'src/app/model/ItenPedido';
import { Product } from 'src/app/model/produto';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { OrderService } from 'src/app/services/order/order.service';
import { Router } from '@angular/router';
import { StockService } from 'src/app/services/stock/stock.service';

@Component({
  selector: 'app-insert-order',
  templateUrl: './insert-order.component.html',
  styleUrls: ['./insert-order.component.css']
})
export class InsertOrderComponent implements OnInit {

  public deleteItem: OrderIten = null;
  public orderItens: OrderIten[] = []
  public orderValue: number = 0
  public loadingPage: boolean = false
  public message: string
  public enableModalButton = true
  public products: Product[] = []
  public loadingProducts: boolean
  public panelTips: boolean = true
  public itenEditQuantity: OrderIten

  public formInsertProduct: FormGroup = new FormGroup({
    'qntd': new FormControl(null, [Validators.required, Validators.min(1)]),
    'id': new FormControl(null, [Validators.required])
  })
  public formNameClient: FormGroup = new FormGroup({
    'nameClient': new FormControl(null, [Validators.required, Validators.min(3)]),
    'comments': new FormControl(null),
    'orderValue': new FormControl(null)
  })
  public formEditQuantity: FormGroup = new FormGroup({
    'quantity': new FormControl(null, [Validators.required]),
  })
  constructor(private orderService: OrderService, private router: Router, private stockService: StockService) { }

  ngOnInit() {
    this.loadingProducts = true
    this.orderItens = this.orderService.getOrderItems()
    this.orderValue = this.orderService.getOrderValue()
    if (this.orderItens.length > 0) {
      this.enableModalButton = false
    }
    this.stockService.getStock().subscribe(
      (products: Product[]) => {
        this.loadingProducts = false;
        this.products = products
      }
    )
  }

  public addProductToList() {
    let id: String = this.formInsertProduct.value.id
    let product: Product = this.products.find((p: Product) => {
      if (p.id === id.trim()) {
        return p
      }
    })

    let orderIten: OrderIten = new OrderIten()
    orderIten.product = product
    orderIten.quantity = this.formInsertProduct.value.qntd
    this.orderValue += (product.unitaryValue * orderIten.quantity)
    this.formInsertProduct.reset()
    this.orderService.addProductToOrder(orderIten)

    this.enableModalButton = false

  }
  public insertOrder() {
    this.message = 'Aguarde a operação...'

    this.loadingPage = true
    if (this.orderItens.length > 0) {

      this.orderService.insertOrder(
        this.formNameClient.value.nameClient,
        this.formNameClient.value.comments
      )
        .subscribe(
          () => {
            this.orderService.resetOrderItems()
            this.loadingPage = false
            this.message = 'Pedido Realizado com sucesso !'
            this.orderItens = this.orderService.getOrderItems()
            this.orderValue = this.orderService.getOrderValue()
            this.formNameClient.reset()

          }),
        (erro) => {
          console.log(erro)
          this.message = 'Erro na solicitação do Pedido'
          this.loadingPage = false

        }

    } else {
      alert('Lista de Itens Vazia. Impossível prosseguir com o Pedido !!!')
    }

  }
  public clearMessage() {
    this.message = ''
  }

  public findDeleteItem(id: string) {
    this.orderItens.forEach((item) => {
      if (item.id === id) {
        this.deleteItem = item
      }
    })

  }

  public deleteIten() {
    this.orderItens = this.orderService.deleteItem(this.deleteItem, this.orderValue)
    this.orderValue = this.orderService.getOrderValue()
    this.deleteItem = null
  }

  public tips() {
    this.panelTips = !this.panelTips
  }

  public selectProduct(id: string) {
    this.itenEditQuantity = new OrderIten()
    this.itenEditQuantity = this.orderItens.find((i) => {
      return i.id === id
    })
  }

  public editQuantity() {
    let quantity = this.formEditQuantity.value.quantity
    if (quantity === 0) {
      let index = this.orderItens.findIndex((i) => {
        return i.id === this.itenEditQuantity.id
      })
      this.orderItens.splice(index, 1)
    } else {
      this.orderItens.filter((i) => {
        if (i.id === this.itenEditQuantity.id) {
          i.quantity = quantity
        }
      })
    }
  }

  public calculateValueOrder() {
    this.orderValue = 0
    let itensOrder = this.orderService.getOrderItems()
    itensOrder.forEach((i) => {
      this.orderValue += (i.quantity * i.product.unitaryValue)
    })
  }

}
