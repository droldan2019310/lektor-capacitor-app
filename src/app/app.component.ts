import { ChangeDetectorRef, Component, DoCheck, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { MatSidenav } from '@angular/material/sidenav';
import {MediaMatcher} from '@angular/cdk/layout';
import { LoaderService } from './services/loader/loader.service';
import { Plugins } from '@capacitor/core';
import { RestUserService } from './services/restUser/rest-user.service';
import { Router } from '@angular/router';
import { ExitCodeComponent } from './components/Policia/exit-code/exit-code.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy,OnInit, DoCheck{
  title = 'lektorGT';
  mobileQuery: MediaQueryList;

  @ViewChild('snav') sidenav: MatSidenav;
  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'indeterminate';
  value = 50;
  bufferValue = 75;
  public user;
  public token;
  public userRole;
  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public loader:LoaderService, 
    private restUser:RestUserService, private router:Router,public dialog: MatDialog){
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  private _mobileQueryListener: () => void;

  
  ngDoCheck(){
    this.token = this.restUser.getToken();
    this.user = this.restUser.getUser();
    this.getRole();
  }

  getRole(){
    if(this.user ==null){
      this.userRole = null;
    }else{
      this.userRole = this.user.userRole;
    }
  }

  logOut(){
    const dialogRef = this.dialog.open(ExitCodeComponent, {
      data: {},
    });
    dialogRef.afterClosed().subscribe(result => {
        this.router.navigateByUrl("");
    }); 
  }

  
  ngOnInit(){
  }

}
