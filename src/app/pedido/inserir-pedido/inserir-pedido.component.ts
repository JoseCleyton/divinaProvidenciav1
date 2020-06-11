import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Product } from 'src/app/model/produto';
import { PedidoService } from 'src/app/services/pedido.service';
import { OrderIten } from 'src/app/model/ItenPedido';
import { Router } from '@angular/router';
import { EstoqueService } from 'src/app/services/estoque/estoque.service';

@Component({
  selector: 'app-inserir-pedido',
  templateUrl: './inserir-pedido.component.html',
  styleUrls: ['./inserir-pedido.component.css']
})
export class InserirPedidoComponent implements OnInit {

  public itemExcluir: OrderIten = null;
  public orderItens: OrderIten[] = []
  public orderValue: number = 0
  public carregamentoPagina: boolean = false
  public mensagem: string
  public habilitarBotaoModal = true
  public products: Product[] = []
  public carregamentoProdutos: boolean
  public painelDicas: boolean = true
  public itenEditQuantity: OrderIten

  public formularioInserirProduto: FormGroup = new FormGroup({
    'qtd': new FormControl(null, [Validators.required, Validators.min(1)]),
    'id': new FormControl(null, [Validators.required])
  })
  public formularioNomeCliente: FormGroup = new FormGroup({
    'nomeCliente': new FormControl(null, [Validators.required, Validators.min(3)]),
    'observacoes': new FormControl(null),
    'valorPedido': new FormControl(null)
  })
  public formEditQuantity: FormGroup = new FormGroup({
    'quantity': new FormControl(null, [Validators.required]),
  })
  constructor(private pedidoService: PedidoService, private router: Router, private estoqueService: EstoqueService) { }

  ngOnInit() {
    this.carregamentoProdutos = true
    this.orderItens = this.pedidoService.getItensPedido()
    this.orderValue = this.pedidoService.getValorPedido()
    if (this.orderItens.length > 0) {
      this.habilitarBotaoModal = false
    }
    this.estoqueService.getEstoque().subscribe(
      (products: Product[]) => {
        this.carregamentoProdutos = false;
        this.products = products
      }
    )
  }

  public adicionarProdutoALista() {
    let id: String = this.formularioInserirProduto.value.id
    let product: Product = this.products.find((p: Product) => {
      if (p.id === id.trim()) {
        return p
      }
    })

    let orderIten: OrderIten = new OrderIten()
    orderIten.product = product
    orderIten.quantity = this.formularioInserirProduto.value.qtd
    this.orderValue += (product.unitaryValue * orderIten.quantity)
    this.formularioInserirProduto.reset()
    this.pedidoService.adicionarProdutoAoPedido(orderIten)

    this.habilitarBotaoModal = false

  }
  public insertOrder() {
    this.mensagem = 'Aguarde a operação...'

    this.carregamentoPagina = true
    if (this.orderItens.length > 0) {

      this.pedidoService.inserirPedido(
        this.formularioNomeCliente.value.nomeCliente,
        this.formularioNomeCliente.value.observacoes
      )
        .subscribe(
          () => {
            this.pedidoService.resetItensPedido()
            this.carregamentoPagina = false
            this.mensagem = 'Pedido Realizado com sucesso !'
            this.orderItens = this.pedidoService.getItensPedido()
            this.orderValue = this.pedidoService.getValorPedido()
            this.formularioNomeCliente.reset()

          }),
        (erro) => {
          console.log(erro)
          this.mensagem = 'Erro na solicitação do Pedido'
          this.carregamentoPagina = false

        }

    } else {
      alert('Lista de Itens Vazia. Impossível prosseguir com o Pedido !!!')
    }

  }
  public limparMensagem() {
    this.mensagem = ''
  }

  public procurarItemExcluir(id: string) {
    this.orderItens.forEach((item) => {
      if (item.id === id) {
        this.itemExcluir = item
      }
    })

  }

  public excluirItem() {
    this.orderItens = this.pedidoService.excluirItem(this.itemExcluir, this.orderValue)
    this.orderValue = this.pedidoService.getValorPedido()
    this.itemExcluir = null
  }
  public dicas() {
    this.painelDicas = !this.painelDicas
  }
  public selecionarProduto(id: string) {
    this.itenEditQuantity = new OrderIten()
    this.itenEditQuantity = this.orderItens.find((i) => {
      return i.id === id
    })
    console.log(this.itenEditQuantity)
  }
  public editQuantity() {
    let quantity = this.formEditQuantity.value.quantity
    console.log(this.orderItens)
    if (quantity === 0) {
      let index = this.orderItens.findIndex((i) => {
        return i.id === this.itenEditQuantity.id
      })
      this.orderItens.splice(index, 1)
    } else {
      this.orderItens.filter((i) => {
        if (i.id === this.itenEditQuantity.id) {
          i.quantity = quantity
        }
      })
    }
    console.log(this.orderItens)
  }

  public calculateValueOrder() {
    this.orderValue = 0
    let itensOrder = this.pedidoService.getItensPedido()
    itensOrder.forEach((i) => {
      this.orderValue += (i.quantity * i.product.unitaryValue)
    })
  }

}


