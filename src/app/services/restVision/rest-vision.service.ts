import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { googlecloudvisionapi } from '../../../config/googlecloudvisionapi';

@Injectable({
  providedIn: 'root'
})
export class RestVisionService {

  constructor(public http: HttpClient) { }


  getText(base64Image) {
    const body = {
      "requests": [
        {
          "image": {
            "content": base64Image
          },
          "features": [
            {
              "type": "TEXT_DETECTION",
              "maxResults":1
            }
          ]
        }
      ]
    }
    return this.http.post('https://vision.googleapis.com/v1/images:annotate?key=' + googlecloudvisionapi.googleCloudVisionAPIKey, body);
  }

}
