import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { FormGroup, FormsModule } from '@angular/forms';
import {MatRadioChange, MatRadioModule} from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { IAncestry } from '../../interfaces/IAncestry';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {MatExpansionModule} from '@angular/material/expansion';
import { IAncestryTrait } from '../../interfaces/IAncestryTrait';
import { IAttribute } from '../../interfaces/IAttribute';
import { MatOption } from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import { ISkill } from '../../interfaces/ISkill';
import { ITrade } from '../../interfaces/ITrade';
import { IClass } from '../../interfaces/IClass';
import { PrependSpace } from '../../pipes/prependSpacePipe';
import { ITalent } from '../../interfaces/ITalent';
import { ICharacter } from '../../interfaces/ICharacter';
import { CharacterCreatedService } from '../../services/character-created.service';
import { ExtraOptions, Router, RouterModule } from '@angular/router';
import { ITalentOption } from '../../interfaces/ITalentOption';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import { SwipeDirective } from '../../directives/swipe-directive';
import {MatListModule} from '@angular/material/list';
import { IFeature } from '../../interfaces/IFeature';
import { CharacterClassesService } from '../../services/character-classes.service';
import { ArmorPropertiesService } from '../../services/armor-properties.service';
import { SkillsService } from '../../services/skills.service';
import { Subscription, switchMap } from 'rxjs';
import { CreateSheetModelService } from '../../services/create-sheet-model.service';
import { AncestriesService } from '../../services/ancestries-service.service';




@Component({
  selector: 'app-create-sheet',
  standalone: true,
  imports: [MatButtonModule, MatRadioModule, MatInputModule, MatFormFieldModule, MatIconModule,
    MatCheckboxModule, MatExpansionModule, MatOption, MatSelectModule, FormsModule, MatSidenavModule,
    MatToolbarModule, MatListModule,
    CommonModule, HttpClientModule, PrependSpace, SwipeDirective],
  templateUrl: './create-sheet.component.html',
  styleUrls: ['./create-sheet.component.css']
})

export class CreateSheetComponent implements OnInit, OnDestroy {

  constructor(private http: HttpClient, private router: Router, 
    private characterCreated: CharacterCreatedService, private classService: CharacterClassesService,
    private armorService: ArmorPropertiesService, private skillsService: SkillsService,
    private ancestryService: AncestriesService,
    private dataModel: CreateSheetModelService){
    }
  model = this.dataModel.data;
  //ATRIBUTES

  //  ! TO BE REMOVED - functionality moved to the service !

  increaseAttribute(attribute: IAttribute){
    if(attribute.value < attribute.ceiling && this.model.attributePoints > 0){
      attribute.value += 1;
      this.handleDefenses(attribute,'+');
      this.handleHP(attribute,'+');
      this.manageAttributesForAncestries();
      //reverting the element to its normal style after it was marked as being in wrong state
      this.validateAttributes();
    }
  }
  decreaseAttribute(attribute: IAttribute){
    if(attribute.value > attribute.floor && this.model.attributePoints < 13){
      attribute.value -= 1;
      this.handleDefenses(attribute,'-');
      this.handleHP(attribute,'-');
      this.manageAttributesForAncestries();
      if(attribute.name == "Intelligence"){
        this.model.skillPointSpent = 0;
        this.model.tradePointsSpent = 0;
        for(let skill of this.model.skills){
          skill.level = 0;
        }
        for(let trade of this.model.trades){
          trade.level = 0;
        }
      }
    }
  }
  handleDefenses(attribute : IAttribute, operation: string) {
      if(attribute.name == 'Might' || attribute.name == 'Charisma')
      {
        if(operation == '+')
          this.model.precisionDefense += 1;
        if(operation == '-')
          this.model.precisionDefense -= 1;
      }
      else if(attribute.name == 'Agility' || attribute.name == 'Intelligence')
      {
        if(operation == '+')
          this.model.precisionDefense += 1;
        if(operation == '-')
          this.model.precisionDefense -= 1;
      }
  }
  handleHP(attribute : IAttribute, operation:string){
    if(attribute.name == "Might"){
        if(operation == '+')
          this.model.precisionDefense += 1;
        if(operation == '-')
          this.model.precisionDefense -= 1;
    }
  }
  //SKILLS
  subSkills = new Subscription();
  
  hasTrait(traitName : string): boolean{
    for(let ancestry of this.model.ancestries){
      for(let trait of ancestry.traits){
        if(trait.name==traitName){
          return true;
        }
      }
    }
    return false;
  }
    
  get isAdept() : boolean{
    if (this.model.skills.some(s => s.level == 2) || this.character.trades.some(t => t.level == 2))
      {
        return true;
      }
      else
        return false;
  }

  getSkill(name: string) : ISkill{
    return this.model.skills.find(s=>s.name==name) ?? {name:"",attribute:",",level:0,}
  }
  getSkillAdept() : ISkill{
    return this.model.skills.find(s=>s.level==2) ?? {name:"",attribute:",",level:0,};
  }
  
  onNoviceClicked(skillName: string, event: MouseEvent){
    const skill: ISkill = this.getSkill(skillName);
    const enoughSkillPoints = this.model.skillPoints > 0;
    const isLevel0 = skill.level == 0;
    const isLevel1 = skill.level == 1;
    const isLevel2 = skill.level == 2;

    if(isLevel0 && enoughSkillPoints){
      this.model.skillPointSpent += 1;
      skill.level = 1;
    }
    else if(isLevel0 && !enoughSkillPoints){
      skill.level = 0;
    }
    else if(isLevel1){
      this.model.skillPointSpent -= 1;
      skill.level = 0;
    }
    else if(isLevel2){
      this.model.skillPointSpent -= 2;
      skill.level = 1;
    }
    this.recalculateNoviceSkills();
  }
  onAdeptClicked(skillName: string, event: MouseEvent){
    const skill: ISkill = this.getSkill(skillName);
    const isLevel0 = skill.level == 0;
    const isLevel1 = skill.level == 1;
    const isLevel2 = skill.level == 2;
    if(isLevel0 && this.model.skillPoints >= 3){
      this.model.skillPointSpent += 3;
      skill.level = 2;
    }
    else if(isLevel0 && !(this.model.skillPoints >= 3)){
      skill.level = 0;
    }
    else if(isLevel1 && this.model.skillPoints >= 2){
      this.model.skillPointSpent += 2;
      skill.level = 2;
    }
    else if(isLevel1 && !(this.model.skillPoints >= 2)){
      skill.level = 1;
    }
    else if(isLevel2 /*AND IF YOU PAID FOR IT*/){
      this.model.skillPointSpent -= 3;
      skill.level = 0;
    }
    this.recalculateNoviceSkills();
  }

  getTrade(name: string) : ITrade{
    return this.model.trades.find(t=>t.name==name) ?? {name:"",level:0};
  }
  getTradeAdept() : ITrade{
    return this.model.trades.find(t=>t.level==2) ?? {name:"",level:0,};
  }
  onNoviceTradeClicked(tradeName: string, event: MouseEvent){
    const trade: ITrade = this.getTrade(tradeName);
    const enoughTradePoints = this.model.skillPoints > 0;
    const isLevel0 = trade.level == 0;
    const isLevel1 = trade.level == 1;
    const isLevel2 = trade.level == 2;
    if(isLevel0 && enoughTradePoints){
      this.model.tradePointsSpent += 1;
      trade.level = 1;
    }
    else if(isLevel0 && !enoughTradePoints){
      trade.level = 0;
    }
    else if(isLevel1){
      this.model.tradePointsSpent -= 1;
      trade.level = 0;
    }
    else if(isLevel2){
      this.model.tradePointsSpent -= 2;
      trade.level = 1;
    }
    this.recalculateNoviceTrades();
  }
  onAdeptTradeClicked(tradeName: string, event: MouseEvent){
    const trade: ITrade = this.getTrade(tradeName);
    const enoughTradePoints = this.model.skillPoints > 1;
    const isLevel0 = trade.level == 0;
    const isLevel1 = trade.level == 1;
    const isLevel2 = trade.level == 2;
    if(isLevel0 && this.model.skillPoints >= 3){
      this.model.tradePointsSpent += 3;
      trade.level = 2;
    }
    else if(isLevel0 && !(this.model.tradePoints >= 3)){
      trade.level = 0;
    }
    else if(isLevel1 && this.model.tradePoints >= 2){
      this.model.tradePointsSpent += 2;
      trade.level = 2;
    }
    else if(isLevel1 && !(this.model.tradePoints >= 2)){
      trade.level = 1;
    }
    else if(isLevel2 /*AND IF YOU PAID FOR IT*/){
      this.model.tradePointsSpent -= 3;
      trade.level = 0;
    }
    this.recalculateNoviceTrades();
  }

//ANCESTRIES
/*
So far ancestry traits which require other ancestry traits (like beastborn or dragonborn have for example)
are not handled at all. The IAncestryTrait interface will need to be expanded to include requirement field.
*/
  onAncestryChosen(ancestry: IAncestry, event: Event, panel: any) {
  let copyOfAncestrySelected = ancestry.selected;
  if (this.getAncestriesChosenNumber() > 2 && !this.model.allowLimitlessAncestries) {
    ancestry.selected = false;
  } 
  else if (copyOfAncestrySelected) {
    panel.close();
    let zeroCostTrait = ancestry.traits.find(t => t.cost == 0);
    if (zeroCostTrait && this.allow0CostSelection(ancestry)) {
      zeroCostTrait.selected = true;
    }
    //reverting the element to its normal style after it was marked as being in wrong state
    this.validateAncestries();
  } 
  else if (!copyOfAncestrySelected) {
    panel.open();
    for (let trait of ancestry.traits) {
      if (trait.selected) {
        this.revertAncestryTraitChanges(trait, 'ancestry');
      }
      trait.selected = false;
    }
  }
  this.recalculateAncestryPoints();
}
  isTradeAdept() : boolean {
    if(this.character.trades.some(t => t.level == 2)){
      return true;
    }
    else
      return false;
  }
  isSkillAdept() : boolean {
    if(this.character.skills.some(s => s.level == 2)){
      return true;
    }
    else
      return false;
  }
  pickedSkillExpertise() : boolean {
    for(let a of this.model.ancestries){
      /*
      To jest trochę spaghetti code, te trady powinny mieć jakieś tagi i to powinno sprawdzać, czy
      dany trade ma "zwiększa mastery limit" tag czy coś, a nie tak chamsko po nazwie
      */
      let condition = a.traits.some(t => t.name=='Skill Expertise' && t.selected);
      if(condition)
        return true;
    }
    return false
  }
  pickedTradeExpertise() : boolean {
    for(let a of this.model.ancestries){
      /*
      To jest trochę spaghetti code, te trady powinny mieć jakieś tagi i to powinno sprawdzać, czy
      dany trade ma "zwiększa mastery limit" tag czy coś, a nie tak chamsko po nazwie
      */
      let condition = a.traits.some(t => t.name=='Trade Expertise' && t.selected);
      if(condition)
        return true;
    }
    return false
  }
  pickedAttributeIncrease() : boolean {
      for(let a of this.model.ancestries){
      /*
      To jest trochę spaghetti code, te trady powinny mieć jakieś tagi i to powinno sprawdzać, czy
      dany trade ma "zwiększa mastery limit" tag czy coś, a nie tak chamsko po nazwie
      */
      let condition = a.traits.some(t => t.name=='Attribute Increase' && t.selected);
      if(condition)
        return true;
    }
    return false
  }
  pickedAttributeDecrease() : boolean {
      for(let a of this.model.ancestries){
      /*
      To jest trochę spaghetti code, te trady powinny mieć jakieś tagi i to powinno sprawdzać, czy
      dany trade ma "zwiększa mastery limit" tag czy coś, a nie tak chamsko po nazwie
      */
      let condition = a.traits.some(t => t.name=='Attribute Decrease' && t.selected);
      if(condition)
        return true;
    }
    return false
  }
  getAncestriesChosenNumber() : number {
    let result = 0;
    result = this.model.ancestries.filter(a=>a.selected).length;
    return result;
  }
  recalculateAncestryPoints(){
    let pointsSpent = 0;
    for(let ancestry of this.model.ancestries){
      for(let trait of ancestry.traits){
        pointsSpent = (trait.selected)? pointsSpent+trait.cost : pointsSpent;
      }
    }
    this.model.ancestryPointsSpent = pointsSpent;
  }
  allow0CostSelection(ancestry : IAncestry) : boolean {
    let ancestries = this.model.ancestries.filter(a=>a.name!=ancestry.name);
    for(let ancestry of ancestries){
      if(ancestry.selected)
        return false;
    }
    return true;
  }
  

  onAncestryTraitChosen(ancestry :IAncestry, trait : IAncestryTrait){
    const cost = trait.cost;
    const enoughAncestryPoints = this.model.ancestryPoints >= cost;
    if(trait.cost == 0 && ancestry.selected){
      trait.selected = true;
    }
    else if(!ancestry.selected){
      trait.selected = false;
    }
    else if(trait.selected && enoughAncestryPoints){
      this.model.ancestryPointsSpent += cost;
      this.ancestryService.onTraitSelected(this.model, ancestry, trait)
      this.ancestryService.recalculateOptions(this.model, trait);
    }
    else if(trait.selected && !enoughAncestryPoints){
      trait.selected = false;
    }
    else if(!trait.selected){
      this.model.ancestryPointsSpent -= cost;
      this.ancestryService.revertTrait(this.model, ancestry, trait)
    }
    
  }
  onOpenedChange(trait: IAncestryTrait){
    this.ancestryService.recalculateOptions(this.model, trait)
  }
  onTraitOptionChosen(trait : IAncestryTrait, option: string){
    this.ancestryService.onOptionSelected(this.model, trait, option);
  }
//This method will need to be modified to properly handled other traits with options
/*
  onAncestryTraitChosen(ancestry :IAncestry, trait : IAncestryTrait) {
    if(trait.cost == 0 && ancestry.selected){
      trait.selected = true;
    }
    else if(!ancestry.selected){
      trait.selected = false;
    }
    else if(trait.selected && 
      (this.model.ancestryPoints < trait.cost || 
      !ancestry.selected ||
      (trait.name == "Trade Expertise" && this.isTradeAdept()) ||
      (trait.name == "Skill Expertise" && this.isSkillAdept()))) {
      trait.selected = false;
    }
    //kliknięcie checkboxa ustawia trait.selected = true zanim ta metoda się w ogóle zacznie wykonywać
    else if(trait.selected){
      //reverting the element to its normal style after it was marked as being in wrong state
      this.validateAncestryTraits();
    }
    else if(!trait.selected){
      //undo changes made by picking those traits when they are unselected
      this.revertAncestryTraitChanges(trait, 'trait');
    }
    this.recalculateAncestryPoints();
  }
  */

  /*THIS WHOLE SECTION IS ABOUT ANCESTRY TRAITS THAT REQUIRE THE USER TO CHOOSE FURTHER OPTIONS*/
  /*
  Each trait that makes it so options need to be picked must be individually
  checked for. This method may need to be expanded by for example ancestry traits
  that allow to choose a spell or damage type for some effect
  */
  revertAncestryTraitChanges(trait: IAncestryTrait, source: string){
    if((source=='ancestry' && trait.selected) || (source=='trait' && !trait.selected)){
      if(trait.name == 'Skill Expertise'){
      let skillExpert = this.model.skills.find(s => s.level == 2);
        if(skillExpert != undefined){
          const adeptKey = `is${skillExpert.name}Adept` as keyof this;
          this[adeptKey] = false as any;
          skillExpert.level = 1;
          this.skillForExpertise_name = '';
        }
      }
      if(trait.name == 'Trade Expertise'){
        let tradeExpert = this.model.trades.find(t => t.level == 2);
        if(tradeExpert != undefined){
          tradeExpert.level = 1;
          this.tradeForExpertise_name = '';
        }
      }
      if(trait.name == 'Attribute Increase'){
        let attributeChosen = this.model.attributes.find(a => a.floor > -2);
        if(attributeChosen != undefined){
          attributeChosen.floor -= 1;
          attributeChosen.value -= 1;
          this.model.attributeForIncrease_name = '';
        }
      }
      if(trait.name == 'Attribute Decrease'){
        let attributeChosen = this.model.attributes.find(a => a.ceiling < 3);
        if(attributeChosen != undefined){
          attributeChosen.ceiling += 1;
          attributeChosen.value += 1;
          this.model.attributeForDecrease_name = '';
        }
      }
    }
  }

  //Attribute Increase and Attribute Decrease
  
  getAttributesBelow3() : IAttribute[] {
    let attributesBelow3 = this.model.attributes.filter(a=>a.value<3);
    if(this.getAttributeIncreased().value == 3) {
      attributesBelow3.push(this.getAttributeIncreased());
    }
    return attributesBelow3;
  }
  getAttributesAboveMinus2() : IAttribute[]{
    let attributesAboveMinus2 = this.model.attributes.filter(a=>a.value>-2);
    if((this.getAttributeDecreased().value == -2)){
      attributesAboveMinus2.push(this.getAttributeDecreased());
    }
    return attributesAboveMinus2;
  }
  getAttributeIncreased() : IAttribute {
    return this.model.attributes.find(a=>a.floor>-2) ?? {name:"",value:0,floor:-1,ceiling:3};
  }
  getAttributeDecreased() : IAttribute {
    return this.model.attributes.find(a=>a.floor>-2) ?? {name:"",value:0,floor:-2,ceiling:2};
  }
  
  manageAttributesForAncestries(){
    this.model.attributesAboveMinus2 = this.getAttributesAboveMinus2();
    this.model.attributesBelow3 = this.getAttributesBelow3();
  }
  
  onAttributeForIncreaseChosen(attributeName : string) {
    this.manageAttributesForAncestries();
    let attributeChosen = this.model.attributes.find(a => a.name == attributeName);
    if(this.model.attributeForIncrease_name != '') {
      let previoussAttribute = this.model.attributes.find(a=>a.name == this.model.attributeForIncrease_name);
      if(previoussAttribute != undefined){
        previoussAttribute.floor -= 1;
        previoussAttribute.value -= 1;
      }
    }
    if(attributeChosen != undefined){
      attributeChosen.value += 1;
      attributeChosen.floor += 1;
    }
    this.model.attributeForIncrease_name = attributeName;
    //reverting the element to its normal style after it was marked as being in wrong state
    this.validateAncestryTraitOptions();
  }
  onAttributeForDecreaseChosen(attributeName : string) {
    let attributeChosen = this.model.attributes.find(a => a.name == attributeName);
    if(this.model.attributeForDecrease_name != ''){
      let previoussAttribute = this.model.attributes.find(a=>a.name == this.model.attributeForDecrease_name);
      if(previoussAttribute != undefined){
        previoussAttribute.ceiling += 1;
        previoussAttribute.value += 1;
      }
    }
    if(attributeChosen != undefined){
        attributeChosen.value -= 1;
        attributeChosen.floor -= 1;
    }
    this.model.attributeForDecrease_name = attributeName;
    //reverting the element to its normal style after it was marked as being in wrong state
    this.validateAncestryTraitOptions();
  }
  //Trade Expertise
  isTradeExpertiseCorrect : boolean = true;
  tradesNovice : ITrade[] = [];
  tradeForExpertise_name: string = ''; //option that has been chosen bedore, so they can be reversed
  recalculateNoviceTrades() {
    let noviceTrades = this.model.trades.filter(t=>t.name != "" && t.level == 1);
    this.tradesNovice = noviceTrades;
  }
  onTradeForExpertiseChosen(tradeName : string) {
    let tradeChosen = this.model.trades.find(t => t.name == tradeName);
    if(this.tradeForExpertise_name != ''){
      let previousTrade = this.model.trades.find(t => t.name == this.tradeForExpertise_name)
      if(previousTrade != undefined) {
          previousTrade.level = 1;
      }
    }
    if(tradeChosen != undefined) {
      tradeChosen.level = 2;
    }
    this.tradeForExpertise_name = tradeName;
    this.validateAncestryTraitOptions();
  }
  //Skill Expertise
  isSkillExpertiseCorrect : boolean = true;
  skillsNovice : ISkill[] = [];
  skillForExpertise_name: string = '';
  recalculateNoviceSkills() {
    let noviceSkills = this.model.skills.filter(s=>s.level == 1);
    this.skillsNovice = noviceSkills;
  }
  onSkillForExpertiseChosen(skillName : string) {
    let skillChosen = this.model.skills.find(t => t.name == skillName);
    if(this.skillForExpertise_name != ''){
      let previousSkill = this.model.skills.find(t => t.name == this.skillForExpertise_name)
      if(previousSkill != undefined) {
          previousSkill.level = 1;
      }
    }
    if(skillChosen != undefined) {
      skillChosen.level = 2;
    }
    this.skillForExpertise_name = skillName;
    this.validateAncestryTraitOptions();
  }
  
  //CLASS
  classes: IClass[] = [];
  alreadySelectedClass: IClass | null = null;
  get currentClass() {
    return this.classes.find(c => c.selected)
  }
  get isClassMartial() : boolean{
    if(this.currentClass != undefined && this.currentClass.stamina > 0){
      return true;
    }
    else return false;
  }
  get isClassCaster() : boolean{
    if(this.currentClass != undefined && this.currentClass.mana > 0){
      return true;
    }
    else return false;
  }

  //Proper handling of specific changes picking each class makes to the character sheet
  onClassChosen(chosenClass: IClass, panel: any) {
    //ensure that up to one class can be selected
    if(this.alreadySelectedClass != null){
      this.alreadySelectedClass.selected = false;
    }
    //ensure the proper behaviour of the dropdown panel
    if(chosenClass.selected){
      //for some reason the condition for closing appear to be backwards
      panel.close();
      this.alreadySelectedClass = chosenClass;
      this.character.characterClass = chosenClass;
    }
    else if (!chosenClass.selected) {
      //for some reason the condition for closing appear to be backwards
      panel.open();
      this.alreadySelectedClass = null;
    }
    //reverting the element to its normal style after it was marked as being in wrong state
    this.validateClass();
  }
  /*
    Proper handling of specific changes picking each individual option makes to the character sheet and
    allowing correct number of options to pick for each individual trait
  */
  onTalentOptionChosen(talent: ITalent, option: ITalentOption) {
    //does not allow the user to choose more options than specified in the talent.numberOfOptionsToChoose
    if(talent.numberOfOptionsToChoose == talent.options.filter(o=>o.selected).length){
      option.selected = false;
    }
    //reverting the element to its normal style after it was marked as being in wrong state
    this.validateClassOptions();
  }

  //ARMOR
  armorProperties : any[] = [];
  shieldProperties : any[] = [];
  shieldPoints : number = 2;
  armorPoints : number = 2;
  isWearingArmor: boolean = false;
  onArmorDon(panel:any){
    //ensure the proper behaviour of the dropdown panel
    if(this.isWearingArmor){
      //for some reason the condition for closing appear to be backwards
      panel.close();
    }
    else if (!this.isWearingArmor) {
      //for some reason the condition for closing appear to be backwards
      panel.open();
    }
        //class needs to be chosen first
    if(this.currentClass == undefined){
      this.isWearingArmor = false;
    }
  }
  isWearingShield : boolean = false
  onShieldDon(panel:any){
    //ensure the proper behaviour of the dropdown panel
    if(this.isWearingShield){
      //for some reason the condition for closing appear to be backwards
      panel.close();
    }
    else if (!this.isWearingShield) {
      //for some reason the condition for closing appear to be backwards
      panel.open();
    }
    if(this.currentClass == undefined){
      this.isWearingShield = false;
    }
  }

  selectedArmorType : string = "Light";
  get legalArmorProierties():any[] {
    if(this.selectedArmorType == 'Light'){
      return this.armorProperties.filter(p=>p.forLight);
    }
    if(this.selectedArmorType == 'Heavy'){
      return this.armorProperties.filter(p=>p.forHeavy);
    }
    else return [];
  }
  selectedShieldType : string = 'Light'
  get legalShieldProierties():any[] {
    if(this.selectedShieldType == 'Light'){
      return this.shieldProperties.filter(p=>p.forLight);
    }
    if(this.selectedShieldType == 'Heavy'){
      return this.shieldProperties.filter(p=>p.forHeavy);
    }
    else return [];
  }
  onArmorOptionClicked(armorOption : any, options : any[], armorProperty:any){
    //can't check anything unless wearing armor
    if(!this.isWearingArmor){
      armorOption.selected=false;
    }
    //can't check the second checkbox if the first one is not checked
    else if(armorOption.selected && armorOption.level > 1 
      && !options[armorOption.level-2].selected){
      armorOption.selected = false;
    }
    //can't uncheck the first checkbox if the second one is checked
    else if(!armorOption.selected && armorOption.level<options.length 
      && options[armorOption.level].selected){
      armorOption.selected = true;
    }
    //handle spending of armor points once it was made sure that the box can be checked
    else if(armorOption.selected && (armorOption.cost < 0 || this.armorPoints >= armorOption.cost)){
      this.armorPoints -= armorOption.cost;
      //this.armorService.onSelect(this.character, armorProperty);
    }
    else if(!armorOption.selected){
      this.armorPoints += armorOption.cost;
      //this.armorService.revert(this.character, armorProperty);
    }
  }
  onShieldOptionClicked(shieldOption : any, options : any[], shieldProperty: any) {
  //can check anything only if wearing shield
    if(!this.isWearingShield){
      shieldOption.selected=false;
    }
    //can't check the second checkbox if the first one is not checked
    else if(shieldOption.selected && shieldOption.level > 1 
      && !options[shieldOption.level-2].selected){
      shieldOption.selected = false;
    }
    //can't uncheck the first checkbox if the second one is checked
    else if(!shieldOption.selected && shieldOption.level<options.length 
      && options[shieldOption.level].selected){
      shieldOption.selected = true;
    }
    //handle spending of armor points once it was made sure that the box can be checked
    else if(shieldOption.selected && (shieldOption.cost < 0 || this.shieldPoints >= shieldOption.cost)){
      this.shieldPoints -= shieldOption.cost;
      //this.armorService.onSelect(this.character, shieldProperty);
    }
    else if(!shieldOption.selected){
      this.shieldPoints += shieldOption.cost;
      //this.armorService.revert(this.character, shieldProperty);
    }
  }

  get hp() {
    let hp = 0;
    let characterClass = this.currentClass;
    let mightScore = this.character.attributes.find(a => a.name == 'Might')?.value;
    if(characterClass != undefined && mightScore != undefined) {
      hp = characterClass.hp + mightScore;
    }
    return hp;
  }

  features: IFeature[] = [];
  onFinishClicked() {
    //find chosen ancestries
    /*
    let ancestriesChosen = this.ancestriesAll.filter(a=>a.selected);
    let ancestriesCopy : IAncestry[] = []; 
    ancestriesChosen.forEach(a => ancestriesCopy.push(Object.assign({},a)));
    for(let ancestry of ancestriesCopy){
      ancestry.traits = ancestry.traits.filter(t=>t.selected);
    }
    
    if(this.validateFields(ancestriesChosen))
    {
      if(this.currentClass != undefined) {
      */
        //this.character.ancestries = this.getAncestriesSelectedOptions();
        //this.characterCreated.character = this.character;
        this.router.navigate(['/app/viewCharacter']);
        /*
    }
  }
  */
}

  isNameChosen : boolean = true;
  areAttributePointsSpent : boolean = true;
  areSkillPointsSpent : boolean = true;
  areTradePointsSpent : boolean = true;
  areAncestriesChosen : boolean = true;
  areAncestryPointsSpent : boolean = true;
  areAncestryTraitOptionsPicked : boolean = true;
  isClassSelected : boolean = true;
  areClassOptionsSelected : boolean = true;

  //marks fields' state as wrong if the conditions are met
  validateFields(ancestries : IAncestry[]) : boolean {
    //id of the error section to navigate to
    let navigationPoint : string = '';
    //check if name is selected
    if(this.character.name == ''){
      this.isNameChosen = false;
      navigationPoint = 'finishSection';
    }
    //check if class was selected
    if(this.currentClass == undefined){
      this.isClassSelected = false;
      navigationPoint = 'classSection';
    }
    //check if class options were selected
    let talentsWithOptions = this.currentClass?.talents.filter(t=>
      t.numberOfOptionsToChoose>0);
    if(talentsWithOptions != undefined){
      for(let talent of talentsWithOptions){
        let numberOfChosen = talent.options.filter(o=>o.selected).length;
        if(numberOfChosen != talent.numberOfOptionsToChoose){
          this.areClassOptionsSelected = false;
          break;
        }
      }
      if(!this.areClassOptionsSelected){
        navigationPoint = 'classSection';
      }
    }
    //check if ancestries were chosen
    if(ancestries.length == 0){
      this.areAncestriesChosen = false;
      navigationPoint = 'ancestriesSection';
    }
    //check if ancestry points were spent
    if(this.model.ancestryPoints  != 0){
      this.areAncestryPointsSpent = false;
      navigationPoint = 'ancestriesSection';
    }
    //check if ancestry trait options were picked
    let ancestryOptionIsWrong : boolean = false;
    for(let a of ancestries){
      for(let t of a.traits){
        if(t.name == 'Attribute Increase' && this.model.attributeForIncrease_name == ''){
          this.model.isAttributeIncreaseCorrect = false;
          ancestryOptionIsWrong = true;
          break;
        }
        if(t.name == 'Attribute Decrease' && this.model.attributeForDecrease_name == ''){
          this.model.isAttributeDecreaseCorrect = false;
          ancestryOptionIsWrong = true;
          break;
        }
        if(t.name == 'Skill Expertise' && this.skillForExpertise_name == ''){
          this.isSkillExpertiseCorrect = false;
          ancestryOptionIsWrong = true;
          break;
        }
        if(t.name == 'Trade Expertise' && this.tradeForExpertise_name == ''){
          this.isTradeExpertiseCorrect = false;
          ancestryOptionIsWrong = true;
          break;
        }
      }
    }
    if(ancestryOptionIsWrong)
    {
      navigationPoint = 'ancestriesSection';
    }
    //check if trade points were spent
    if(this.model.tradePoints != 0){
      this.areTradePointsSpent = false;
      navigationPoint = 'tradesSection';
    }
    //check if skill points were spent
    if(this.model.skillPoints != 0){
      this.areSkillPointsSpent = false;
      navigationPoint = 'skillsSection';
    }
    //check if attribute points were spent
    if(this.model.attributePoints != 0){
      this.areAttributePointsSpent = false;
      navigationPoint = 'attributesSection';
    }
    //może metoda jakaś jak ta sprawdzająca skille...
    if(this.areAttributePointsSpent && this.areSkillPointsSpent && this.areTradePointsSpent &&
        this.areAncestriesChosen && this.areAncestryPointsSpent && this.model.isAttributeDecreaseCorrect &&
        this.model.isAttributeIncreaseCorrect && this.isSkillExpertiseCorrect && this.isTradeExpertiseCorrect &&
        this.isClassSelected && this.areClassOptionsSelected) {
      return true;
    }
    else {
      this.navigateToSection(navigationPoint);
      return false;
    }
    //move to the error highest up the page <- to jako ostatnie tu zaimplementuj
  }
  /*
  The following methods mark their related fields as right if the conditions
  are met and they were previously marked as wrong
  */
  validateName(){
    if(this.character.name != ''){
      this.isNameChosen = true;
    }
  }
  validateAttributes(){
    if(this.model.attributePoints == 0){
      this.areAttributePointsSpent = true;
    }
  }
  validateSkills(){
    if(this.model.skillPoints == 0){
      this.areSkillPointsSpent = true;
    }
  }
  validateTrades(){
    if(this.model.tradePoints == 0){
      this.areTradePointsSpent = true;
    }
  }
  validateAncestries(){
    if(this.getAncestriesChosenNumber() < 3 || 
      (this.model.allowLimitlessAncestries && this.getAncestriesChosenNumber() > 0)){
        this.areAncestriesChosen = true;
      }
  }
  validateAncestryTraits(){
    if(this.model.ancestryPoints == 0){
      this.areAncestryPointsSpent = true;
    }
  }
  /*
  Each trait that makes it so options need to be picked must be individually
  checked for. This method may need to be expanded by for example ancestry traits
  that allow to choose a spell or damage type for some effect
  */
  validateAncestryTraitOptions(){
    let ancestriesSelected = this.model.ancestries.filter(a=>a.selected);
    for(let a of ancestriesSelected){
      for(let t of a.traits){
        if(t.name == 'Attribute Increase' && t.selected && this.model.attributeForIncrease_name != ''){
          this.model.isAttributeIncreaseCorrect = true;
        }
        if(t.name == 'Attribute Decrease' && t.selected && this.model.attributeForDecrease_name != ''){
          this.model.isAttributeDecreaseCorrect = true
        }
        if(t.name == 'Skill Expertise' && t.selected && this.skillForExpertise_name != ''){
          this.isSkillExpertiseCorrect = true;
        }
        if(t.name == 'Trade Expertise' && t.selected && this.tradeForExpertise_name != ''){
          this.isTradeExpertiseCorrect = true;
        }
      }
    }
    if(this.model.isAttributeDecreaseCorrect && this.model.isAttributeIncreaseCorrect && this.isSkillExpertiseCorrect &&
        this.isTradeExpertiseCorrect){
      this.areAncestryTraitOptionsPicked = true;
    }
  }
  validateClass(){
    if(this.currentClass != undefined){
      this.isClassSelected == true;
    }
  }
  validateClassOptions(){
    let talentsWithOptions = this.currentClass?.talents.filter(t=>
      t.numberOfOptionsToChoose>0);
    let isEnoughOptionsSelected : boolean = true;
    if(talentsWithOptions != undefined){
      for(let talent of talentsWithOptions){
        let numberOfChosen = talent.options.filter(o=>o.selected).length;
        if(numberOfChosen != talent.numberOfOptionsToChoose){
          isEnoughOptionsSelected = false;
        }
      }
    }
    if(isEnoughOptionsSelected){
      this.areClassOptionsSelected = true;
    }
  }

  //Navigation
  sections = 
  [
    {display:'Attributes',name:'attributesSection'},
    {display:'Skills',name:'skillsSection'},
    {display:'Trades',name:'tradesSection'},
    {display:'Ancestries',name:'ancestriesSection'},
    {display:'Classes',name:'classSection'},
    {display:'Spells',name:'spellsSection'},
    {display:'Maneuvers',name:'maneuverSection'},
    {display:'Armor',name:'armorSection'},
    {display:'Finish',name:'finishSection'},
  ]
  navigateToSection(sectionId : string){
    this.router.navigateByUrl('create#'+sectionId)
  } 

  openSidenav(sidenav: any) {
    sidenav.open();
  }
  closeSidenav(sidenav: any) {
    sidenav.close();
  }
  

  ngOnInit(): void {
    this.character = this.characterCreated.character;
    this.http.get<any>('assets/ancestries.json').subscribe({
      next: (data) => {
        //this.model.ancestries = data.ancestries;
        console.log(this.model.ancestries);
      }
    });
    this.http.get<any>('assets/classes.json').subscribe(data => {
      this.classes = data.classes;
      console.log(this.classes);
    });
      this.http.get<any>('assets/armorProperties.json').subscribe(data => {
      this.armorProperties = data.armorProperties;
    });
      this.http.get<any>('assets/shieldProperties.json').subscribe(data => {
      this.shieldProperties = data.shieldProperties;
    });

  }
  ngOnDestroy(): void {
    this.subSkills.unsubscribe();
  }


  character: ICharacter = {
    id: "",
    name: "",
    level: 1,
    combatMastery: 1,
    attack: +4,
    dc: 14,
    speed: 5,
    healthPoints: 0,
    precisionDefense: 4,
    areaDefense: 4,
    characterClass: this.currentClass,
    mana: 1,
    stamina: 1,
    ancestries: [],
    prime: 3,
    attributes: [],
    skills: [],
    trades: [],
    features: this.features
  }; 
}
