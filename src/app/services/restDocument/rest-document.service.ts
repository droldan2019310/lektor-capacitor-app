import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { CONNECTION } from '../global';

@Injectable({
  providedIn: 'root'
})
export class RestDocumentService {

  
  public uri: string;
  public token;
  public userId;
  public user;
  public status;

  public httpOptions = {
    headers : new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }



  public httpOptionsAuth = {
    headers : new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    })
  }
  
  private extractData(res:Response){
    let body = res;
    return body || [] || {};
  }

  public getToken(){
    let token = localStorage.getItem("token");
    if(token != null || token != undefined){
      let tokenR = token.replace(/['"]+/g,'');
      this.token = "bearer "+tokenR;
    }else{
      this.token = null;
    }

    return this.token;
  }

  public getUser(){
    let user = JSON.parse(localStorage.getItem("user"));
    return user;
  }

  constructor(private http:HttpClient) { 
    this.uri = CONNECTION.URI;
  }



  public saveDocument(documentData){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    })

    let params = JSON.stringify(documentData);
    return this.http.post(this.uri+"saveDocument",params,{headers:headers})
    .pipe(map(this.extractData));

  }

  

  public getFiveDocument(id){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    })
    return this.http.get(this.uri+"getFiveDocuments/"+id,{headers:headers})
    .pipe(map(this.extractData));
  }

  public getFiveDocumentExit(id){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    })
    return this.http.get(this.uri+"getDocumentsFiveExit/"+id,{headers:headers})
    .pipe(map(this.extractData));
  }

  public getSetting(id){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    })
    return this.http.get(this.uri+"getSettingValue/"+id,{headers:headers})
    .pipe(map(this.extractData));
  }


  public setExitorEntry(documentData){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    })

    let params = JSON.stringify(documentData);
    return this.http.post(this.uri+"setExitorEntry",params,{headers:headers})
    .pipe(map(this.extractData));

  }


  public saveExit(documentData){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    })

    let params = JSON.stringify(documentData);
    return this.http.post(this.uri+"saveExit",params,{headers:headers})
    .pipe(map(this.extractData));

  }


}
