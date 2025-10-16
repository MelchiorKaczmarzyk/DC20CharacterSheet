import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICharacter } from '../interfaces/ICharacter';


@Injectable({
  providedIn: 'root'
})
export class CharacterClassesService {
constructor(){}
    onSelect(character: ICharacter, property: any){
        //handle selecting of every individual class, class talent (later when leveling) and class option.
    }
    revert(character: ICharacter, property: any){
        //handle unselecting of every individual class, class talent (later when leveling) and class option.
    }


}