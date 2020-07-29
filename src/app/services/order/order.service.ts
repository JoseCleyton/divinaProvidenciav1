import { Order } from '../../model/pedido'
import { OrderIten } from '../../model/ItenPedido'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { URLS } from '../urls'

export class OrderService {
    public order: Order = new Order()
    public idItem: number = 1

    constructor(private http: HttpClient) { }

    public addProductToOrder(orderIten: OrderIten) {
        orderIten.id = this.idItem.toString()
        this.idItem++
        this.order.orderItens.push(orderIten)
    }
    public resetOrderItems() {
        this.order.dateClose = ''
        this.order.status = ''
        this.order.client = ''
        this.order.orderItens = []
        this.order.orderValue = 0
        this.order.comments = ''
    }
    public insertOrder(nameClient: string, comments: string): Observable<any> {
        this.order.orderItens.forEach((i) => {
            this.order.orderValue = (i.quantity * i.product.unitaryValue)
        })
        this.order.client = nameClient
        this.order.comments = comments
        this.idItem = 1
        let day = new Date().getDate()
        let month = new Date().getMonth() + 1
        let year = new Date().getFullYear()
        let updatedDate = day + '/' + month + '/' + year
        this.order.orderDate = updatedDate
        this.order.orderMonth = month.toString()
        
        return this.http.post(`${URLS.order}`, this.order)
    }

    public getOrderItems(): OrderIten[] {
        return this.order.orderItens
    }

    public getOrderValue(): number {
        if (this.order.orderValue === undefined) {
            this.order.orderValue = 0
        }
        return this.order.orderValue
    }

    public deleteItem(deleteItem: OrderIten, orderValue: number): OrderIten[] {

        let index = this.order.orderItens.findIndex((item: OrderIten) => {
            return item.id === deleteItem.id
        })
        let itemRetornado = this.order.orderItens.find((i: OrderIten) => {
            return i.id === deleteItem.id
        })
        this.order.orderValue = orderValue - (itemRetornado.quantity * itemRetornado.product.unitaryValue)
        this.order.orderItens.splice(index, 1)

        return this.order.orderItens
    }

    public getOrders(): Observable<any> {
        return this.http.get(URLS.order)
    }

    public getOpenOrders(): Observable<any> {
        return this.http.get(`${URLS.order}/opens`)
    }


    public updateOrderStatus(order: Order): Observable<any> {
        let day = new Date().getDate()
        let month = new Date().getMonth() + 1
        let year = new Date().getFullYear()
        let updatedDate = day + '/' + month + '/' + year
        order.dateClose = updatedDate

        return this.http.put(`${URLS.order}/cancel`, order)
    }

    public checkout(order: Order): Observable<any> {
        let day = new Date().getDate()
        let month = new Date().getMonth() + 1
        let year = new Date().getFullYear()
        let updatedDate = day + '/' + month + '/' + year
        order.dateClose = updatedDate

        return this.http.put(`${URLS.order}/checkout`, order)
    }

    public getOrderMonth(month: string): Observable<number> {
        return this.http.get<number>(`${URLS.order}/month/${month}`)
    }

}