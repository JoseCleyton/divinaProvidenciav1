import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../services/pedido.service';
import { ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { CaixaService } from '../services/caixa/caixa.service';
import { EstoqueService } from '../services/estoque/estoque.service';
import { Product } from '../model/produto';
import { AccountsReceivable } from '../model/accountsReceivable';
import { AccountsReceivableService } from '../services/accountsReceivable/accountsReceivable.service';
import { MovimentacoesCaixaService } from '../services/caixa/movimentacoesCaixa.service'
import { MovimentacoesCaixa } from '../model/movimentacoesCaixa';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],

})
export class HomeComponent implements OnInit {
  public valorJaneiro: number = 0
  public valorFevereiro: number = 0
  public valorMarco: number = 0
  public valorAbril: number = 0
  public valorMaio: number = 0
  public valorJunho: number = 0
  public valorJulho: number = 0
  public valorAgosto: number = 0
  public valorSetembro: number = 0
  public valorOutubro: number = 0
  public valorNovembro: number = 0
  public valorDezembro: number = 0
  public mostrarGrafico: boolean
  public load: boolean
  public valorCaixa = 0
  public pedidosAtivos = 0
  public pedidosTotais = 0
  public produtosTotais = 0

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
  public abrirCard: boolean = false
  public accountFinish: AccountsReceivable
  public mensagem: string

  constructor(private movimentacoesCaixaService: MovimentacoesCaixaService, private accountsReceivableService: AccountsReceivableService, private pedidoService: PedidoService, private caixaService: CaixaService, private estoqueService: EstoqueService) {
  }



  ngOnInit() {
    this.mostrarGrafico = false
    this.load = true

    this.getAccounts()
    this.buscarDadosGrafico()
    this.getValorCaixa()
    this.getPedidosAtivos()
    this.getPedidos()
    this.getProdutos()
  }
  private getProdutos() {
    this.estoqueService.getEstoque().subscribe(
      (products: Product[]) => {
        this.produtosTotais = products.length
      }
    )

  }
  private getPedidosAtivos() {

    this.pedidoService.getPedidosAbertos()
      .subscribe(
        (pedidos: any[]) => {
          this.pedidosAtivos = pedidos.length
        }
      )

  }
  private getPedidos() {
    this.pedidoService.getPedidos()
      .subscribe(
        (pedidos) => { this.pedidosTotais = pedidos.length }
      )
  }
  private getValorCaixa() {
    this.caixaService.getValorCaixa().subscribe(
      (caixa: any) => {
        this.valorCaixa = caixa
      }
    )
  }
  private montarGrafico() {
    this.load = false

    this.lineChartData2 = [
      {
        data: [this.valorJaneiro, this.valorFevereiro, this.valorMarco, this.valorAbril,
        this.valorMaio, this.valorJunho, this.valorJulho, this.valorAgosto, this.valorSetembro
          , this.valorOutubro, this.valorNovembro, this.valorDezembro], label: 'Valores dos Pedidos'
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
        data: [this.valorJaneiro, this.valorFevereiro, this.valorMarco, this.valorAbril,
        this.valorMaio, this.valorJunho, this.valorJulho, this.valorAgosto, this.valorSetembro
          , this.valorOutubro, this.valorNovembro, this.valorDezembro], label: 'Valores dos Pedidos'
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

    this.mostrarGrafico = true
  }

  private buscarDadosGrafico() {
    this.load = true
    this.pedidoService.getPedidosMes('1').subscribe(
      (valueOrderMonth: number) => {
        this.valorJaneiro += valueOrderMonth
      }
    )

    this.pedidoService.getPedidosMes('2').subscribe(
      (valueOrderMonth: number) => {
        this.valorFevereiro += valueOrderMonth
      }
    )
    this.pedidoService.getPedidosMes('3').subscribe(
      (valueOrderMonth: number) => {
        this.valorMarco += valueOrderMonth
      }
    )
    this.pedidoService.getPedidosMes('4').subscribe(
      (valueOrderMonth: number) => {
        this.valorAbril += valueOrderMonth
      }
    )
    this.pedidoService.getPedidosMes('5').subscribe(
      (valueOrderMonth: number) => {
        this.valorMaio += valueOrderMonth
      }
    )
    this.pedidoService.getPedidosMes('6').subscribe(
      (valueOrderMonth: number) => {
        this.valorJunho += valueOrderMonth
      }
    )
    this.pedidoService.getPedidosMes('7').subscribe(
      (valueOrderMonth: number) => {
        this.valorJulho += valueOrderMonth
      }
    )
    this.pedidoService.getPedidosMes('8').subscribe(
      (valueOrderMonth: number) => {
        this.valorAgosto += valueOrderMonth
      }
    )
    this.pedidoService.getPedidosMes('9').subscribe(
      (valueOrderMonth: number) => {
        this.valorSetembro += valueOrderMonth
      }
    )
    this.pedidoService.getPedidosMes('10').subscribe(
      (valueOrderMonth: number) => {
        this.valorOutubro += valueOrderMonth
      }
    )
    this.pedidoService.getPedidosMes('11').subscribe(
      (valueOrderMonth: number) => {
        this.valorNovembro += valueOrderMonth
      }
    )
    this.pedidoService.getPedidosMes('12').subscribe(
      (valueOrderMonth: number) => {
        this.valorDezembro += valueOrderMonth
        this.montarGrafico()
      }
    )
  }
  public fecharCard() {
    this.abrirCard = false
  }

  public receberValor(id: string) {
    this.accountFinish = this.accountsReceivable.find((a: AccountsReceivable) => {
      return a.id === id
    })
  }
  public finalizarContaAReceber() {
    this.mensagem = 'Aguarde a operação...'

    this.accountFinish.paidInstallments = this.accountFinish.paidInstallments + 1

    if (this.accountFinish.numberInstallments == this.accountFinish.paidInstallments) {
      let dia = new Date().getDate()
      let mes = new Date().getMonth() + 1
      let ano = new Date().getFullYear()
      let dataAtualizada = dia + '/' + mes + '/' + ano
      this.accountFinish.dateCheckout = dataAtualizada
      this.accountFinish.checkout = true
      this.accountsReceivableService.checkOut(this.accountFinish).subscribe(
        () => {
          this.mensagem = 'Conta finalizada com sucesso !!!'
          this.getAccounts()
          let valueInstallment = (this.accountFinish.order.orderValue / this.accountFinish.numberInstallments)
          this.caixaService.inserirValorNoCaixa(valueInstallment).subscribe(
            () => {
              this.caixaService.getValorCaixa().subscribe(
                (caixa: any) => {
                  this.valorCaixa = caixa
                  let movimentacao = new MovimentacoesCaixa(this.accountFinish.order.comments, valueInstallment, caixa, 'Inserir')
                  this.movimentacoesCaixaService.movimentarCaixa(movimentacao)
                }
              )
            }
          ),
            (erro) => {
              this.mensagem = erro.error.message
            }
        }
      ),
        (erro) => {
          this.mensagem = erro.error.message
        }

    } else {
      this.accountsReceivableService.payInstallments(this.accountFinish).subscribe(
        () => {
          this.mensagem = 'Parcela paga com sucesso !!!'
          this.getAccounts()
          let valueInstallment = (this.accountFinish.order.orderValue / this.accountFinish.numberInstallments)
          this.caixaService.inserirValorNoCaixa(valueInstallment).subscribe(
            () => {
              this.caixaService.getValorCaixa().subscribe(
                (caixa: any) => {
                  this.valorCaixa = caixa
                  let movimentacao = new MovimentacoesCaixa(this.accountFinish.order.comments, valueInstallment, caixa, 'Inserir')
                  this.movimentacoesCaixaService.movimentarCaixa(movimentacao)
                }
              )
            }
          ),
            (erro) => {
              this.mensagem = erro.error.message
            }
        }
      ),
        (erro) => {
          this.mensagem = erro.error.message
        }
    }

  }
  public limparMensagem() {
    this.mensagem = ''
  }

  public getAccounts() {
    this.accountsReceivableService.getAccounts().subscribe(
      (accountsReceivable: AccountsReceivable[]) => {
        this.accountsReceivable = accountsReceivable;
        this.abrirCard = this.accountsReceivable.length > 0
      }
    )
  }
}