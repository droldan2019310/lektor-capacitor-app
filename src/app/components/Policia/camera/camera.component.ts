import {Component, OnInit, Output, EventEmitter, HostListener} from '@angular/core';

import { CameraPreview, CameraPreviewOptions } from '@capacitor-community/camera-preview';
import { CameraPreviewPictureOptions } from '@capacitor-community/camera-preview';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent implements OnInit {
  ngOnInit(): void {
      this.getPhoto();
  }


  constructor(){
  }

  @Output()
  sendImageFront = new EventEmitter<string>();

  public cameraPreviewOptions: CameraPreviewOptions = {
    height: 300,
    width: window.screen.width,
    position:'rear',
    y:135
  };

  public cameraPreviewPictureOptions: CameraPreviewPictureOptions = {
    quality: 60,
    height:400,
    
  };

 public async getPhoto(){
  CameraPreview.start(this.cameraPreviewOptions);
 }


  public async takePhoto(){
    const result = await CameraPreview.capture(this.cameraPreviewPictureOptions);
    const base64PictureData = result.value;
   
    this.sendImageFront.emit(base64PictureData);
    CameraPreview.stop();
  }
}
