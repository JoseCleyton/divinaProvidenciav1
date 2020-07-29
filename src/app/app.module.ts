import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { HomeComponent } from './home/home.component';
import { AuthLoginService } from './services/auth/authLogin.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OrderService } from './services/order/order.service';
import { ChartsModule } from 'ng2-charts';
import { CashierService } from './services/cashier/cashier.service';
import { MovesCashierService } from './services/cashier/movesCashier.service';
import { StockService } from './services/stock/stock.service';
import { IdConverterPipe } from './id-converter.pipe';
import { Interceptor } from './interceptors/interceptor.module.ts';
import { LoginComponent } from './login/login.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { AccountsReceivableService } from './services/accountsReceivable/accountsReceivable.service';
import { MatCardModule } from '@angular/material/card';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { Routes, RouterModule } from '@angular/router';
import { SendEmailForgetPasswordComponent } from './send-email-forget-password/send-email-forget-password.component';
import { FooterComponent } from './footer/footer.component';
import { InsertOrderComponent } from './order/insert-order/insert-order.component';
import { ListOrderComponent } from './order/insert-order/list-order/list-order.component';
import { ListAllOrderComponent } from './order/insert-order/list-all-order/list-all-order.component';
import { InsertProductComponent } from './stock/insert-product/insert-product.component';
import { ListStokComponent } from './stock/list-stok/list-stok.component';
import { MovesCashierComponent } from './cashier/moves-cashier/moves-cashier.component';
import { TopComponent } from './top/top.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuardService } from './services/auth/auth.guard.service';
import { UserManualComponent } from './user-manual/user-manual.component';

const ROUTES: Routes = [
  { path: 'auth', component: LoginComponent },
  { path: 'auth/sendEmailForgetPassword', component: SendEmailForgetPasswordComponent },  
  { path: 'auth/forgetPassword/:token', component: ForgetPasswordComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService], children: [
      { path: '', component: HomeComponent, canActivate: [AuthGuardService] },
      { path: 'insertOrder', component: InsertOrderComponent, canActivate: [AuthGuardService] },
      { path: 'listOpenOrders', component: ListOrderComponent, canActivate: [AuthGuardService] },
      { path: 'listAllOrders', component: ListAllOrderComponent, canActivate: [AuthGuardService] },
      { path: 'movesCashier', component: MovesCashierComponent, canActivate: [AuthGuardService] },
      { path: 'listStok', component: ListStokComponent, canActivate: [AuthGuardService] },
      { path: 'insertProduct', component: InsertProductComponent, canActivate: [AuthGuardService] },
      { path: 'userManual', component: UserManualComponent, canActivate: [AuthGuardService] }
    ]
  },
]

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HomeComponent,
    InsertOrderComponent,
    ListOrderComponent,
    ListAllOrderComponent,
    IdConverterPipe,
    LoginComponent,
    ForgetPasswordComponent,
    SendEmailForgetPasswordComponent,
    FooterComponent,
    InsertProductComponent,
    ListStokComponent,
    MovesCashierComponent,
    TopComponent,
    DashboardComponent,
    UserManualComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES),
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatProgressBarModule,
    ChartsModule,
    MatProgressSpinnerModule,
    Interceptor,
    MatExpansionModule,
    MatInputModule,
    MatTooltipModule,
    MatIconModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    NgxPaginationModule,
    MatPaginatorModule
  ],
  providers: [
    AuthLoginService,
    OrderService,
    AuthGuardService,
    CashierService,
    MovesCashierService,
    StockService,
    AccountsReceivableService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
