import { Injectable } from "@angular/core";
import { CreateSheetModel } from "../classes/CreateSheetModel";
import { ISpell } from "../interfaces/ISpell";

@Injectable({
  providedIn: 'root'
})
export class SpellService {
  constructor(){}
  onCantripSelected(model : CreateSheetModel, spell : ISpell){
    model.cantripPointsSpent+=1;
  }
  revertCantripSelection(model : CreateSheetModel, spell : ISpell){
    model.cantripPointsSpent-=1;
  }
  onSpellSelected(model : CreateSheetModel, spell : ISpell){
    model.spellPointsSpent+=1;
  }
  revertSpellSelection(model : CreateSheetModel, spell : ISpell){
    model.spellPointsSpent-=1;
  }
}