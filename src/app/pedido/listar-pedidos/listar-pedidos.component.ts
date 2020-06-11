import { Component, OnInit } from '@angular/core';
import { PedidoService } from 'src/app/services/pedido.service';
import { Order } from 'src/app/model/pedido';
import { CaixaService } from 'src/app/services/caixa/caixa.service';
import { OrderIten } from 'src/app/model/ItenPedido';
import { EstoqueService } from 'src/app/services/estoque/estoque.service';
import { Product } from 'src/app/model/produto';
import { MovimentacoesCaixaService } from 'src/app/services/caixa/movimentacoesCaixa.service';
import { MovimentacoesCaixa } from 'src/app/model/movimentacoesCaixa';
import { Subject, Observable, of } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { AccountsReceivableService } from 'src/app/services/accountsReceivable/accountsReceivable.service';
import { AccountsReceivable } from 'src/app/model/accountsReceivable';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-listar-pedidos',
  templateUrl: './listar-pedidos.component.html',
  styleUrls: ['./listar-pedidos.component.css']
})
export class ListarPedidosComponent implements OnInit {
  public mensagemCarregamento = ''
  public pedidoVisualizar: Order = null
  public pedidoExcluir: Order = null
  public pedidoFinalizar: Order = null
  public carregamentoPagina: boolean = false
  public pedidos: Order[] = []
  public productsMiss: boolean = false
  public productsMissing: Product[] = []
  public mensagem: String
  public stock: Product[] = []
  public subjectPedidosPesquisa: Subject<string> = new Subject
  public observablePedidosPesquisa: Observable<Order[]>
  public pedidosAux: Order[]
  public habilitarBotaoFinalizar: boolean = false;
  public tipoPagamento: string = ''
  public parcelamento: boolean
  public parcelas: number = 0
  public formParcelas: FormGroup

  constructor(private accountsReceivableService: AccountsReceivableService, private movimentacoesService: MovimentacoesCaixaService, private pedidoService: PedidoService, private caixaService: CaixaService, private estoqueService: EstoqueService) {
    this.carregamentoPagina = true
    this.mensagemCarregamento = 'Aguarde... buscando Pedidos'
  }

  ngOnInit() {
    this.formParcelas = new FormGroup({
      'qntdParcelas': new FormControl(null, [Validators.required, Validators.min(1)])
    })
    this.pedidoService.getPedidosAbertos()
      .subscribe(
        (pedidos) => {
          this.pedidos = pedidos
          this.pedidosAux = pedidos
          if (this.pedidos.length <= 0) {
            this.mensagemCarregamento = 'Nenhum Pedido em Aberto'
            this.carregamentoPagina = false
          } else {

            this.carregamentoPagina = false
            this.mensagemCarregamento = ''
          }
        }
      ),
      (erro) => {
        this.carregamentoPagina = false
      }
    this.observablePedidosPesquisa = this.subjectPedidosPesquisa.pipe(
      debounceTime(1000),
      switchMap((name: string) => {
        if (name.trim() === '') {
          this.carregamentoPagina = false
          return of<Order[]>(this.pedidosAux)
        }

        let pedidos: Order[] = []
        this.pedidos.filter((p: Order) => {
          if (p.client.toLocaleLowerCase().match(new RegExp(name.toLowerCase()))) {
            pedidos.push(p)
          }
        })
        this.carregamentoPagina = false;
        return of<Order[]>(pedidos)
      })
    )

    this.observablePedidosPesquisa.subscribe(
      (pedidos: Order[]) => this.pedidos = pedidos
    )

  }

  public selecionarPedidoCancelar(id: string) {
    this.pedidoExcluir = new Order()
    this.pedidoExcluir = this.pedidos.find((p: Order) => {
      if (p.id === id) {
        return p
      }
    })
  }

  public cancelarPedido() {
    this.mensagem = 'Aguarde a operação...'

    this.pedidoExcluir.status = 'cancelado'
    this.pedidoService.atualizarStatusPedido(this.pedidoExcluir).subscribe(
      () => {
        this.mensagem = 'Pedido cancelado com sucesso !'
        this.pedidoService.getPedidosAbertos()
          .subscribe(
            (pedidos: Order[]) => {
              this.pedidos = pedidos
              if (this.pedidos.length <= 0) {
                this.mensagemCarregamento = 'Nenhum Pedido em Aberto'
                this.carregamentoPagina = false
              } else {

                this.carregamentoPagina = false
                this.mensagemCarregamento = ''
              }
            },
            (erro) => {
              this.mensagemCarregamento = 'Lista de Pedidos vazia'
            }
          )
      }
    )

  }

  public selecionarPedidoFinalizar(id: string) {
    this.pedidoFinalizar = new Order()
    this.pedidoFinalizar = this.pedidos.find((i: Order) => {
      return i.id === id
    })
  }

  public finalizarPedido() {
    this.estoqueService.getEstoque().subscribe(
      (products: Product[]) => {
        this.stock = products
        this.stock.filter((p: Product) => {
          this.pedidoFinalizar.orderItens.filter((orderIten: OrderIten) => {
            if (p.id == orderIten.product.id) {
              if (p.quantityInStock < orderIten.quantity) {
                this.productsMissing.push(orderIten.product)
              }
            }
          })
        })
        if (this.productsMissing.length > 0) {
          this.productsMiss = true
          this.mensagem = 'Alguns produtos não estão em estoque!'
          return
        } else {
          this.stock.filter((p: Product) => {
            this.pedidoFinalizar.orderItens.filter((orderIten: OrderIten) => {
              if (p.id == orderIten.product.id) {
                p.quantityInStock -= orderIten.quantity
              }
            })
          })
          this.mensagem = 'Aguarde a operação...'
          this.pedidoFinalizar.status = 'finalizado'
          if (this.tipoPagamento === 'vista') {
            this.pedidoService.finalizarPedido(this.pedidoFinalizar).subscribe(
              () => {
                this.mensagem = 'Pedido finalizado com sucesso. Tipo de Pagamento : à ' + this.tipoPagamento
                this.caixaService.getValorCaixa().subscribe(
                  (valueCashier: any) => {
                    this.movimentacoesService.movimentarCaixa(new MovimentacoesCaixa(
                      this.pedidoFinalizar.comments, this.pedidoFinalizar.orderValue, valueCashier, 'Inserir'))
                    this.estoqueService.atualizarEstoque(this.stock)
                    this.caixaService.inserirValorNoCaixa(this.pedidoFinalizar.orderValue).subscribe(
                      () => {
                        this.pedidoService.getPedidosAbertos().subscribe(
                          (orders: Order[]) => {
                            this.pedidos = orders
                            if (this.pedidos.length <= 0) {
                              this.mensagemCarregamento = 'Nenhum Pedido em Aberto'
                              this.carregamentoPagina = false
                            } else {
                              this.carregamentoPagina = false
                              this.mensagemCarregamento = ''
                            }
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
            this.pedidoService.finalizarPedido(this.pedidoFinalizar).subscribe(
              (order: any) => {
                accountsReceivable.order = order.data
                accountsReceivable.numberInstallments = this.parcelas
                accountsReceivable.paidInstallments = 0
                this.mensagem = 'Pedido finalizado com sucesso. Tipo de Pagamento : à ' + this.tipoPagamento
                this.accountsReceivableService.checkin(accountsReceivable).subscribe(
                  (data) => {
                    this.estoqueService.atualizarEstoque(this.stock).subscribe(
                      () => {
                        this.pedidoService.getPedidosAbertos().subscribe(
                          (orders: Order[]) => {
                            this.pedidos = orders
                            if (this.pedidos.length <= 0) {
                              this.mensagemCarregamento = 'Nenhum Pedido em Aberto'
                              this.carregamentoPagina = false
                            } else {
                              this.carregamentoPagina = false
                              this.mensagemCarregamento = ''
                            }
                          }, (erro) => {
                            this.mensagem = erro.error.message
                          }
                        )
                      }, (erro) => {
                        this.mensagem = erro.error.message
                      }

                    )
                  }

                ), (erro) => {
                  this.mensagem = erro.error.message
                }
              }
            )
          }
        }
      }
    )
  }

  public visualizarPedido(id: string) {
    this.pedidoVisualizar = this.pedidos.find((i: Order) => {
      return i.id === id
    })
  }

  public limparMensagem() {
    this.mensagem = ''
    this.productsMiss = false
    this.habilitarBotaoFinalizar = false;
  }
  public pesquisaNomeCliente(name: string) {
    this.subjectPedidosPesquisa.next(name)
    this.carregamentoPagina = true
  }
  public pagamento(tipo: string) {
    this.tipoPagamento = tipo;
    if (this.tipoPagamento === 'prazo') {
      this.parcelamento = true
      this.habilitarBotaoFinalizar = false;
    } else {
      this.parcelamento = false
      this.habilitarBotaoFinalizar = true;
    }
  }
  public qntdParcelas() {
    this.parcelas = this.formParcelas.value.qntdParcelas
    if (this.parcelas === undefined || this.parcelas === 0 || this.parcelas === null) {
      this.habilitarBotaoFinalizar = false;
    } else {
      this.habilitarBotaoFinalizar = true;
    }
  }
}
