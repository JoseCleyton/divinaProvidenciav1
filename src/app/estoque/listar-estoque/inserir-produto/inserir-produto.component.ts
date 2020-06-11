import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Product } from 'src/app/model/produto';
import { EstoqueService } from 'src/app/services/estoque/estoque.service';

@Component({
  selector: 'app-inserir-produto',
  templateUrl: './inserir-produto.component.html',
  styleUrls: ['./inserir-produto.component.css']
})
export class InserirProdutoComponent implements OnInit {
  public formularioInserirProduto: FormGroup
  public product: Product
  public mensagem: String
  public carregamento: boolean
  public painelDicas: boolean = true

  constructor(private estoqueService: EstoqueService) { }

  ngOnInit() {
    this.formularioInserirProduto = new FormGroup({
      'valorUnitario': new FormControl(null, [Validators.required, Validators.min(1)]),
      'nomeProduto': new FormControl(null, [Validators.required, Validators.min(2)]),
      'quantidade': new FormControl(null, [Validators.required, Validators.min(1)])
    })
  }

  public inserirProduto() {
    this.product = new Product(
      this.formularioInserirProduto.value.nomeProduto,
      this.formularioInserirProduto.value.valorUnitario
    )

    this.product.quantityInStock = this.formularioInserirProduto.value.quantidade
  }

  public inserirProdutoEstoque() {
    this.mensagem = 'Aguarde operação...'
    this.carregamento = true;
    this.estoqueService.inserirNoEstoque(this.product)
      .subscribe(() => {
        this.carregamento = false;
        this.mensagem = 'Produto cadastrado com sucesso !'
        this.formularioInserirProduto.reset();
      }, () => {
        this.mensagem = "Erro na solicitação"
      })
  }
  public limparMensagem() {
    this.mensagem = ''
  }
  public dicas() {
    this.painelDicas = !this.painelDicas
  }
}
