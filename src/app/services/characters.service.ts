import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { ISkill } from '../interfaces/ISkill';
import { map, Observable, tap } from 'rxjs';
import { ICharacter } from '../interfaces/ICharacter';


@Injectable({
  providedIn: 'root'
})
export class CharactersService{
    constructor(private http: HttpClient){}

private url : string = "https://dc20cs-default-rtdb.europe-west1.firebasedatabase.app/characters.json"
getCharacters(): Observable<ICharacter[]> {
  return this.http.get<Record<string, ICharacter>>(this.url).pipe(
    map(responseObject => {
      if (!responseObject) return []; // handle empty database case
      return Object.entries(responseObject).map(([key, character]) => {
        character.id = key;  //set id field to Firebase key
        return character;
      });
    })
  );
}

}