import { Order } from '../model/pedido'
import { OrderIten } from '../model/ItenPedido'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { URLS } from './urls'

export class PedidoService {
    public order: Order = new Order()
    public iditen: number = 1

    constructor(private http: HttpClient) { }

    public adicionarProdutoAoPedido(orderIten: OrderIten) {
        orderIten.id = this.iditen.toString()
        this.iditen++
        this.order.orderItens.push(orderIten)
    }
    public resetItensPedido() {
        this.order.dateClose = ''
        this.order.status = ''
        this.order.client = ''
        this.order.orderItens = []
        this.order.orderValue = 0
        this.order.comments = ''
    }
    public inserirPedido(nameClient: string, comments: string): Observable<any> {
        this.order.orderItens.forEach((i) => {
            this.order.orderValue = (i.quantity * i.product.unitaryValue)
        })
        this.order.client = nameClient
        this.order.comments = comments
        this.iditen = 1
        let dia = new Date().getDate()
        let mes = new Date().getMonth() + 1
        let ano = new Date().getFullYear()
        let dataAtualizada = dia + '/' + mes + '/' + ano
        this.order.orderDate = dataAtualizada
        this.order.orderMonth = mes.toString()
        
        return this.http.post(`${URLS.order}`, this.order)
    }

    public getItensPedido(): OrderIten[] {
        return this.order.orderItens
    }

    public getValorPedido(): number {
        if (this.order.orderValue === undefined) {
            this.order.orderValue = 0
        }
        return this.order.orderValue
    }

    public excluirItem(itemExcluir: OrderIten, valorPedido: number): OrderIten[] {

        let index = this.order.orderItens.findIndex((item: OrderIten) => {
            return item.id === itemExcluir.id
        })
        let itemRetornado = this.order.orderItens.find((i: OrderIten) => {
            return i.id === itemExcluir.id
        })
        this.order.orderValue = valorPedido - (itemRetornado.quantity * itemRetornado.product.unitaryValue)
        this.order.orderItens.splice(index, 1)

        return this.order.orderItens
    }

    public getPedidos(): Observable<any> {
        return this.http.get(URLS.order)
    }

    public getPedidosAbertos(): Observable<any> {
        return this.http.get(`${URLS.order}/opens`)
    }


    public atualizarStatusPedido(order: Order): Observable<any> {
        let dia = new Date().getDate()
        let mes = new Date().getMonth() + 1
        let ano = new Date().getFullYear()
        let dataAtualizada = dia + '/' + mes + '/' + ano
        order.dateClose = dataAtualizada
        return this.http.put(`${URLS.order}/cancel`, order)
    }

    public finalizarPedido(order: Order): Observable<any> {
        let dia = new Date().getDate()
        let mes = new Date().getMonth() + 1
        let ano = new Date().getFullYear()
        let dataAtualizada = dia + '/' + mes + '/' + ano
        order.dateClose = dataAtualizada
        return this.http.put(`${URLS.order}/checkout`, order)
    }

    public getPedidosMes(mes: string): Observable<number> {
        return this.http.get<number>(`${URLS.order}/month/${mes}`)
    }

}