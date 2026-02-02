import { Injectable } from '@angular/core';
import { CreateSheetModel } from '../classes/CreateSheetModel';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CreateSheetModelService {
    data = new CreateSheetModel();
    constructor(private http: HttpClient){
        this.initializeData();
    }
    initializeData(){
        this.http.get<any>('assets/ancestries.json').subscribe({
        next: (data) => {
            this.data.ancestries = data.ancestries;
            },
        });
    }
}
