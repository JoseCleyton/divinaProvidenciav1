import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { AutenticacaoLogin } from '../services/autenticacao/autenticacaoLogin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Observable, of } from 'rxjs';
import { switchMap, debounceTime } from 'rxjs/operators';
import { User } from '../model/user';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  public mensagem: string
  public linkValido: boolean = false
  public validandoLink: boolean = true
  public senhasConferem: boolean
  public subjectSenha: Subject<string> = new Subject
  public observableSenha: Observable<boolean> = new Observable
  public user: User
  public carregamento: boolean
  public carregamentoLogin: boolean

  public formularioNovaSenha: FormGroup = new FormGroup({
    'novaSenha': new FormControl(null, [Validators.required, Validators.pattern('[a-zA-Z|0-9]+[a-zA-Z|0-9]+[a-zA-Z|0-9]+[a-zA-Z|0-9]+[a-zA-Z|0-9]+[a-zA-Z|0-9]+')]),
    'confirmarNovaSenha': new FormControl(null, [Validators.required])
  })
  constructor(private autenticacaoService: AutenticacaoLogin, private activetedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {

    this.activetedRoute.params.subscribe((token: any) => {
      this.autenticacaoService.validaLink(token.token).subscribe(
        (user) => {
          this.user = user
          this.validandoLink = false
          this.linkValido = true
        },
        (erro) => {
          this.validandoLink = false;
          this.linkValido = false
          if (erro.status == 400) {
            this.mensagem = 'Link inválido !!! '
          }
        }
      )
    })

    this.observableSenha = this.subjectSenha.pipe(
      debounceTime(1000),
      switchMap((s: string) => {
        if (s.trim() === '') {
          return of<boolean>(false);
        }
        if (s === this.formularioNovaSenha.value.novaSenha) {
          return of<boolean>(true)
        } else {
          this.formularioNovaSenha.get('confirmarNovaSenha').invalid
          return of<boolean>(false)
        }
      })
    )

    this.observableSenha.subscribe(
      (resultado: any) => {
        this.senhasConferem = resultado
      }
    )

  }

  public compararSenha(senha: string) {
    this.subjectSenha.next(senha)

  }
  public atualizarSenha() {
    this.carregamento = true
    this.mensagem = 'Aguarde operação...'
    this.user.password = this.formularioNovaSenha.value.novaSenha
    this.autenticacaoService.atualizarSenha(this.user).subscribe(
      () => {
        this.mensagem = 'Senha atualizada com sucesso... \n Redirecionando para página de Login ...'
        setTimeout(() => {
          this.carregamento= false
          this.autenticacaoService.logout();
        }, 4000)
      },
      (erro) => {
        console.log(erro)
        this.mensagem = 'Erro na solicitação !!!'
        this.carregamento = false;
      }
    )
  }
  public limparMensagem() {
    this.mensagem = ''
    this.formularioNovaSenha.reset()
  }

}
