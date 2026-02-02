import { Injectable } from "@angular/core";
import { IFeature } from "../interfaces/IFeature";
import { IAncestryTrait } from "../interfaces/IAncestryTrait";
import { IAncestry } from "../interfaces/IAncestry";
import { IClass } from "../interfaces/IClass";
import { ITalentOption } from "../interfaces/ITalentOption";
import { IArmorProperty } from "../interfaces/IArmorProperty";

@Injectable({
  providedIn: 'root'
})
export class FeaturesService {

  public makeFeaturesFromAncestry(a:IAncestry) : IFeature[]{
    let features : IFeature[] = [];
    let selectedTraits : IAncestryTrait[] = a.traits.filter(t=>t.selected);
    let nameToSet : string = '';
    for(let t of selectedTraits){
      nameToSet = '';
      if(t.optionSelected != ""){
        nameToSet = t.name + ': ' + t.optionSelected;
      }
      features.push({
        name: t.name,
        section: "Ancestry",
        source: a.name,
        text: t.text,
        costAP: t.costAP,
        costMP : t.costMP,
        costSP : t.costSP,
        range: 0,
        duration: 0
      })
    }
    return features;
  }

  //opcje też potrzebują pola na koszt, bo np klątwa hexbladea
  public makeFeaturesFromClass(c:IClass) : IFeature[]{
    let features : IFeature[] = [];
    let selectedOptions : ITalentOption[] = [];
    let sourceToSet : string = '';
    for(let t of c.talents){
      selectedOptions = (t.options==undefined)? [] : t.options.filter(o=>o.selected);
      sourceToSet = t.name + ', ' + c.name;
      if(t.subTalents != undefined){
      for(let s of t.subTalents){
        features.push({
          name: s.name,
          section: "Class",
          source: sourceToSet,
          text: s.text,
          costAP: 0,
          costSP: 0,
          costMP: 0,
          range: 0,
          duration: 0
        });
      }
    }

      for(let o of selectedOptions){
        features.push({
          name: o.name,
          section: "Class",
          source: sourceToSet,
          text: o.text,
          costAP: 0,
          costSP: 0,
          costMP: 0,
          range: 0,
          duration: 0
        });
      }
    }
    return features;
  }
  public makeFeaturesFromArmor(a : IArmorProperty[]) : IFeature[] {
    let features : IFeature[] = [];
    let nameToSet = '';
    let sourceToSet = 'Armor';
    for(let p of a){
      if(!p.selection.selectionsEmpty){
        nameToSet = p.name + ': ' + p.selection.selectionName;
      }
      else {
        nameToSet = p.name;
      }
      if(p.options.some(o=>o.selected)){
        features.push({
          name: nameToSet,
          section: "Armor",
          source: sourceToSet,
          text: p.helperText,
          costAP: 0,
          costMP: 0,
          costSP: 0,
          range: 0,
          duration: 0
       })
      }
    }
    return features;
  }

  public makeFeaturesFromShield(a : IArmorProperty[]) : IFeature[]{
    let features : IFeature[] = [];
    let nameToSet = '';
    let sourceToSet = 'Shield';
    for(let p of a){
      if(!p.selection.selectionsEmpty){
        nameToSet = p.name + ': ' + p.selection.selectionName;
      }
      else {
        nameToSet = p.name;
      }
      if(p.options.some(o=>o.selected)){
        features.push({
          name: nameToSet,
          section: "Armor",
          source: sourceToSet,
          text: p.helperText,
          costAP: 0,
          costMP: 0,
          costSP: 0,
          range: 0,
          duration: 0
       })
      }
    }
    return features;
  }
}