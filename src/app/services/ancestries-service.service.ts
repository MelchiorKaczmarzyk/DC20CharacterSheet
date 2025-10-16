import { Injectable } from '@angular/core';
import { ICharacter } from '../interfaces/ICharacter';
import { CreateSheetModel } from '../classes/CreateSheetModel';
import { IAncestryTrait } from '../interfaces/IAncestryTrait';
import { IAncestry } from '../interfaces/IAncestry';
import { switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AncestriesService {

  onTraitSelected(model: CreateSheetModel, ancestry: IAncestry, trait: IAncestryTrait) {
    //add a feature to model.features
    model.features.push({
      name: trait.name,
      source: ancestry.name,
      text: trait.text,
      costAP: trait.costAP,
      costMP: trait.costMP,
      costSP: trait.costSP
    });

    //modifies any values of model if selecting that trait impacts displayed values

  }

  revertTrait(model: CreateSheetModel, ancestry: IAncestry, trait: IAncestryTrait) {
    //removes a feature from model.features by trait.name
    model.features = model.features.filter(f=>f.name!=trait.name);
    //reverts the changes made to model by selecting a trait. It does that by making opposite changes 

  }

  recalculateOptions(model: CreateSheetModel, trait: IAncestryTrait){
    //ATTRIBUTE INCREASE
    if(trait.name == "Attribute Increase"){
      trait.options = model.attributes.filter(a=>a.value<3).map(a=>a.name);
    }
    //SKILL EXPERTISE
    if(trait.name == "Skill Expertise"){
      trait.options = model.skills.filter(s=>s.level==1).map(s=>s.name);
    }
    //ATTRIBUTE DECREASE
    if(trait.name == "Attribute Decrease"){
      trait.options = model.attributes.filter(a=>a.value>-2).map(a=>a.name);
    }
    //TRADE EXPERTISE
    if(trait.name == "Trade Expertise"){
      trait.options = model.trades.filter(t=>t.level==1 && t.name!="").map(t=>t.name);
    }
  }

  previousAttributeIncreaseOption : string = '';
  previousSkillExpertiseOption : string = '';
  previousAttributeDecreaseOption : string = '';
  previousTradeExpertiseOption : string = '';
  onOptionSelected(model: CreateSheetModel, trait: IAncestryTrait, option: string){
    this.revertOption(model,trait,option);
    //adds the text to the feature's name indicating what options have been chosen
    let feature = model.features.find(f=>f.name);
    if(feature != undefined){
      feature.name = feature?.name + " - " + option;
    }

    //ATTRIBUTE INCREASE
    if(trait.name=="Attribute Increase"){
      const attribute = model.attributes.find(a=>a.name==option);
      if(attribute != undefined){
        attribute.floor += 1;
        attribute.value += 1;
      }
      this.previousAttributeIncreaseOption = option;
    }
    //SKILL EXPERTISE
    if(trait.name=="Skill Expertise"){
      const skill = model.skills.find(s=>s.name==option);
      if(skill != undefined){
        skill.level = 2;
      }
      this.previousSkillExpertiseOption = option;
    }
    //ATTRIBUTE DECREASE
    if(trait.name=="Attribute Decrease"){
      const attribute = model.attributes.find(a=>a.name==option);
      if(attribute != undefined){
        attribute.ceiling -= 1;
        attribute.value -=- 1;
      }
      this.previousAttributeDecreaseOption = option;
    }
    //TRADE EXPERTISE
    if(trait.name=="Trade Expertise"){
      const trade = model.trades.find(t=>t.name==option);
      if(trade != undefined){
        trade.level = 2;
      }
      this.previousTradeExpertiseOption = option;
    }


  }

  revertOption(model: CreateSheetModel, trait: IAncestryTrait, option: string){
    //removes the text from the feature's name indicating what options have been chosen
    let feature = model.features.find(f=>f.name);
    if(feature != undefined){
      feature.name.replace(" - " + option, "");
    }

    //ATTRIBUTE INCREASE
    if(trait.name=="Attribute Increase" && this.previousAttributeIncreaseOption!=""){
      const attribute = model.attributes.find(a=>a.name==this.previousAttributeIncreaseOption);
      if(attribute != undefined){
        attribute.floor -= 1;
        attribute.value -= 1;
      }
    }
    //SKILL EXPERTISE
    if(trait.name=="Skill Expertise" && this.previousSkillExpertiseOption!=""){
      const skill = model.skills.find(s=>s.name==this.previousSkillExpertiseOption);
      if(skill != undefined){
        skill.level = 1;
      }
    }
    //ATTRIBUTE DECREASE
    if(trait.name=="Attribute Decrease" && this.previousAttributeDecreaseOption!=""){
      const attribute = model.attributes.find(a=>a.name==this.previousAttributeIncreaseOption);
      if(attribute != undefined){
        attribute.ceiling += 1;
        attribute.value += 1;
      }
    }
    //TRADE EXPERTISE
    if(trait.name=="Trade Expertise" && this.previousTradeExpertiseOption!=""){
      const trade = model.trades.find(t=>t.name==this.previousTradeExpertiseOption);
      if(trade != undefined){
        trade.level = 1;
      }
    }
  }

}
