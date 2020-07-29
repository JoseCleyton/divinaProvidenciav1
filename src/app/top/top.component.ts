import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthLoginService } from '../services/auth/authLogin.service';

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.css']
})
export class TopComponent implements OnInit {
  constructor(private authLogin: AuthLoginService) { }

  ngOnInit() { }
  public logout() {
    this.authLogin.logout()
  }

}
