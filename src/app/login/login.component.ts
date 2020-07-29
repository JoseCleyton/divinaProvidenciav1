import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthLoginService } from '../services/auth/authLogin.service';
import { CredentialsDTO } from '../model/credentialsDTO';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loadingPage: boolean = false
  public errorLogin: string

  public formLogin: FormGroup = new FormGroup({
    'login': new FormControl(null, [Validators.email, Validators.required]),
    'password': new FormControl(null, [Validators.required]),
  })
  constructor(private authLoginService: AuthLoginService, private router: Router) { }

  ngOnInit() { }


  public authenticate() {

    this.loadingPage = true

    this.authLoginService.authenticateWithLoginPassword(this.formLogin.value.login,
      this.formLogin.value.password)
      .subscribe(
        (credentialsDTO: CredentialsDTO) => {
          this.authLoginService.insertToken(credentialsDTO.token)
          localStorage.setItem('idTokenDivinaProvidencia', credentialsDTO.token)
          this.router.navigateByUrl('dashboard')
          this.loadingPage = false
        }
        , (erro: any) => {
          this.errorLogin = erro.error.message
          this.loadingPage = false

        })
  }
}
