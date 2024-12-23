import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import Swal from 'sweetalert2/dist/sweetalert2.js';  
import { RestDocumentService } from 'src/app/services/restDocument/rest-document.service';

@Component({
  selector: 'app-documents-pending',
  templateUrl: './documents-pending.component.html',
  styleUrls: ['./documents-pending.component.css']
})
export class DocumentsPendingComponent implements OnInit {
  displayedColumns: string[] = ['DPI', 'NOMBRE', 'APELLIDO', 'SEXO','EDAD'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public documents:any[];
  public valueDocs;
  public user;
  public flag= false
  public intervalos;
  constructor( private restDocument:RestDocumentService) { 
    this.documents = [];
    this.getDocuments();
    this.user = JSON.parse(localStorage.getItem("user"));
    if(!localStorage.getItem("time")){
      localStorage.setItem("time","300000");
      this.intervalos = JSON.parse(localStorage.getItem("time"))
    }else{
      this.intervalos = JSON.parse(localStorage.getItem("time"))
    }
  }

  ngOnInit(): void {
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

  getDocuments(){
    this.documents = [];
    let count = localStorage.getItem("docsScanned");
    this.valueDocs = count
    let val = +count
    for(let value=1; value<=val;value++){
      this.documents.push(JSON.parse(localStorage.getItem("doc"+value)))
    }
    console.log(this.valueDocs)

    this.dataSource = new MatTableDataSource(this.documents);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  uploadDocument(){
    this.getSettings()
    for(let document of this.documents){
      document.userId = this.user.userId;
      if(this.flag){
        this.saveExitorEntry(document)
      }else{
        this.saveDocument(document)
      }
      
    }
    this.getDocuments()
  }
  

  saveDocument(result){
    console.log(result)

     

    this.restDocument.saveDocument(result).subscribe((res:any)=>{
        if(res.documentData){
          let count = localStorage.getItem("docsScanned");
          let val = +count-1;
          localStorage.setItem("docsScanned",JSON.stringify(val))
          let index = this.documents.indexOf(result, 0);
          index=index+1
          console.log(index)
          localStorage.removeItem("doc"+index)
          Swal.fire({  
              icon: 'success',  
              title: 'Operación Exitosa', 
              timer: 2000,
              timerProgressBar: true, 
              text: 'el documento se ha subido exitosamente'
          }) 
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

  
  saveExitorEntry(result){
    console.log(result)

     result.visitResidential = this.user.userResidential;

    this.restDocument.setExitorEntry(result).subscribe((res:any)=>{
        if(res.documentData){
          let count = localStorage.getItem("docsScanned");
          let val = +count-1;
          localStorage.setItem("docsScanned",JSON.stringify(val))
          let index = this.documents.indexOf(result, 0);
          index=index+1
          console.log(index)
          localStorage.removeItem("doc"+index)
          Swal.fire({  
              icon: 'success',  
              title: 'Operación Exitosa', 
              timer: 2000,
              timerProgressBar: true, 
              text: 'el documento se ha subido exitosamente'
          }) 
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

  saveTime(){
    localStorage.setItem("time", JSON.stringify(this.intervalos));
    Swal.fire({  
      icon: 'success',  
      timer: 2000,
      timerProgressBar: true,
      title: 'Operación Exitosa',  
      text: 'el tiempo se ha cambiado exitosamente'
    }) ;
  }

}
