import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order/order.service';
import { ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { CashierService } from '../services/cashier/cashier.service';
import { StockService } from '../services/stock/stock.service';
import { Product } from '../model/produto';
import { AccountsReceivable } from '../model/accountsReceivable';
import { AccountsReceivableService } from '../services/accountsReceivable/accountsReceivable.service';
import { MovesCashierService } from '../services/cashier/movesCashier.service'
import { MovimentacoesCaixa } from '../model/movimentacoesCaixa';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],

})
export class HomeComponent implements OnInit {
  public januaryValue: number = 0
  public februaryValue: number = 0
  public marchValue: number = 0
  public aprilValue: number = 0
  public mayValue: number = 0
  public juneValue: number = 0
  public julyValue: number = 0
  public augustValue: number = 0
  public septemberValue: number = 0
  public octoberValue: number = 0
  public novemberValue: number = 0
  public decemberValue: number = 0
  public showGraph: boolean
  public load: boolean
  public valueCashier = 0
  public activeOrders = 0
  public totalOrders = 0
  public totalProducts = 0

  public lineChartData: ChartDataSets[];
  public lineChartLabels: Label[];
  public lineChartColors: Color[];
  public lineChartLegend;
  public lineChartType;

  public lineChartData2: ChartDataSets[];
  public lineChartLabels2: Label[];
  public lineChartColors2: Color[];
  public lineChartLegend2;
  public lineChartType2;

  public lineChartPlugins;
  public accountsReceivable: AccountsReceivable[] = []
  public openCard: boolean = false
  public accountFinish: AccountsReceivable
  public message: string

  constructor(private movesCashierService: MovesCashierService, private accountsReceivableService: AccountsReceivableService,
    private orderService: OrderService, private cashierService: CashierService, private stockService: StockService) {
  }



  ngOnInit() {
    this.showGraph = false
    this.load = true

    this.getAccounts()
    this.getDataGraph()
    this.getValueCashier()
    this.getActiveOrders()
    this.getOrders()
    this.getProducts()
  }
  private getProducts() {
    this.stockService.getStock().subscribe(
      (products: Product[]) => {
        this.totalProducts = products.length
      }
    )

  }
  private getActiveOrders() {

    this.orderService.getOpenOrders()
      .subscribe(
        (orders: any[]) => {
          this.activeOrders = orders.length
        }
      )

  }
  private getOrders() {
    this.orderService.getOrders()
      .subscribe(
        (orders) => { this.totalOrders = orders.length }
      )
  }
  private getValueCashier() {
    this.cashierService.getCashValue().subscribe(
      (cashier: any) => {
        this.valueCashier = cashier
      }
    )
  }
  private assembleGraph() {
    this.load = false

    this.lineChartData2 = [
      {
        data: [this.januaryValue, this.februaryValue, this.marchValue, this.aprilValue,
        this.mayValue, this.juneValue, this.julyValue, this.augustValue, this.septemberValue
          , this.octoberValue, this.novemberValue, this.decemberValue], label: 'Valores dos Pedidos'
      }
    ]

    this.lineChartLabels2 = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
      'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    this.lineChartColors2 = [
      {
        borderColor: 'white',
        backgroundColor: ['rgba(62,87,212)', 'rgb(212, 87, 62)', 'rgb(62, 212, 87)', 'rgb(87, 62, 212)', 'rgb(62, 187, 212)', 'rgb(212, 62, 187)',
          'rgba(197,229,35)', 'rgb(3, 99, 118)', 'rgb(118, 3, 42)', 'rgb(244, 248, 37)', 'rgb(97, 13, 175)', 'rgb(18, 2, 33)']
      },
    ];
    this.lineChartType2 = 'doughnut';
    

    this.lineChartData = [
      {
        data: [this.januaryValue, this.februaryValue, this.marchValue, this.aprilValue,
        this.mayValue, this.juneValue, this.julyValue, this.augustValue, this.septemberValue
          , this.octoberValue, this.novemberValue, this.decemberValue], label: 'Valores dos Pedidos'
      }
    ]
    this.lineChartLabels = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
      'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    this.lineChartColors = [
      {
        borderColor: 'black',
        backgroundColor: 'rgba(255,0,0,0.3)',
      },
    ];

    this.lineChartLegend = 'true';

    this.lineChartType = 'line';
    this.lineChartPlugins = [];

    this.showGraph = true
  }

  private getDataGraph() {
    this.load = true
    this.orderService.getOrderMonth('1').subscribe(
      (valueOrderMonth: number) => {
        this.januaryValue += valueOrderMonth
      }
    )

    this.orderService.getOrderMonth('2').subscribe(
      (valueOrderMonth: number) => {
        this.februaryValue += valueOrderMonth
      }
    )
    this.orderService.getOrderMonth('3').subscribe(
      (valueOrderMonth: number) => {
        this.marchValue += valueOrderMonth
      }
    )
    this.orderService.getOrderMonth('4').subscribe(
      (valueOrderMonth: number) => {
        this.aprilValue += valueOrderMonth
      }
    )
    this.orderService.getOrderMonth('5').subscribe(
      (valueOrderMonth: number) => {
        this.mayValue += valueOrderMonth
      }
    )
    this.orderService.getOrderMonth('6').subscribe(
      (valueOrderMonth: number) => {
        this.juneValue += valueOrderMonth
      }
    )
    this.orderService.getOrderMonth('7').subscribe(
      (valueOrderMonth: number) => {
        this.julyValue += valueOrderMonth
      }
    )
    this.orderService.getOrderMonth('8').subscribe(
      (valueOrderMonth: number) => {
        this.augustValue += valueOrderMonth
      }
    )
    this.orderService.getOrderMonth('9').subscribe(
      (valueOrderMonth: number) => {
        this.septemberValue += valueOrderMonth
      }
    )
    this.orderService.getOrderMonth('10').subscribe(
      (valueOrderMonth: number) => {
        this.octoberValue += valueOrderMonth
      }
    )
    this.orderService.getOrderMonth('11').subscribe(
      (valueOrderMonth: number) => {
        this.novemberValue += valueOrderMonth
      }
    )
    this.orderService.getOrderMonth('12').subscribe(
      (valueOrderMonth: number) => {
        this.decemberValue += valueOrderMonth
        this.assembleGraph()
      }
    )
  }
  public closeCard() {
    this.openCard = false
  }

  public receiveValue(id: string) {
    this.accountFinish = this.accountsReceivable.find((a: AccountsReceivable) => {
      return a.id === id
    })
  }
  public checkoutAccountsReceivable() {
    this.message = 'Aguarde a operação...'

    this.accountFinish.paidInstallments = this.accountFinish.paidInstallments + 1

    if (this.accountFinish.numberInstallments == this.accountFinish.paidInstallments) {
      let day = new Date().getDate()
      let month = new Date().getMonth() + 1
      let year = new Date().getFullYear()
      let updatedDate = day + '/' + month + '/' + year
      this.accountFinish.dateCheckout = updatedDate
      this.accountFinish.checkout = true
      this.accountsReceivableService.checkOut(this.accountFinish).subscribe(
        () => {
          this.message = 'Conta finalizada com sucesso !!!'
          this.getAccounts()
          let valueInstallment = (this.accountFinish.order.orderValue / this.accountFinish.numberInstallments)
          this.cashierService.insertvalueInCash(valueInstallment).subscribe(
            () => {
              this.cashierService.getCashValue().subscribe(
                (cashier: any) => {
                  this.valueCashier = cashier
                  let moves = new MovimentacoesCaixa(this.accountFinish.order.comments, valueInstallment, cashier, 'Inserir')
                  this.movesCashierService.movesCashier(moves)
                }
              )
            }
          ),
            (error) => {
              this.message = error.error.message
            }
        }
      ),
        (error) => {
          this.message = error.error.message
        }

    } else {
      this.accountsReceivableService.payInstallments(this.accountFinish).subscribe(
        () => {
          this.message = 'Parcela paga com sucesso !!!'
          this.getAccounts()
          let valueInstallment = (this.accountFinish.order.orderValue / this.accountFinish.numberInstallments)
          this.cashierService.insertvalueInCash(valueInstallment).subscribe(
            () => {
              this.cashierService.getCashValue().subscribe(
                (cashier: any) => {
                  this.valueCashier = cashier
                  let moves = new MovimentacoesCaixa(this.accountFinish.order.comments, valueInstallment, cashier, 'Inserir')
                  this.movesCashierService.movesCashier(moves)
                }
              )
            }
          ),
            (error) => {
              this.message = error.error.message
            }
        }
      ),
        (error) => {
          this.message = error.error.message
        }
    }

  }
  public clearMessage() {
    this.message = ''
  }

  public getAccounts() {
    this.accountsReceivableService.getAccounts().subscribe(
      (accountsReceivable: AccountsReceivable[]) => {
        this.accountsReceivable = accountsReceivable;
        this.openCard = this.accountsReceivable.length > 0
      }
    )
  }
}