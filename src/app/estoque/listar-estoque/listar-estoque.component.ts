import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EstoqueService } from 'src/app/services/estoque/estoque.service';
import { Product } from 'src/app/model/produto';
import { Observable, Subject, of } from 'rxjs';
import { catchError, switchMap, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-listar-estoque',
  templateUrl: './listar-estoque.component.html',
  styleUrls: ['./listar-estoque.component.css']
})
export class ListarEstoqueComponent implements OnInit {
  public carregamentoPagina: boolean = false
  public mensagemCarregamento: string
  public mensagem: string
  public produto: Product
  public products: Product[]
  public productsAux: Product[]
  public subjectPesquisaNomeProduto: Subject<string> = new Subject
  public observablePesquisaNomeProduto: Observable<Product[]>
  public produtoVisualizar: Product
  public habilitarBotaoAtualizar: boolean = false

  public formularioAtualizarProduto: FormGroup = new FormGroup({
    'valorUnitario': new FormControl(null, [Validators.required, Validators.min(1)]),
    'nomeProduto': new FormControl(null, [Validators.required, Validators.min(2)]),
    'quantidade': new FormControl(null, [Validators.required, Validators.min(1)])
  })
  constructor(private estoqueService: EstoqueService) {
    this.mensagemCarregamento = 'Aguarde... Buscando todos os Produtos'
    this.carregamentoPagina = true
    this.products = []
  }

  ngOnInit() {
    this.estoqueService.getEstoque()
      .subscribe(
        (products: Product[]) => {
          this.products = products
          this.productsAux = products
          if (this.products.length <= 0) {
            this.mensagemCarregamento = 'Estoque vazio'
          }
          this.carregamentoPagina = false
          this.mensagemCarregamento = ''
        },
        (erro) => {
          this.carregamentoPagina = false
          console.log(erro)
          this.mensagemCarregamento = 'Erro na solicitação'
        })

    this.observablePesquisaNomeProduto = this.subjectPesquisaNomeProduto.pipe(
      debounceTime(1000),
      switchMap((name: string) => {
        if (name.trim() === '') {
          this.carregamentoPagina = false
          return of<Product[]>(this.productsAux)
        }
        let products: Product[] = [];
        this.products.filter((p: Product) => {
          if (p.name.toLocaleLowerCase().match(new RegExp(name.toLowerCase()))) {
            products.push(p);
          }
        })
        this.carregamentoPagina = false
        return of<Product[]>(products)

      })
    )
    this.observablePesquisaNomeProduto.subscribe(
      (products: Product[]) => this.products = products
    )
  }

  public limparMensagem() {
    this.mensagem = ''
  }

  public visualizarProduto(idProduto: String) {
    this.produtoVisualizar = this.products.find((produto) => {
      return produto.id === idProduto
    })
    this.formularioAtualizarProduto.get('nomeProduto').setValue(this.produtoVisualizar.name)
    this.formularioAtualizarProduto.get('valorUnitario').setValue(this.produtoVisualizar.unitaryValue)
    this.formularioAtualizarProduto.get('quantidade').setValue(this.produtoVisualizar.quantityInStock)
  }

  public pesquisaNomeProduto(nomeProduto: string) {
    this.subjectPesquisaNomeProduto.next(nomeProduto)
    this.carregamentoPagina = true
  }

  public atualizarProduto() {
    this.carregamentoPagina = true
    this.produtoVisualizar.name = this.formularioAtualizarProduto.value.nomeProduto
    this.produtoVisualizar.unitaryValue = this.formularioAtualizarProduto.value.valorUnitario
    this.produtoVisualizar.quantityInStock = this.formularioAtualizarProduto.value.quantidade

    this.estoqueService.atualizarProduto(this.produtoVisualizar).subscribe(
      (data) => {
        this.estoqueService.getEstoque().subscribe((products: Product[]) => { this.products = products; this.productsAux = this.products })
        this.carregamentoPagina = false
        this.mensagem = 'Produto atualizado com sucesso !!!'
        console.log(data)
      },
      (erro) => {
        this.carregamentoPagina = false
        this.mensagem = erro.error.message
      }
    )

  }

}
