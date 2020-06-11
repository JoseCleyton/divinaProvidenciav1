export class MovimentacoesCaixa {
    public id: string
    public date: string

    constructor(public comments: String, public value: number, public oldValueCashier: number, public reportType: string) { }
}