import { OrderIten } from './ItenPedido'

export class Order{
    public id : string
    public orderDate : string
    public status : string
    public dateClose : string
    public client: string
    public orderItens : OrderIten [] = []
    public orderValue : number
    public comments : string
    public orderMonth : string
}