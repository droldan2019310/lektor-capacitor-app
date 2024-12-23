import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { RestUserService } from 'src/app/services/restUser/rest-user.service';

@Injectable({
  providedIn: 'root'
})
export class ValidateTokenGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let user  = this.restUser.getUser();
      let token = this.restUser.getToken();
      if(user && user.userRole=='2' && token){
        return true;
      }else{
        this.router.navigateByUrl('');
        return false;
      }
  }
  
  constructor(private restUser:RestUserService, private router:Router){}

}
