import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICharacter } from '../interfaces/ICharacter';
import { IconOptions } from '@angular/material/icon';
import { CreateSheetModel } from '../classes/CreateSheetModel';
import { IArmorProperty } from '../interfaces/IArmorProperty';
import { IArmorPropertyOption } from '../interfaces/IArmorPropertyOption';
import { IArmorPropertySelection } from '../interfaces/IArmorPropertySelection';


@Injectable({
  providedIn: 'root'
})
export class ArmorService {
  constructor(){}

  handlePoints(armorOrShield : string, number : number, model : CreateSheetModel){
    if(armorOrShield == 'armor'){
      model.armorPointsSpent += number;
    }
    if(armorOrShield == 'shield'){
      model.shieldPointsSpent += number;
    }
  }
  onArmorOptionChosen(model : CreateSheetModel, ap:IArmorProperty, apo : IArmorPropertyOption,
    armorOrShield : string){
    
    this.handlePoints(armorOrShield,ap.cost,model);
    //PD increase
    if(ap.name == "Precision Defense Increase"){
      model.precisionDefenseBonus += 1;
    }

    //AD increase
    if(ap.name == "Area Defense Increase"){
      model.areaDefenseBonus += 1;
    }
  }

  revertArmorChosen(model : CreateSheetModel, ap:IArmorProperty, apo : IArmorPropertyOption,
    armorOrShield : string
  ){
    this.handlePoints(armorOrShield,-1*ap.cost,model);
    //PD increase
    if(ap.name == "Precision Defense Increase"){
      model.precisionDefenseBonus -= 1;
    }

    //AD increase
    if(ap.name == "Area Defense Increase"){
      model.areaDefenseBonus -= 1;
    }
  }

  onArmorSelectionChosen(model : CreateSheetModel, ap : IArmorPropertySelection, selection : string){
    this.revertArmorSelection(model, ap);
    ap.selectionName = selection;
  }
  revertArmorSelection(model : CreateSheetModel, ap : IArmorPropertySelection){
    ap.selectionName = "";
  }
}