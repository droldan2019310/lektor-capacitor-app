import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2/dist/sweetalert2.js';  
import { DialogComponent } from '../dialog/dialog.component';
import { interval, Subscription } from 'rxjs';
import { Plugins } from '@capacitor/core';
const { SmartScannerPlugin } = Plugins;
import { DialogLicenseComponent } from '../dialog-license/dialog-license.component';
import { Device } from '@capacitor/device';
import { BarcodeScanner ,BarcodeScannerOptions} from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { Geolocation } from '@capacitor/geolocation';
import { App } from '@capacitor/app';
import { Platform } from '@ionic/angular';
import * as moment from 'moment-timezone';
import { WebcamImage } from 'ngx-webcam';
import { RestDocumentService } from 'src/app/services/restDocument/rest-document.service';

export interface DialogData {
    result;
}
@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.css']
})
export class ScannerComponent implements OnInit, AfterViewInit {
    public documentsFive:any[];
    public documentsFiveExit:any[];
    public documents:any[];
    public user;
    public valueDocs;
    subscription: Subscription;
    public camera = false;
    
    public version;
    public lektorid;
    public latitude;
    public longitude;
    public altitude;
    public  options: BarcodeScannerOptions = {
        preferFrontCamera: false,
        showFlipCameraButton: false,
        showTorchButton: true,
        torchOn: false,
        prompt: 'VOLTEA EL DOCUMENTO',
        resultDisplayDuration: 500,
        formats: 'PDF_417',
        orientation: 'portrait',
        disableAnimations: true, // iOS
        disableSuccessBeep: false, // iOS and Android
    };

    flag = false;
    public showImageFront=false;
    public showImageFrontLicense=false;
    constructor(private platform: Platform, public dialog: MatDialog,private restDocument:RestDocumentService,
        public barcodeCtrl: BarcodeScanner){
        this.getFiveDocument();
        this.getFiveDocumentExit();
        this.user = JSON.parse(localStorage.getItem("user"));
        this.getVersion()
        this.logDeviceInfo();
        this.CurrentPosition(); 
        console.log(this.user.userId)
        console.log(this.user.userResidential)
        if(localStorage.getItem("time")==null){
            localStorage.setItem("time","300000");
            let interval = JSON.parse(localStorage.getItem("time"));
            setInterval(()=> { 
                this.getDocuments() 
            }, interval);
        }else{
            let interval = JSON.parse(localStorage.getItem("time"));
            setInterval(()=> { 
                this.getDocuments() 
            }, interval);

        }


        this.platform.backButton.subscribeWithPriority(10, () => {
            console.log('Handler was called!');
        });

    }
    ngAfterViewInit(){
        Geolocation.requestPermissions();
    }

    ngOnInit(){

    }



 

    getImagefront(event){
        console.log(JSON.stringify(event));
        this.showImageFront=false;
        this.startScanner(event);
        
    }


    getImagefrontLicense(event){
        console.log(JSON.stringify(event));
        this.showImageFrontLicense=false;
        this.startScannerBarCode(event);
        
    }


    async takePicture() {
        this.showImageFront=true;
    }

   async startScanner(backPicture){
        try {
            
            const result = await SmartScannerPlugin.executeScanner({
                action: 'START_SCANNER',
                options: {
                    mode: 'mrz',
                    mrzFormat: 'MRTD_TD1',
                    config: {
                        background: '#3f51b5',
                        branding: false,
                        label: "VOLTEA EL DOCUMENTO...",
                        isManualCapture: false,
                        imageResultType: 'base_64' ,
                    },
                },
            });

            if(result){
                
                if(this.flag){
                    result.scanner_result.backPicture= backPicture;
                    result.scanner_result.visitResidential = this.user.userResidential;
                    const dialogRef = this.dialog.open(DialogComponent, {
                        data: {result: result.scanner_result},
                    });
                    dialogRef.afterClosed().subscribe(result => {
                        if(result != undefined){
                            this.saveDocument(result)
                        }else{
                            this.getFiveDocument();
                        }
                    }); 
                }else{
                    result.scanner_result.backPicture= backPicture;
                    const dialogRef = this.dialog.open(DialogComponent, {
                        data: {result: result.scanner_result},
                    });
                    dialogRef.afterClosed().subscribe(result => {
                        if(result != undefined){
                            this.saveDocument(result)
                        }else{
                            this.getFiveDocument();
                            this.getFiveDocumentExit();
                        }
                    }); 
                }
                
            }else{
                
            }
        }catch(err){
            let user = JSON.parse(localStorage.getItem("user"));
            
                let visit={
                    "typeVisit":"2",
                    "latitude": this.latitude,
                    "longitude": this.longitude,
                    "altitude": this.altitude,
                    "version": this.version ,
                    "lektorID": this.lektorid,
                    "dateEntry": moment.tz('america/guatemala').format('YYYY-MM-DD'),
                    "timeEntry": moment.tz('america/guatemala').format('HH:mm:ss'),
                    "documentType": "1",
                    "userId": user.userId,
                    "uploadMode":"ONLINE",
                    "backPicture":backPicture
                }
                console.log(JSON.stringify(visit))
                this.saveDocumentDefect(visit)
        }
        
    }

    getSettings(){

        this.restDocument.getSetting(this.user.userId).subscribe((res:any)=>{
            
            console.log(JSON.stringify(res.supervisor))
            if(res.supervisor){
                console.log("flag en true")
                this.flag = true;
            }else{
                console.log("flag en false")
                this.flag = false
            }
        }, error=>{
            this.flag = false;
            console.log(JSON.stringify(error))
        })

    }

    async takePictureLicense() {
        this.showImageFrontLicense=true;
    }

    
    async startScannerBarCode(backPicture){
        let result={
            "value":"",
            "backPicture":""
        };
        let value: any;
       
        result.backPicture = backPicture;

        this.barcodeCtrl.scan(this.options).then((barcodeData) => {
            value = barcodeData.text;
            if(value){

                if(this.flag){
                    result.value = value.split("|");
            
                    const dialogRef = this.dialog.open(DialogLicenseComponent, {
                        data: {result: result},
                    });
            
                    dialogRef.afterClosed().subscribe(result1 => {
                        if(result1 != undefined){
                            console.log("result1")
                            console.log(result1);
                            this.saveDocument(result1)
                        }else{
                            this.getFiveDocument();
                        }
                    });

                }else{
                    result.value = value.split("|");
            
                    const dialogRef = this.dialog.open(DialogLicenseComponent, {
                        data: {result: result},
                    });
            
                    dialogRef.afterClosed().subscribe(result1 => {
                        if(result1 != undefined){
                            console.log("result1")
                            console.log(result1);
                            this.saveDocument(result1)
                        }else{
                            this.getFiveDocument();
                            this.getFiveDocumentExit();
                        }
                    });
                }
            }else{
                console.log("nulo")
                let user = JSON.parse(localStorage.getItem("user"));
              
                let visit={
                    "typeVisit":"2",
                    "latitude": this.latitude,
                    "longitude": this.longitude,
                    "altitude": this.altitude,
                    "version": this.version ,
                    "lektorID": this.lektorid,
                    "dateEntry": moment.tz('america/guatemala').format('YYYY-MM-DD'),
                    "timeEntry": moment.tz('america/guatemala').format('HH:mm:ss'),
                    "documentType": "2",
                    "userId": user.userId,
                    "uploadMode":"ONLINE",
                    "backPicture":backPicture
                }
                console.log(JSON.stringify(visit))
                this.saveDocumentDefect(visit)
            }
            
          }).catch((err) => {
            console.log('Error', err);
        });
        
        
    }

    
    async getVersion(){
        const info = await App.getInfo();
        this.version = info.version
    }

    
    async CurrentPosition  () {
        const  coordinates = await Geolocation.getCurrentPosition();
        
        this.longitude = coordinates.coords.longitude
        this.latitude = coordinates.coords.latitude
        this.altitude = coordinates.coords.altitude
    };
  

    setDocuments(result){
        const dialogRef = this.dialog.open(DialogComponent, {
            width: '100%',
            data: {result:result[0]}
            });
      
          dialogRef.afterClosed().subscribe(result => {
              if(result!=undefined){
                  this.saveDocument(result)
              }else{
              
              }
          });
    }


    getDocuments(){
        this.documents = [];
        let count = localStorage.getItem("docsScanned");
        this.valueDocs = count
        let val = +count
        for(let value=1; value<=val;value++){
          this.documents.push(JSON.parse(localStorage.getItem("doc"+value)))
        }
        this.uploadDocument();

    }

    async  logDeviceInfo() {
        const info = await Device.getId();
        this.lektorid = info.uuid
    };
    async getFiveDocument(){
       const info =  await Device.getId();
        let id =info.uuid;
        this.restDocument.getFiveDocument(id).subscribe((res:any)=>{
            if(res.documentData){
                this.documentsFive = res.documentData;
            }else{
                Swal.fire({  
                    icon: 'error',  
                    title: 'Error',  
                    text: res.message
                }) 
            }
        }, error=>{
            
        })
    }


    async getFiveDocumentExit(){
        const info =  await Device.getId();
         let id =info.uuid;
         this.restDocument.getFiveDocumentExit(id).subscribe((res:any)=>{
             if(res.documentData){
                 this.documentsFiveExit = res.documentData;
             }else{
                 Swal.fire({  
                     icon: 'error',  
                     title: 'Error',  
                     text: res.message
                 }) 
             }
         }, error=>{
             
         })
    }

    saveDocumentDefect(result){
        result.uploadMode = 'ONLINE'
        this.restDocument.saveDocument(result).subscribe((res:any)=>{
            if(res.documentData){
                Swal.fire({  
                    icon: 'success',  
                    timer: 2000,
                    timerProgressBar: true,
                    title: 'Operación Exitosa',  
                    text: 'el documento se ha subido exitosamente'
                }) ;
                this.getFiveDocument();
            }else{
                Swal.fire({  
                    icon: 'info',  
                    title: 'Algo no está bien...', 
                    timer: 2000,
                    timerProgressBar: true, 
                    text: 'Tu documento se subirá en otro momento, cuando tengas tiempo revisa tu conexión a internet.'
                })  
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
            result.uploadMode = 'OFFLINE'
            localStorage.setItem("doc"+JSON.stringify(value),JSON.stringify(result))
            Swal.fire({  
                icon: 'info',  
                title: 'Algo no está bien...', 
                timer: 2000,
                timerProgressBar: true, 
                text: 'Tu documento se subirá en otro momento, cuando tengas tiempo revisa tu conexión a internet.'
            });
            console.log(JSON.stringify(error));
            
        })
    }


    exitorentry(result){
        console.log("exit or entry")
        result.result.uploadMode = 'ONLINE'
        this.restDocument.setExitorEntry(result.result).subscribe((res:any)=>{
            if(res.documentData){
                Swal.fire({  
                    icon: 'success',  
                    timer: 2000,
                    timerProgressBar: true,
                    title: 'Operación Exitosa',  
                    text: res.message
                }) ;
                this.getFiveDocument();
            }else{
                Swal.fire({  
                    icon: 'info',  
                    title: 'Algo no está bien...', 
                    timer: 2000,
                    timerProgressBar: true, 
                    text: 'Tu documento se subirá en otro momento, cuando tengas tiempo revisa tu conexión a internet.'
                })  
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
            result.result.uploadMode = 'OFFLINE'
            localStorage.setItem("doc"+JSON.stringify(value),JSON.stringify(result.result))
            Swal.fire({  
                icon: 'info',  
                title: 'Algo no está bien...', 
                timer: 2000,
                timerProgressBar: true, 
                text: 'Tu documento se subirá en otro momento, cuando tengas tiempo revisa tu conexión a internet.'
            });
            console.log(JSON.stringify(error));
        })

        this.flag = false
    }

    saveDocument(result){
        console.log(JSON.stringify(result));
        result.result.uploadMode = 'ONLINE'
        this.restDocument.saveDocument(result.result).subscribe((res:any)=>{
            if(res.documentData){
                Swal.fire({  
                    icon: 'success',  
                    timer: 2000,
                    timerProgressBar: true,
                    title: 'Operación Exitosa',  
                    text: 'el documento se ha subido exitosamente'
                }) ;
                this.getFiveDocument();
            }else{
                Swal.fire({  
                    icon: 'info',  
                    title: 'Algo no está bien...', 
                    timer: 2000,
                    timerProgressBar: true, 
                    text: 'Tu documento se subirá en otro momento, cuando tengas tiempo revisa tu conexión a internet.'
                })  
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
            result.result.uploadMode = 'OFFLINE'
            localStorage.setItem("doc"+JSON.stringify(value),JSON.stringify(result.result))
            Swal.fire({  
                icon: 'info',  
                title: 'Algo no está bien...', 
                timer: 2000,
                timerProgressBar: true, 
                text: 'Tu documento se subirá en otro momento, cuando tengas tiempo revisa tu conexión a internet.'
            });
            console.log(JSON.stringify(error));
            
        })
    }



    uploadDocument(){
        for(let document of this.documents){
          document.userId = this.user.userId;
          this.saveDocumentPending(document)
        }
    }
      
    
    saveDocumentPending(result){
        this.restDocument.saveDocument(result).subscribe((res:any)=>{
            if(res.documentData){
              let count = localStorage.getItem("docsScanned");
              let val = +count-1;
              localStorage.setItem("docsScanned",JSON.stringify(val))
              let index = this.documents.indexOf(result, 0);
              index=index+1
              localStorage.removeItem("doc"+index)
              
              this.getDocuments();
            }else{
                Swal.fire({  
                    icon: 'info',  
                    title: 'Algo no está bien...', 
                    timer: 2000,
                    timerProgressBar: true, 
                    text: 'Tu documento se subirá en otro momento, cuando tengas tiempo revisa tu conexión a internet.'
                }) 
            }
        }, error=>{
          console.log(JSON.stringify(error));
            Swal.fire({  
                icon: 'info',  
                title: 'Algo no está bien...', 
                timer: 2000,
                timerProgressBar: true, 
                text: 'Tu documento se subirá en otro momento, cuando tengas tiempo revisa tu conexión a internet.'
            }) 
        })
    }



}
