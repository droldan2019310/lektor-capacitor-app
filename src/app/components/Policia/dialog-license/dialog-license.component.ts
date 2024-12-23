import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Geolocation } from '@capacitor/geolocation';
import * as moment from "moment-timezone";
import Swal from 'sweetalert2/dist/sweetalert2.js';  
import { Device } from '@capacitor/device';
import { AndroidSettings, NativeSettings } from 'capacitor-native-settings';
import { App } from '@capacitor/app';
import { RestDocumentService } from 'src/app/services/restDocument/rest-document.service';

export interface DialogData {
  result;
}

@Component({
  selector: 'app-dialog-license',
  templateUrl: './dialog-license.component.html',
  styleUrls: ['./dialog-license.component.css']
})
export class DialogLicenseComponent implements OnInit {

  public year;
  public user:any;



  constructor(
    public dialogRef: MatDialogRef<DialogLicenseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private restDocument:RestDocumentService
  ) { 
    this.user = JSON.parse(localStorage.getItem("user"));
    this.CurrentPosition();
    this.logDeviceInfo();
    let array = this.data.result.value

    console.log(JSON.stringify(this.data.result.value))
    this.data.result.givenNames = array[2]+" "+array[3];
    this.data.result.surname =  array[4]+ " "+array[5];
    this.data.result.nationality = "GTM";
    this.data.result.sex = "";
    this.data.result.typeVisit = "2";
    this.data.result.visitResidential = this.user.userResidential;

    if(moment(array[8], 'DD/MM/YYYY',true).isValid()){
      this.data.result.documentNumber = array[9];
      let years = moment().diff(array[7], 'years');
      this.data.result.age = years;
    }else{
      this.data.result.documentNumber = array[8];
      let years = moment().diff(array[6], 'years');
      this.data.result.age = years;
    }

    this.getVersion();
    
  }




  changeSelect(){
    if(this.data.result.sex == "Male"){
      this.data.result.documentSex =1;
    }else{
      this.data.result.documentSex =2;
    }
  }

  ngOnInit(): void {
  }

  async CurrentPosition  () {
    const  coordinates = await Geolocation.getCurrentPosition();
    this.data.result.latitude =  coordinates.coords.latitude;
    this.data.result.longitude =  coordinates.coords.longitude;
    this.data.result.altitude =  coordinates.coords.altitude;
  };
  

  async getVersion(){
    const info = await App.getInfo();
    this.data.result.version = info.version;
  }

  async  logDeviceInfo() {
    const info = await Device.getId();
    this.data.result.lektorID =  info.uuid;
    console.log(JSON.stringify(info));
  };

  ngAfterViewInit(){
    
    let canvas:any = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    var imagenFront:any = document.getElementById("imagenFront");
    
    var image = new Image();
    image.src = "data:image/png;base64,"+this.data.result.backPicture;
    
  

    imagenFront.src = image.src;
     // When the event "onload" is triggered we can resize the image.
     var imagenPrueba:any = document.getElementById("imagenPrueba");

    imagenFront.onload = function(){    
      ctx.drawImage(image,
        0, 300,   // Start at 70/20 pixels from the left and the top of the image (crop),
        image.width, image.height-300,   // "Get" a `50 * 50` (w * h) area from the source image (crop),
        0, 0,     // Place the result at 0, 0 in the canvas,
        700,800);
        imagenPrueba.src = canvas.toDataURL("image/png");


    }
    
    
    imagenPrueba.onload = function(){    
    }
   this.data.result.countVisit = 1;
    if(this.data.result.sex == "Male"){
      this.data.result.documentSex =1;
    }else{
      this.data.result.documentSex =2;
    }

    
    this.data.result.documentType = 2;

    this.data.result.userId = this.user.userId;

    this.data.result.dateEntry = moment.tz('america/guatemala').format('YYYY-MM-DD');
    this.data.result.timeEntry = moment.tz('america/guatemala').format('HH:mm:ss');
   // this.data.result.expirationDate = moment(this.data.result.expirationDate).format('YYYY-MM-DD');

  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  validateFields(){
    let canvas:any = document.getElementById('canvas');
    this.data.result.backPicture =canvas.toDataURL("image/png");
    this.dialogRef.close(this.data)
  }


  saveExit(){
    this.data.result.uploadMode = 'ONLINE';
    this.data.result.visitResidential=  this.user.userResidential;
    this.data.result.dateExit = moment.tz('america/guatemala').format('YYYY-MM-DD');
    this.data.result.timeExit = moment.tz('america/guatemala').format('HH:mm:ss');
    console.log(JSON.stringify(this.data));
    this.restDocument.saveExit(this.data.result).subscribe((res:any)=>{
        if(res.documentData){
            Swal.fire({  
                icon: 'success',  
                timer: 2000,
                timerProgressBar: true,
                title: 'Operación Exitosa SALIDA REGISTRADA',  
                text: res.message
            }) ;
            this.dialogRef.close();
        }else{
          console.log( JSON.stringify(res));
            Swal.fire({  
                icon: 'info',  
                title: 'Algo no está bien...', 
                timer: 2000,
                timerProgressBar: true, 
                text: 'contacta a soporte para informar de este problema'
            })  ;
            this.dialogRef.close();

        }
    }, error=>{
       console.log(JSON.stringify(error));
        Swal.fire({  
            icon: 'info',  
            title: 'Algo no está bien, comunicate a soporte...', 
            timer: 2000,
            timerProgressBar: true, 
            text: 'contacta a soporte para informar de este problema'
        });
        this.dialogRef.close();
        
    })

  }



  saveDocumentExit(){
    this.data.result.uploadMode = 'ONLINE'
    this.restDocument.saveDocument(this.data.result).subscribe((res:any)=>{
        if(res.documentData){
            Swal.fire({  
                icon: 'success',  
                timer: 2000,
                timerProgressBar: true,
                title: 'Operación Exitosa',  
                text: 'el documento se ha subido exitosamente'
            }) ;
            this.dialogRef.close();
        }else{
            Swal.fire({  
                icon: 'info',  
                title: 'Algo no está bien...', 
                timer: 2000,
                timerProgressBar: true, 
                text: 'Tu documento se subirá en otro momento, cuando tengas tiempo revisa tu conexión a internet.'
            })  
            this.dialogRef.close();

        }
    }, error=>{
        console.log(JSON.stringify(error));
    
        let contador = localStorage.getItem("docsScanned")
        let value;
        if(contador!=undefined){
            value = +contador+1
            localStorage.setItem("docsScanned",JSON.stringify(value))
        }else{
            localStorage.setItem("docsScanned",JSON.stringify(1))
            contador="1"
            value=1
        }
        this.data.result.uploadMode = 'OFFLINE'
        localStorage.setItem("doc"+JSON.stringify(value),JSON.stringify(this.data.result))
        Swal.fire({  
            icon: 'info',  
            title: 'Algo no está bien...', 
            timer: 2000,
            timerProgressBar: true, 
            text: 'Tu documento se subirá en otro momento, cuando tengas tiempo revisa tu conexión a internet.'
        });
        this.dialogRef.close();

    })
  }

}
