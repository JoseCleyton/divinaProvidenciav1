import { Order } from './pedido'

export class AccountsReceivable {
    public id: string
    public dateCheckout: string
    public order: Order
    public checkout: boolean
    public numberInstallments: number
    public paidInstallments: number
}