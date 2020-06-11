import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AutenticacaoLogin } from '../services/autenticacao/autenticacaoLogin.service';
import { CredentialsDTO } from '../model/credentialsDTO';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public carregamentoPagina: boolean = false
  public erroLogin: string

  public formularioLogin: FormGroup = new FormGroup({
    'login': new FormControl(null, [Validators.email, Validators.required]),
    'senha': new FormControl(null, [Validators.required]),
  })
  constructor(private autenticacaoLogin: AutenticacaoLogin, private router: Router) { }

  ngOnInit() { }


  public autenticar() {

    this.carregamentoPagina = true

    this.autenticacaoLogin.autenticarLoginEmailSenha(this.formularioLogin.value.login,
      this.formularioLogin.value.senha)
      .subscribe(
        (credentialsDTO: CredentialsDTO) => {
          this.autenticacaoLogin.insertToken(credentialsDTO.token)
          localStorage.setItem('idTokenDivinaProvidencia', credentialsDTO.token)
          this.router.navigateByUrl('painelDeControle')
          this.carregamentoPagina = false
        }
        , (erro: any) => {
          this.erroLogin = erro.error.message
          this.carregamentoPagina = false

        })
  }
}
