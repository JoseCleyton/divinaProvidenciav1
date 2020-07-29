import { Component, OnInit } from '@angular/core';
import { AuthLoginService } from '../services/auth/authLogin.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../model/user';

@Component({
  selector: 'app-send-email-forget-password',
  templateUrl: './send-email-forget-password.component.html',
  styleUrls: ['./send-email-forget-password.component.css']
})
export class SendEmailForgetPasswordComponent implements OnInit {
  public message: string
  public loadingEmail: boolean
  public formSendEmail: FormGroup = new FormGroup({
    'login': new FormControl(null, [Validators.email, Validators.required])
  })

  constructor(private authLoginService: AuthLoginService) { }

  ngOnInit() {
  }

  public recoverPassword() {
    this.loadingEmail = true
    this.message = 'Aguarde, estamos processando sua solicitação...';
    let login = this.formSendEmail.value.login
    let user: User = new User(login, '')

    this.authLoginService.recoverPassword(user).subscribe(
      () => {
        this.message = 'Solicitação recebida! Caso esse e-mail esteja em nossa base de dados, você irá receber as instruções para recuperação da senha...'
        this.loadingEmail = false
      }
      ,
      () => {
        this.message = 'Erro na solicitação. Tente novamente mais tarde!'
        this.loadingEmail = false
      }
    )

  }

  public clearMessage() {
    this.formSendEmail.reset();
    this.message = '';
  }
}
