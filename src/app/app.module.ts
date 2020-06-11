import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'

import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { TopoComponent } from './topo/topo.component';
import { RodapeComponent } from './rodape/rodape.component';
import { HomeComponent } from './home/home.component';
import { AutenticacaoLogin } from './services/autenticacao/autenticacaoLogin.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InserirPedidoComponent } from './pedido/inserir-pedido/inserir-pedido.component';
import { PedidoService } from './services/pedido.service';
import { ListarPedidosComponent } from './pedido/listar-pedidos/listar-pedidos.component'
import { AutenticacaoGuardService } from './services/autenticacao/autenticacao.guard.service';
import { ListarTodosPedidosComponent } from './pedido/listar-todos-pedidos/listar-todos-pedidos.component'
import { ChartsModule } from 'ng2-charts';
import { CaixaService } from './services/caixa/caixa.service';
import { MovimentacoesCaixaService } from './services/caixa/movimentacoesCaixa.service';
import { MovimentacoesComponent } from './caixa/movimentacoes/movimentacoes.component';
import { ListarEstoqueComponent } from './estoque/listar-estoque/listar-estoque.component';
import { EstoqueService } from './services/estoque/estoque.service';
import { IdConverterPipe } from './id-converter.pipe';
import { InserirProdutoComponent } from './estoque/listar-estoque/inserir-produto/inserir-produto.component';
import { Interceptor } from './interceptors/interceptor.module.ts'
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
import { PainelDeControleComponent } from './painel-de-controle/painel-de-controle.component';
import { Routes, RouterModule } from '@angular/router';
import { SendEmailForgetPasswordComponent } from './send-email-forget-password/send-email-forget-password.component';
import { ManualDoUsuarioComponent } from './manual-do-usuario/manual-do-usuario.component';

const ROUTES: Routes = [
  { path: 'auth', component: LoginComponent },
  { path: 'auth/sendEmailForgetPassword', component: SendEmailForgetPasswordComponent },  
  { path: 'auth/forgetPassword/:token', component: ForgetPasswordComponent },
  { path: 'painelDeControle', component: PainelDeControleComponent, canActivate: [AutenticacaoGuardService], children: [
      { path: '', component: HomeComponent, canActivate: [AutenticacaoGuardService] },
      { path: 'inserirPedido', component: InserirPedidoComponent, canActivate: [AutenticacaoGuardService] },
      { path: 'listarPedidosAbertos', component: ListarPedidosComponent, canActivate: [AutenticacaoGuardService] },
      { path: 'listarTodosPedidos', component: ListarTodosPedidosComponent, canActivate: [AutenticacaoGuardService] },
      { path: 'movimentacoesDoCaixa', component: MovimentacoesComponent, canActivate: [AutenticacaoGuardService] },
      { path: 'listarEstoque', component: ListarEstoqueComponent, canActivate: [AutenticacaoGuardService] },
      { path: 'inserirProduto', component: InserirProdutoComponent, canActivate: [AutenticacaoGuardService] },
      { path: 'manualDoUsuario', component: ManualDoUsuarioComponent, canActivate: [AutenticacaoGuardService] }
    ]
  },
]

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    RodapeComponent,
    HomeComponent,
    InserirPedidoComponent,
    ListarPedidosComponent,
    ListarTodosPedidosComponent,
    MovimentacoesComponent,
    ListarEstoqueComponent,
    IdConverterPipe,
    InserirProdutoComponent,
    LoginComponent,
    ForgetPasswordComponent,
    PainelDeControleComponent,
    TopoComponent,
    SendEmailForgetPasswordComponent,
    ManualDoUsuarioComponent
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
    AutenticacaoLogin,
    PedidoService,
    AutenticacaoGuardService,
    CaixaService,
    MovimentacoesCaixaService,
    EstoqueService,
    AccountsReceivableService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
