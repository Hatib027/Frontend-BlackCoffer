import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from './helper';


@Injectable({
  providedIn: 'root'
})
export class BackedService {

  constructor(private httpClient:HttpClient) { }

  public getBackedData(){
    return this.httpClient.get(`${baseUrl}/blackCoffer/getdatarecom`);
  }
}
