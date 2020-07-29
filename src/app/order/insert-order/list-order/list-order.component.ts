import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/model/pedido';
import { Product } from 'src/app/model/produto';
import { Subject, Observable, of } from 'rxjs';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AccountsReceivableService } from 'src/app/services/accountsReceivable/accountsReceivable.service';
import { MovesCashierService } from 'src/app/services/cashier/movesCashier.service';
import { OrderService } from 'src/app/services/order/order.service';
import { CashierService } from 'src/app/services/cashier/cashier.service';
import { StockService } from 'src/app/services/stock/stock.service';
import { switchMap, debounceTime } from 'rxjs/operators';
import { OrderIten } from 'src/app/model/ItenPedido';
import { MovimentacoesCaixa } from 'src/app/model/movimentacoesCaixa';
import { AccountsReceivable } from 'src/app/model/accountsReceivable';

@Component({
  selector: 'app-list-order',
  templateUrl: './list-order.component.html',
  styleUrls: ['./list-order.component.css']
})
export class ListOrderComponent implements OnInit {
  public loadingMessage = ''
  public orderView: Order = null
  public orderCancel: Order = null
  public orderCheckout: Order = null
  public loadingPage: boolean = false
  public orders: Order[] = []
  public productsMiss: boolean = false
  public productsMissing: Product[] = []
  public message: String
  public stock: Product[] = []
  public subjectOrdersSearch: Subject<string> = new Subject
  public observableOrdersSearch: Observable<Order[]>
  public orderAux: Order[]
  public enableButtonFinish: boolean = false;
  public paymentType: string = ''
  public installment: boolean
  public plots: number = 0
  public installmentsForm: FormGroup

  constructor(private accountsReceivableService: AccountsReceivableService,
    private movesService: MovesCashierService, private orderService: OrderService, private cashierService: CashierService, private stokService: StockService) {
    this.loadingPage = true
    this.loadingMessage = 'Aguarde... buscando Pedidos'
  }

  ngOnInit() {

    this.installmentsForm = new FormGroup({
      'quantityParcel': new FormControl(null, [Validators.required, Validators.min(1)])
    })

    this.orderService.getOpenOrders()
      .subscribe(
        (orders) => {
          this.orders = orders
          this.orderAux = orders
          if (this.orders.length <= 0) {
            this.loadingMessage = 'Nenhum Pedido em Aberto'
            this.loadingPage = false
          } else {

            this.loadingPage = false
            this.loadingMessage = ''
          }
        }
      ),
      () => {
        this.loadingPage = false
      }

    this.observableOrdersSearch = this.subjectOrdersSearch.pipe(
      debounceTime(1000),
      switchMap((name: string) => {
        if (name.trim() === '') {
          this.loadingPage = false
          return of<Order[]>(this.orderAux)
        }

        let orders: Order[] = []
        this.orders.filter((p: Order) => {
          if (p.client.toLowerCase().match(new RegExp(name.toLowerCase()))) {
            orders.push(p)
          }
        })
        this.loadingPage = false;
        return of<Order[]>(orders)
      })
    )

    this.observableOrdersSearch.subscribe(
      (orders: Order[]) => this.orders = orders
    )

  }

  public selectOrderCancel(id: string) {
    this.orderCancel = new Order()
    this.orderCancel = this.orders.find((p: Order) => {
      if (p.id === id) {
        return p
      }
    })
  }

  public cancelOrder() {
    this.message = 'Aguarde a operação...'

    this.orderCancel.status = 'cancelado'
    this.orderService.updateOrderStatus(this.orderCancel).subscribe(
      () => {
        this.message = 'Pedido cancelado com sucesso !'
        this.orderService.getOpenOrders()
          .subscribe(
            (orders: Order[]) => {
              this.orders = orders
              if (this.orders.length <= 0) {
                this.loadingMessage = 'Nenhum Pedido em Aberto'
                this.loadingPage = false
              } else {

                this.loadingPage = false
                this.loadingMessage = ''
              }
            },
            (erro) => {
              this.loadingMessage = 'Lista de Pedidos vazia'
            }
          )
      }
    )

  }

  public selectOrderCheckout(id: string) {
    this.orderCheckout = new Order()
    this.orderCheckout = this.orders.find((i: Order) => {
      return i.id === id
    })
  }

  public checkout() {
    this.stokService.getStock().subscribe(
      (products: Product[]) => {
        this.stock = products
        this.stock.filter((p: Product) => {
          this.orderCheckout.orderItens.filter((orderIten: OrderIten) => {
            if (p.id == orderIten.product.id) {
              if (p.quantityInStock < orderIten.quantity) {
                this.productsMissing.push(orderIten.product)
              }
            }
          })
        })
        if (this.productsMissing.length > 0) {
          this.productsMiss = true
          this.message = 'Alguns produtos não estão em estoque!'
          return;
        } else {
          this.stock.filter((p: Product) => {
            this.orderCheckout.orderItens.filter((orderIten: OrderIten) => {
              if (p.id == orderIten.product.id) {
                p.quantityInStock -= orderIten.quantity
              }
            })
          })
          this.message = 'Aguarde a operação...'
          this.orderCheckout.status = 'finalizado'
          if (this.paymentType === 'inCash') {
            this.orderService.checkout(this.orderCheckout).subscribe(
              () => {
                this.message = 'Pedido finalizado com sucesso. Tipo de Pagamento : à vista'
                this.cashierService.getCashValue().subscribe(
                  (valueCashier: any) => {
                    this.movesService.movesCashier(new MovimentacoesCaixa(
                      this.orderCheckout.comments, this.orderCheckout.orderValue, valueCashier, 'Inserir')).subscribe(
                        () => {
                          this.stokService.updateStock(this.stock).subscribe(
                            () => {
                              this.cashierService.insertvalueInCash(this.orderCheckout.orderValue).subscribe(
                                () => {
                                  this.orderService.getOpenOrders().subscribe(
                                    (orders: Order[]) => {
                                      this.orders = orders
                                      if (this.orders.length <= 0) {
                                        this.loadingMessage = 'Nenhum Pedido em Aberto'
                                        this.loadingPage = false
                                      } else {
                                        this.loadingPage = false
                                        this.loadingMessage = ''
                                      }
                                    }
                                  )
                                }
                              )
                            }
                          )

                        }
                      )
                  }
                )
              }

            )
          } else {
            let accountsReceivable: AccountsReceivable = new AccountsReceivable()
            accountsReceivable.checkout = false;
            this.orderService.checkout(this.orderCheckout).subscribe(
              (order: any) => {
                accountsReceivable.order = order.data
                accountsReceivable.numberInstallments = this.plots
                accountsReceivable.paidInstallments = 0
                this.message = 'Pedido finalizado com sucesso. Tipo de Pagamento : à prazo '
                this.accountsReceivableService.checkin(accountsReceivable).subscribe(
                  () => {
                    this.stokService.updateStock(this.stock).subscribe(
                      () => {
                        this.orderService.getOpenOrders().subscribe(
                          (orders: Order[]) => {
                            this.orders = orders
                            if (this.orders.length <= 0) {
                              this.loadingMessage = 'Nenhum Pedido em Aberto'
                              this.loadingPage = false
                            } else {
                              this.loadingPage = false
                              this.loadingMessage = ''
                            }
                          }, (erro) => {
                            this.message = erro.error.message
                          }
                        )
                      }, (erro) => {
                        this.message = erro.error.message
                      }

                    )
                  }

                ), (erro) => {
                  this.message = erro.error.message
                }
              }
            )
          }
        }
      }
    )
  }

  public viewOrder(id: string) {
    this.orderView = this.orders.find((i: Order) => {
      return i.id === id
    })
  }

  public clearMessage() {
    this.message = ''
    this.productsMiss = false
    this.enableButtonFinish = false;
    this.productsMissing = []
  }
  public customerNameSearch(name: string) {
    this.subjectOrdersSearch.next(name)
    this.loadingPage = true
  }
  public typePayment(tipo: string) {
    this.paymentType = tipo;
    if (this.paymentType === 'split') {
      this.installment = true
      this.enableButtonFinish = false;
    } else {
      this.installment = false
      this.enableButtonFinish = true;
    }
  }
  public quantityParcel() {
    this.plots = this.installmentsForm.value.quantityParcel
    if (this.plots === undefined || this.plots === 0 || this.plots === null) {
      this.enableButtonFinish = false;
    } else {
      this.enableButtonFinish = true;
    }
  }
}
