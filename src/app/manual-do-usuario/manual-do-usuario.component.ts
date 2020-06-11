import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manual-do-usuario',
  templateUrl: './manual-do-usuario.component.html',
  styleUrls: ['./manual-do-usuario.component.css']
})
export class ManualDoUsuarioComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  public openLink() {
    window.open('https://divinaprovidencia-dev.firebaseapp.com/')
  }
}
