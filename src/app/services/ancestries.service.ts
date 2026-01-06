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
    model.ancestryPointsSpent += trait.cost;
  }

  revertTrait(model: CreateSheetModel, ancestry: IAncestry, trait: IAncestryTrait) {
    model.ancestryPointsSpent -= trait.cost;

    if(trait.name == "Attribute Increase"){
      this.revertOption(model,trait,this.previousAttributeIncreaseOption);
    }
    if(trait.name == "Attribute Decrease"){
      this.revertOption(model,trait,this.previousAttributeDecreaseOption);
    }
    if(trait.name == "Skill Expertise"){
      this.revertOption(model,trait,this.previousSkillExpertiseOption);
    }
    if(trait.name == "Trade Expertise"){
      this.revertOption(model,trait,this.previousTradeExpertiseOption);
    }
  }

  recalculateOptions(model: CreateSheetModel, trait: IAncestryTrait){
    //ATTRIBUTE INCREASE
    if(trait.name == "Attribute Increase"){
      trait.options = model.attributes
      .filter(a=>a.value<3 || a.name==this.previousAttributeIncreaseOption)
      .map(a=>a.name);
    }
    //SKILL EXPERTISE
    else if(trait.name == "Skill Expertise"){
      trait.options = model.skills
      .filter(s=>s.level==1 || s.name==this.previousSkillExpertiseOption)
      .map(s=>s.name);
    }
    //ATTRIBUTE DECREASE
    else if(trait.name == "Attribute Decrease"){
      trait.options = model.attributes
      .filter(a=>a.value>-2 || a.name==this.previousAttributeDecreaseOption)
      .map(a=>a.name);
    }
    //TRADE EXPERTISE
    else if(trait.name == "Trade Expertise"){
      trait.options = model.trades
      .filter(t=>
        (t.level==1 && t.name!="") || 
        (t.name==this.previousTradeExpertiseOption && this.previousTradeExpertiseOption != ""))
      .map(t=>t.name);
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
      trait.optionSelected=option;
      this.previousAttributeIncreaseOption = option;
    }
    //SKILL EXPERTISE
    if(trait.name=="Skill Expertise"){
      const skill = model.skills.find(s=>s.name==option);
      if(skill != undefined){
        skill.level = 2;
        model.skillForExpertise = skill;
      }
      trait.optionSelected=option;
      this.previousSkillExpertiseOption = option;
    }
    //ATTRIBUTE DECREASE
    if(trait.name=="Attribute Decrease"){
      const attribute = model.attributes.find(a=>a.name==option);
      if(attribute != undefined){
        attribute.ceiling -= 1;
        attribute.value -=- 1;
        if(attribute.name=="Intelligence"){
          model.resetSkillsAndTrades();
        }
      }
      trait.optionSelected=option;
      this.previousAttributeDecreaseOption = option;
    }
    //TRADE EXPERTISE
    if(trait.name=="Trade Expertise"){
      const trade = model.trades.find(t=>t.name==option);
      if(trade != undefined){
        trade.level = 2;
      }
      trait.optionSelected=option;
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
        if(attribute.name=="Intelligence"){
          model.resetSkillsAndTrades();
        }
      }
    }
    //SKILL EXPERTISE
    if(trait.name=="Skill Expertise" && this.previousSkillExpertiseOption!=""){
      const skill = model.skills.find(s=>s.name==this.previousSkillExpertiseOption);
      if(skill != undefined){
        skill.level = 1;
        model.skillForExpertise = undefined;
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
