import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment-timezone';
import Swal from 'sweetalert2/dist/sweetalert2.js';  

@Component({
  selector: 'app-exit-code',
  templateUrl: './exit-code.component.html',
  styleUrls: ['./exit-code.component.css']
})
export class ExitCodeComponent implements OnInit {

  
  public clave;
  constructor(  public dialogRef: MatDialogRef<ExitCodeComponent>, public router:Router) { }

  ngOnInit(): void {
  }


  onNoClick(): void {
    this.dialogRef.close();
  }


  validateFields(){
    //this.dialogRef.close()
    let date = moment().format("DD/MM/YYYY");
    let value = "lektorgt"+date;

    if(this.clave== value){
      localStorage.clear();
      this.dialogRef.close();
      
      this.router.navigateByUrl("");
      Swal.fire({  
        icon: 'success',  
        title: 'Has salido de sesión exitosamente', 
        timer: 2000,
        timerProgressBar: true, 
        text: 'Salida de sesión exitosamente'
      });
    }else{
      Swal.fire({  
        icon: 'info',  
        title: 'Algo no esta bien', 
        timer: 2000,
        timerProgressBar: true, 
        text: 'Contraseña incorrecta'
      });
    }
  }

}
