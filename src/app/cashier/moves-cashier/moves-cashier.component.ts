import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MovesCashierService } from 'src/app/services/cashier/movesCashier.service';
import { CashierService } from 'src/app/services/cashier/cashier.service';

@Component({
  selector: 'app-moves-cashier',
  templateUrl: './moves-cashier.component.html',
  styleUrls: ['./moves-cashier.component.css']
})
export class MovesCashierComponent implements OnInit {
  public movesCashier = []
  public loadingPage: boolean
  public loadingMessage: string
  public message: string
  public withdrawalAmount: number = 0
  public descriptionWithdrawal: string = ''
  public panelTips: boolean = true

  public formWithdrawCashValue: FormGroup = new FormGroup({
    'descriptionWithdrawal': new FormControl(null, [Validators.required, Validators.min(10)]),
    'withdrawalAmount': new FormControl(null, [Validators.required, Validators.min(1)])
  })

  constructor(private movesCashierService: MovesCashierService, private cashierService: CashierService) {
    this.loadingPage = true
    this.loadingMessage = 'Aguarde... buscando Movimentações'
  }

  ngOnInit() {

    this.movesCashierService.getMoves()
      .subscribe((movimentacoes: any[]) => {
        this.movesCashier = movimentacoes
        if (this.movesCashier.length <= 0) {
          this.loadingMessage = 'Nenhuma Movimentação registrada !!!'
          this.loadingPage = false
        } else {
          this.loadingPage = false
          this.loadingMessage = ''
        }
      },
        (error) => {
          this.loadingPage = false
        })
  }


  public withdrawCashAmount() {
    this.descriptionWithdrawal = this.formWithdrawCashValue.value.descriptionWithdrawal
    this.withdrawalAmount = this.formWithdrawCashValue.value.withdrawalAmount

  }


  public effectWithdrawl() {
    this.message = 'Aguarde a operação... '
    this.cashierService.getCashValue().subscribe(
      (valueCashier: any) => {
        this.cashierService.withdrawCashAmount(this.withdrawalAmount).subscribe(() => {
          this.movesCashierService.movesCashierWithdraw(this.descriptionWithdrawal, this.withdrawalAmount, valueCashier, 'Retirada')
            .subscribe(() => {
              this.movesCashierService.getMoves()
                .subscribe((moves: any[]) => {
                  this.movesCashier = moves
                  this.message = 'Valor Retirado do Caixa com Sucesso !!!'
                }),
                (error) => {
                  this.message = error.error
                }
            }),
            (error) => {
              this.message = error.error
            }
        }),
          (error) => {
            this.message = error.error
          }

      })

  }

  public clearMessage() {
    this.message = ''
  }
  public tips() {
    this.panelTips = !this.panelTips
  }
}
