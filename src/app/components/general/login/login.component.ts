import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { RestUserService } from 'src/app/services/restUser/rest-user.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';  

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public user:User;
  constructor(private restUser:RestUserService, private router:Router) { 
    this.user = new User('','','','','','','','','','','');
  }

  ngOnInit(): void {
  }

  login(form){
    this.restUser.login(this.user).subscribe((res:any)=>{
      console.log(JSON.stringify(res))
      if(res.user && res.token){
        form.reset();
        localStorage.setItem("user", JSON.stringify(res.user));
        localStorage.setItem("token", res.token);
        Swal.fire({  
          icon: 'success',  
          title: 'Operación exitosa',  
          text: res.message
        }) 
        this.router.navigateByUrl("policia/inicio")
      }else{
        Swal.fire({  
          icon: 'error',  
          title: 'Error 1',  
          text: res.message
        }) 
      }
    }, error=>{
      console.log(JSON.stringify(error));
      let msg="error general";
      if(error!=undefined){
        if(error.error.userName){
          msg = error.error.userName;
        }else if(error.error.password){
          msg = error.error.password;
        }else{
          msg = error.error.message
        }
      }
      Swal.fire({  
        icon: 'error',  
        title: 'Error 2',  
        text: msg
      }) 
    })
  }

}
