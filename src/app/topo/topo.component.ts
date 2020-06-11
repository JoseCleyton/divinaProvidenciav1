import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AutenticacaoLogin } from '../services/autenticacao/autenticacaoLogin.service';

@Component({
  selector: 'app-topo',
  templateUrl: './topo.component.html',
  styleUrls: ['./topo.component.css']
})
export class TopoComponent implements OnInit {
@Output() public eventoLogout : EventEmitter<string> = new EventEmitter<string>()
  constructor(private autenticacaoLogin : AutenticacaoLogin) { }

  ngOnInit() {}

  public logout(){
    this.autenticacaoLogin.logout()
    this.eventoLogout.emit('logout')
  }
}
