import { Component, OnInit } from '@angular/core';
import { PedidoService } from 'src/app/services/pedido.service';
import { Order } from 'src/app/model/pedido';
import { Subject, Observable, of } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-listar-todos-pedidos',
  templateUrl: './listar-todos-pedidos.component.html',
  styleUrls: ['./listar-todos-pedidos.component.css']
})
export class ListarTodosPedidosComponent implements OnInit {
  public mensagemCarregamento = ''
  public pedidoVisualizar: Order = null
  public carregamentoPagina: boolean = false
  public pedidos: Order[] = []  
  public subjectPedidosPesquisa: Subject<string> = new Subject
  public observablePedidosPesquisa: Observable<Order[]>
  public pedidosAux: Order[]

  constructor(private pedidoService: PedidoService) {
    this.carregamentoPagina = true
    this.mensagemCarregamento = 'Aguarde... buscando Pedidos'
  }

  ngOnInit() {
    this.pedidoService.getPedidos()
      .subscribe(
        (pedidos) => {
          this.pedidos = pedidos
          this.pedidosAux = pedidos
          if (this.pedidos.length <= 0) {
            this.mensagemCarregamento = 'Nenhum Pedido'
            this.carregamentoPagina = false
          } else {
            this.carregamentoPagina = false
            this.mensagemCarregamento = ''
          }
        },
        (erro) => {
          this.carregamentoPagina = false
        }
      )
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


  public visualizarPedido(id: string) {
    this.pedidoVisualizar = this.pedidos.find((i: Order) => {
      return i.id === id
    })
  }
  public pesquisaNomeCliente(name: string) {
    this.subjectPedidosPesquisa.next(name)
    this.carregamentoPagina = true
  }

}
