import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel } from '@angular/router';
import * as firebase from 'firebase'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Divina Providencia Ateliê';

  public idTokenDivinaProvidencia: any
  public carregamentoPagina: boolean
  constructor(private router: Router) {

    this.idTokenDivinaProvidencia = localStorage.getItem('idTokenDivinaProvidencia')

  }

  ngOnInit() {
    this.router.events.subscribe((url: any) => {
      if (url.url === '/' || url.url === '' && this.idTokenDivinaProvidencia !== null) {
        this.router.navigate(['/painelDeControle'])
      }
    })
  }

  public login(event) {
    if (event === 'logado') {
      this.idTokenDivinaProvidencia = localStorage.getItem('idTokenDivinaProvidencia')
      this.router.navigate(['/home'])
    }
  }

  public logout(event) {
    if (event === 'logout') {
      this.idTokenDivinaProvidencia = null
    }
  }
}

