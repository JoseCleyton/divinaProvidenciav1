import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { AuthLoginService } from '../services/auth/authLogin.service';
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
  public message: string
  public validLink: boolean = false
  public validatingLink: boolean = true
  public passwordsMatch: boolean
  public subjectPassword: Subject<string> = new Subject
  public observablePassword: Observable<boolean> = new Observable
  public user: User
  public loading: boolean
  public loadingLogin: boolean

  public formNewPassword: FormGroup = new FormGroup({
    'newPassword': new FormControl(null, [Validators.required, Validators.pattern('[a-zA-Z|0-9]+[a-zA-Z|0-9]+[a-zA-Z|0-9]+[a-zA-Z|0-9]+[a-zA-Z|0-9]+[a-zA-Z|0-9]+')]),
    'confirmNewPassword': new FormControl(null, [Validators.required])
  })
  constructor(private authService: AuthLoginService, private activetedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {

    this.activetedRoute.params.subscribe((token: any) => {
      this.authService.validateLink(token.token).subscribe(
        (user) => {
          this.user = user
          this.validatingLink = false
          this.validLink = true
        },
        (erro) => {
          this.validatingLink = false;
          this.validLink = false
          if (erro.status == 400) {
            this.message = 'Link inválido !!! '
          }
        }
      )
    })

    this.observablePassword = this.subjectPassword.pipe(
      debounceTime(1000),
      switchMap((s: string) => {
        if (s.trim() === '') {
          return of<boolean>(false);
        }
        if (s === this.formNewPassword.value.newPassword) {
          return of<boolean>(true)
        } else {
          this.formNewPassword.get('confirmNewPassword').invalid
          return of<boolean>(false)
        }
      })
    )

    this.observablePassword.subscribe(
      (result: any) => {
        this.passwordsMatch = result
      }
    )

  }

  public comparePassword(password: string) {
    this.subjectPassword.next(password)

  }
  public updatePassword() {
    this.loading = true
    this.message = 'Aguarde operação...'
    this.user.password = this.formNewPassword.value.newPassword
    this.authService.updatePassword(this.user).subscribe(
      () => {
        this.message = 'Senha atualizada com sucesso... \n Redirecionando para página de Login ...'
        setTimeout(() => {
          this.loading= false
          this.authService.logout();
        }, 4000)
      },
      (error) => {
        this.message = 'Erro na solicitação !!!'
        this.loading = false;
      }
    )
  }
  public clearMessage() {
    this.message = ''
    this.formNewPassword.reset()
  }

}
