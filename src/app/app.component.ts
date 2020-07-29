import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Divina Providencia Ateliê';

  public idTokenDivinaProvidencia: any
  constructor(private router: Router) { }
  
  ngOnInit() {
    this.idTokenDivinaProvidencia = localStorage.getItem('idTokenDivinaProvidencia')
    this.router.events.subscribe((url: any) => {
      if (url.url === '/' || url.url === '' && this.idTokenDivinaProvidencia !== null) {
        this.router.navigate(['/dashboard'])
      }
    })
  }
}

