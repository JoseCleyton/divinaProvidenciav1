import { Component, OnInit } from '@angular/core';
import { MovimentacoesCaixaService } from 'src/app/services/caixa/movimentacoesCaixa.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CaixaService } from 'src/app/services/caixa/caixa.service';
import { Order } from 'src/app/model/pedido';

@Component({
  selector: 'app-movimentacoes',
  templateUrl: './movimentacoes.component.html',
  styleUrls: ['./movimentacoes.component.css']
})
export class MovimentacoesComponent implements OnInit {
  public movimentacoesCaixa = []
  public carregamentoPagina: boolean
  public mensagemCarregamento: string
  public mensagem: string
  public valorRetirada: number = 0
  public descricaoRetirada: string = ''
  public painelDicas: boolean = true

  public formularioRetirarValorDoCaixa: FormGroup = new FormGroup({
    'descricaoRetirada': new FormControl(null, [Validators.required, Validators.min(10)]),
    'valorRetirada': new FormControl(null, [Validators.required, Validators.min(1)])
  })

  constructor(private movimentacoesCaixaService: MovimentacoesCaixaService, private caixaService: CaixaService) {
    this.carregamentoPagina = true
    this.mensagemCarregamento = 'Aguarde... buscando Movimentações'
  }

  ngOnInit() {

    this.movimentacoesCaixaService.getMovimentacoes()
      .subscribe((movimentacoes: any[]) => {
        this.movimentacoesCaixa = movimentacoes
        if (this.movimentacoesCaixa.length <= 0) {
          this.mensagemCarregamento = 'Nenhuma Movimentação registrada !!!'
          this.carregamentoPagina = false
        } else {
          this.carregamentoPagina = false
          this.mensagemCarregamento = ''
        }
      },
        (erro) => {
          this.carregamentoPagina = false
        })
  }


  public retirarValorDoCaixa() {
    this.descricaoRetirada = this.formularioRetirarValorDoCaixa.value.descricaoRetirada
    this.valorRetirada = this.formularioRetirarValorDoCaixa.value.valorRetirada

  }


  public efetivarRetirada() {
    this.caixaService.getValorCaixa().subscribe(
      (valueCashier: any) => {
        this.caixaService.retirarValorDoCaixa(this.valorRetirada).subscribe(() => {
          this.movimentacoesCaixaService.movimentarCaixaRetirada(this.descricaoRetirada, this.valorRetirada, valueCashier, 'Retirada')
            .subscribe(() => {
              this.movimentacoesCaixaService.getMovimentacoes()
                .subscribe((movimentacoes: any[]) => {
                  this.movimentacoesCaixa = movimentacoes
                  this.mensagem = 'Valor Retirado do Caixa com Sucesso !!!'
                }),
                (erro) => {
                  console.log(erro)
                  this.mensagem = erro.error
                }
            }),
            (erro) => {
              console.log(erro)
              this.mensagem = erro.error
            }
        }),
          (erro) => {
            console.log(erro)
            this.mensagem = erro.error
          }

      })

  }

  public limparMensagem() {
    this.mensagem = ''
  }
  public dicas() {
    this.painelDicas = !this.painelDicas
  }
}
