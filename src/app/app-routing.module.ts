import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/general/login/login.component';
import { DocumentsPendingComponent } from './components/Policia/documents-pending/documents-pending.component';
import { ScannerComponent } from './components/Policia/scanner/scanner.component';
import { ValidateLoginGuard } from './guards/validateLogin/validate-login.guard';
import { ValidateTokenGuard } from './guards/validateToken/validate-token.guard';

const routes: Routes = [
  {path:"",canActivate:[ValidateLoginGuard], component:LoginComponent},
  {path:"policia/inicio",canActivate:[ValidateTokenGuard], component:ScannerComponent},
  {path:"policia/documentsPending",canActivate:[ValidateTokenGuard],  component:DocumentsPendingComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
