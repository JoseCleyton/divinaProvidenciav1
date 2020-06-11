import { Component, OnInit } from '@angular/core';
import { AutenticacaoLogin } from '../services/autenticacao/autenticacaoLogin.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-send-email-forget-password',
  templateUrl: './send-email-forget-password.component.html',
  styleUrls: ['./send-email-forget-password.component.css']
})
export class SendEmailForgetPasswordComponent implements OnInit {
  public mensagem: string
  public formularioEnviarEmail: FormGroup = new FormGroup({
    'login': new FormControl(null, [Validators.email, Validators.required])
  })

  constructor(private autenticacaoService: AutenticacaoLogin) { }

  ngOnInit() {
  }

  public recuperarSenha() {
    this.mensagem = 'Solicitação recebida! Caso esse e-mail esteja em nossa base de dados, você irá receber as instruções para recuperação da senha...'
    this.autenticacaoService.recuperarSenha(this.formularioEnviarEmail.value.login)
  }

  public limparMensagem() {
    this.formularioEnviarEmail.reset();
    this.mensagem = '';
  }
}
