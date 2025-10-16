import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { ISkill } from '../interfaces/ISkill';
import { Observable, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SkillsService{
    constructor(private http: HttpClient){}

    private url : string = "https://dc20cs-default-rtdb.europe-west1.firebasedatabase.app/skills.json"
    getSkills(): Observable<ISkill[]>{
        return this.http.get<ISkill[]>(this.url).pipe(
            tap(data => console.log("All", JSON.stringify(data)))
    )
    }
}