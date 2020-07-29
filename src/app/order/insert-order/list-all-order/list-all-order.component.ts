import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/model/pedido';
import { of, Subject, Observable } from 'rxjs';
import { switchMap, debounceTime } from 'rxjs/operators';
import { OrderService } from 'src/app/services/order/order.service';

@Component({
  selector: 'app-list-all-order',
  templateUrl: './list-all-order.component.html',
  styleUrls: ['./list-all-order.component.css']
})
export class ListAllOrderComponent implements OnInit {

  public loadingMessage = ''
  public orderView: Order = null
  public loadingPage: boolean = false
  public orders: Order[] = []  
  public subjectOrdersSearch: Subject<string> = new Subject
  public observableOrdersSearch: Observable<Order[]>
  public ordersAux: Order[]

  constructor(private orderService: OrderService) {
    this.loadingPage = true
    this.loadingMessage = 'Aguarde... buscando Pedidos'
  }

  ngOnInit() {
    this.orderService.getOrders()
      .subscribe(
        (orders) => {
          this.orders = orders
          this.ordersAux = orders
          if (this.orders.length <= 0) {
            this.loadingMessage = 'Nenhum Pedido'
            this.loadingPage = false
          } else {
            this.loadingPage = false
            this.loadingMessage = ''
          }
        },
        (erro) => {
          this.loadingPage = false
        }
      )
      this.observableOrdersSearch = this.subjectOrdersSearch.pipe(
        debounceTime(1000),
        switchMap((name: string) => {
          if (name.trim() === '') {
            this.loadingPage = false
            return of<Order[]>(this.ordersAux)
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


  public selectOrderView(id: string) {
    this.orderView = this.orders.find((i: Order) => {
      return i.id === id
    })
  }
  public customerNameSearch(name: string) {
    this.subjectOrdersSearch.next(name)
    this.loadingPage = true
  }

}
