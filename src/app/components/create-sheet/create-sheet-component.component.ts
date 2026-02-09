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
import { PrependSpace } from '../../pipes/prependSpace.pipe';
import { ITalent } from '../../interfaces/ITalent';
import { ICharacter } from '../../interfaces/ICharacter';
import { CharacterCreatedService } from '../../services/character-created.service';
import { ExtraOptions, Router, RouterModule } from '@angular/router';
import { ITalentOption } from '../../interfaces/ITalentOption';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import { SwipeDirective } from '../../directives/swipe.directive';
import {MatListModule} from '@angular/material/list';
import { IFeature } from '../../interfaces/IFeature';
import { CharacterClassesService } from '../../services/character-classes.service';
import { ArmorService } from '../../services/armor.service';
import { SkillsService } from '../../services/skills.service';
import { Subscription, switchMap } from 'rxjs';
import { CreateSheetModelService } from '../../services/create-sheet-model.service';
import { AncestriesService } from '../../services/ancestries.service';
import { IArmorProperty } from '../../interfaces/IArmorProperty';
import { IArmorPropertySelection } from '../../interfaces/IArmorPropertySelection';
import { IArmorPropertyOption } from '../../interfaces/IArmorPropertyOption';
import { PreventDefaultCheckDirective } from '../../directives/preventDefaultCheck.directive';
import { IManeuver } from '../../interfaces/IManeuver';
import { ManeuverService } from '../../services/maneuver.service';
import { SpellService } from '../../services/spell.service';
import { ISpell } from '../../interfaces/ISpell';
import { CharactersService } from '../../services/characters.service';
import { FeaturesService } from '../../services/features-service.service';

@Component({
  selector: 'app-create-sheet',
  standalone: true,
  imports: [MatButtonModule, MatRadioModule, MatInputModule, MatFormFieldModule, MatIconModule,
    MatCheckboxModule, MatExpansionModule, MatOption, MatSelectModule, FormsModule, MatSidenavModule,
    MatToolbarModule, MatListModule,
    CommonModule, HttpClientModule, PrependSpace, SwipeDirective, PreventDefaultCheckDirective],
  templateUrl: './create-sheet.component.html',
  styleUrls: ['./create-sheet.component.css'],
})

export class CreateSheetComponent implements OnInit, OnDestroy {

  constructor(private http: HttpClient, private router: Router, 
    private characterCreated: CharacterCreatedService, private classService: CharacterClassesService,
    private armorService: ArmorService, private skillsService: SkillsService,
    private ancestryService: AncestriesService,
    private dataModel: CreateSheetModelService,
    private maneuverService: ManeuverService,
    private spellService: SpellService,
    private featureService: FeaturesService){
    }
  model = this.dataModel.data;
  //ATRIBUTES
  increaseAttribute(attribute: IAttribute){
    if(attribute.value < attribute.ceiling && this.model.attributePoints > 0){
      attribute.value += 1;
      this.areAttributePointsSpent = true;
    }
  }
  decreaseAttribute(attribute: IAttribute){
    if(attribute.value > attribute.floor && this.model.attributePoints < 13 && this.model.attributePoints!=-1){
      attribute.value -= 1;
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
    this.areAttributePointsSpent = true;
  }
  //SKILLS
  subSkills = new Subscription();
  getSkill(name: string) : ISkill{
    return this.model.skills.find(s=>s.name==name) ?? {name:"",attribute:",",level:0, levelCap:0}
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
    else if(isLevel2 && skill==this.model.skillWhereBoughtAdept){
      this.model.skillPointSpent -= 2;
      skill.level = 1;
    }
    else{
      event.preventDefault();
    }
    this.areSkillPointsSpent = true;
  }
  onAdeptClicked(skillName: string, event: MouseEvent){
    const skill: ISkill = this.getSkill(skillName);
    const isLevel0 = skill.level == 0;
    const isLevel1 = skill.level == 1;
    const isLevel2 = skill.level == 2;

    if(isLevel0 && this.model.skillPoints >= 3 && this.model.skillAdeptNumber < this.model.skillAdeptNumberMax){
      this.model.skillPointSpent += this.model.skillAdeptCost;
      skill.level = 2;
    }
    else if(isLevel0 && !(this.model.skillPoints >= 3)){
      skill.level = 0;
    }
    else if(isLevel1 && this.model.skillPoints >= 2 && this.model.skillAdeptNumber < this.model.skillAdeptNumberMax){
      this.model.skillPointSpent += this.model.skillAdeptCost-1;
      skill.level = 2;
    }
    else if(isLevel1 && !(this.model.skillPoints >= 2)){
      skill.level = 1;
    }
    else if(isLevel2 && !this.model.skillForExpertise){
      this.model.skillPointSpent -= this.model.skillAdeptCost;
      skill.level = 0;
    }
    else{
      event.preventDefault();
    }
    this.areSkillPointsSpent = true;
  }

  getTrade(name: string) : ITrade{
    return this.model.trades.find(t=>t.name==name) ?? {name:"",level:0};
  }

  onNoviceTradeClicked(tradeName: string, event: MouseEvent){
    const trade: ITrade = this.getTrade(tradeName);
    const enoughTradePoints = this.model.tradePoints > 0;
    const isLevel0 = trade.level == 0;
    const isLevel1 = trade.level == 1;
    const isLevel2 = trade.level == 2;
    if(isLevel0 && enoughTradePoints && trade.name != ""){
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
    else {
      event.preventDefault();
    }
    this.areTradePointsSpent = true;
  }
  onAdeptTradeClicked(tradeName: string, event: MouseEvent){
    event.preventDefault();
  }

//ANCESTRIES
  onAncestryChosen(ancestry: IAncestry, event: Event, panel: any) {
  let copyOfAncestrySelected = ancestry.selected;
  if (this.model.ancestriesChosenNumber > 2 && !this.model.allowLimitlessAncestries) {
    ancestry.selected = false;
  } 
  else if (copyOfAncestrySelected) {
    panel.close();
    let zeroCostTrait = ancestry.traits.find(t => t.cost == 0);
    if (zeroCostTrait && this.allow0CostSelection(ancestry)) {
      zeroCostTrait.selected = true;
      this.ancestryService.onTraitSelected(this.model,ancestry,zeroCostTrait);
    }
    //reverting the element to its normal style after it was marked as being in wrong state
    this.validateAncestries();
  } 
  else if (!copyOfAncestrySelected) {
    panel.open();
    for (let trait of ancestry.traits) {
      if (trait.selected) {
        this.ancestryService.revertTrait(this.model,ancestry,trait);
        }
      trait.selected = false;
      }
    }
    this.areAncestriesChosen = true;
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
      this.ancestryService.onTraitSelected(this.model, ancestry, trait)
      this.ancestryService.recalculateOptions(this.model, trait);
    }
    else if(trait.selected && !enoughAncestryPoints){
      trait.selected = false;
    }
    else if(!trait.selected){
      this.ancestryService.revertTrait(this.model, ancestry, trait)
    }
    this.areAncestryPointsSpent = true;
    
  }
  onOpenedChange(trait: IAncestryTrait){
    this.ancestryService.recalculateOptions(this.model, trait)
  }
  onTraitOptionChosen(trait : IAncestryTrait, option: string){
    this.ancestryService.onOptionSelected(this.model, trait, option);
    this.areAncestryTraitOptionsPicked = true;
  }

  //CLASS
  onClassChosen(classChosen: IClass, panel: any){
    //ensure the proper behaviour of the dropdown panel
    if(classChosen.selected){
      //for some reason the condition for closing appear to be backwards
      panel.close();
      this.model.currentClass = classChosen;
      this.classService.onClassSelected(this.model, classChosen);
      if(this.model.previousClass != undefined)
        this.classService.revertClass(this.model, this.model.previousClass);
      this.model.previousClass = classChosen;
    }
    else if (!classChosen.selected) {
      //for some reason the condition for closing appear to be backwards
      panel.open();
      this.model.currentClass = undefined;
      this.model.previousClass = undefined;
      this.classService.revertClass(this.model, classChosen);
    }
    this.resetArmorOptions();
    this.resetShieldOptins();
    this.resetManeuvers();
    //reverting the element to its normal style after it was marked as being in wrong state
    this.isClassSelected = true;
  }
 
  onTalentOptionChosen(c: IClass, talent: ITalent, option: ITalentOption) {
    //does not allow the user to choose more options than specified in the talent.numberOfOptionsToChoose
    if(talent.numberOfOptionsToChoose == talent.options.filter(o=>o.selected).length){
      option.selected = false;
    }
    if(option.selected)
    {
      this.classService.onClassTalentOptionSelected(this.model, c, talent, option);
    }
    else {
      this.classService.revertClassTalentOptionSelected(this.model, c, talent, option)
    }
    //reverting the element to its normal style after it was marked as being in wrong state
    this.areClassOptionsSelected = true;
  }

  //MANEUVERS
  resetManeuvers(){
    for(let m of this.model.maneuvers){
      if(m.selected == true){
        this.maneuverService.reverManeuverSelection(this.model, m);
        m.selected = false;
      }
    }
    this.areManeuversSelected = true;
  }
  onManeuverChosen(maneuver : IManeuver, panel:any){
    //ensure the proper behaviour of the dropdown panel
    if(maneuver.selected){
      //for some reason the condition for closing appear to be backwards
      panel.close();
      this.maneuverService.onManeuverSelected(this.model, maneuver);
    }
    else if (!maneuver.selected) {
      //for some reason the condition for closing appear to be backwards
      panel.open();
      this.maneuverService.reverManeuverSelection(this.model, maneuver);
    }
    this.areManeuversSelected = true;
  }

  resetSpells(){
    for(let s of this.model.spells){
      if(s.selected == true){
        this.spellService.revertSpellSelection(this.model, s);
        s.selected = false;
      }
    }
    for(let c of this.model.cantrips){
      if(c.selected == true){
        this.spellService.revertCantripSelection(this.model, c);
        c.selected = false;
      }
    }
    this.areCantripsSelected = true;
  }
  onCantripChosen(cantrip : ISpell, panel:any){
    //ensure the proper behaviour of the dropdown panel
    if(cantrip.selected && this.model.cantripPoints > 0){
      //for some reason the condition for closing appear to be backwards
      panel.close();
      this.spellService.onCantripSelected(this.model, cantrip);
    }
    else if (!cantrip.selected) {
      //for some reason the condition for closing appear to be backwards
      panel.open();
      this.spellService.revertCantripSelection(this.model, cantrip);
    }
    this.areManeuversSelected = true;
  }
  onSpellChosen(spell : ISpell, panel:any){
    //ensure the proper behaviour of the dropdown panel
    if(spell.selected && this.model.spellPoints > 0){
      //for some reason the condition for closing appear to be backwards
      panel.close();
      this.spellService.onSpellSelected(this.model, spell);
    }
    else if (!spell.selected) {
      //for some reason the condition for closing appear to be backwards
      panel.open();
      this.spellService.revertSpellSelection(this.model, spell);
    }
    this.areManeuversSelected = true;
  }

  //ARMOR
  resetArmorOptions(){
    this.model.isWearingArmor = false;
    this.model.selectedArmorType = "Light";
    for(let property of this.model.armorProperties){
      for(let option of property.options){
        if(option.selected){
          this.armorService.revertArmorChosen(this.model,property,option, "armor");
          option.selected = false;
        }
      }
    }
    this.areArmorPropertiesSelected = true;
    this.areArmorPropertyOptionsSelected = true;
  }
  resetShieldOptins(){
    this.model.isWearingShield = false;
    this.model.selectedArmorType = "Light";
    for(let property of this.model.shieldProperties){
      for(let option of property.options){
        if(option.selected){
        this.armorService.revertArmorChosen(this.model,property,option,'shield');
        option.selected = false;
        }
      }
    }
    this.areShieldPropertiesSelected = true;
    this.areShieldPropertyOptionsSelected = true;
  }
  
  isArmorOptionSelected(name : string) : boolean{
    for(let ap of this.model.armorProperties){
      let result = ap.options.find(o => ap.name==name && o.selected);
      if(result != undefined){
        return true;
      }
    }
    return false;
  }
  isShieldOptionSelected(name : string){
    for(let ap of this.model.shieldProperties){
      let result = ap.options.find(o => ap.name==name && o.selected);
      if(result != undefined){
        return true;
      }
    }
    return false;
  }
  onArmorSelectionChange(selection : IArmorPropertySelection, eventValue : string){
    this.armorService.onArmorSelectionChosen(this.model, selection, eventValue);
    this.areArmorPropertiesSelected = true;
    this.areArmorPropertyOptionsSelected = true;
  }
  onArmorDon(panel:any){
    this.areArmorPropertiesSelected = true;
    this.areArmorPropertyOptionsSelected = true;
    //ensure the proper behaviour of the dropdown panel
    if(this.model.isWearingArmor){
      //for some reason the condition for closing appear to be backwards
      panel.close();
    }
    else if (!this.model.isWearingArmor) {
      //for some reason the condition for closing appear to be backwards
      panel.open();
      this.resetArmorOptions();
    }
    //class needs to be chosen first
    if(this.model.currentClass == undefined){
      this.model.isWearingArmor = false;
      this.resetArmorOptions();
    }
    this.areArmorPropertiesSelected = true;
    this.areArmorPropertyOptionsSelected = true;
  }
  onShieldDon(panel:any){
    this.areShieldPropertiesSelected = true;
    this.areShieldPropertyOptionsSelected = true;
    //ensure the proper behaviour of the dropdown panel
    if(this.model.isWearingShield){
      //for some reason the condition for closing appear to be backwards
      panel.close();
    }
    else if (!this.model.isWearingShield) {
      //for some reason the condition for closing appear to be backwards
      panel.open();
      this.resetShieldOptins();
    }
    if(this.model.currentClass == undefined){
      this.model.isWearingShield = false;
      this.resetShieldOptins();
    }
    this.areShieldPropertiesSelected = true;
    this.areShieldPropertyOptionsSelected = true;
  }
  get legalArmorProperties():any[] {
    if(this.model.selectedArmorType == 'Light'){
      return this.model.armorProperties.filter(p=>p.forLight);
    }
    if(this.model.selectedArmorType == 'Heavy'){
      return this.model.armorProperties.filter(p=>p.forHeavy);
    }
    else return [];
  }
  get legalShieldProperties():any[] {
    if(this.model.selectedShieldType == 'Light'){
      return this.model.shieldProperties.filter(p=>p.forLight);
    }
    if(this.model.selectedShieldType == 'Heavy'){
      return this.model.shieldProperties.filter(p=>p.forHeavy);
    }
    else return [];
  }
  onArmorOptionClicked(armorOption:IArmorPropertyOption, options:IArmorPropertyOption[], 
    armorProperty:IArmorProperty){
    let isSelected = armorOption.selected == true;
    let enoughPoints = armorOption.cost <= this.model.armorPoints;
    let previousLevelIsChecked = (armorOption.level > 1 && options[armorOption.level-2].selected) ||
      armorOption.level == 1;
    let isWearingArmor = this.model.isWearingArmor;
    
    if(!isSelected && enoughPoints && previousLevelIsChecked && isWearingArmor){
      armorOption.selected = true;
      this.armorService.onArmorOptionChosen(this.model, armorProperty, armorOption, 'armor');
    }
    else {
      if(isSelected){
        this.armorService.revertArmorChosen(this.model, armorProperty, armorOption, 'armor');
      }
      armorOption.selected = false;
    }
    this.areArmorPropertyOptionsSelected = true;
  }
  onShieldOptionClicked(shieldOption:IArmorPropertyOption, options:IArmorPropertyOption[], 
    shieldProperty:IArmorProperty, ) {
    let isSelected = shieldOption.selected == true;
    let enoughPoints = shieldOption.cost <= this.model.shieldPoints;
    let previousLevelIsChecked = (shieldOption.level > 1 && options[shieldOption.level-2].selected) ||
      shieldOption.level == 1;
    let isWearingArmor = this.model.isWearingArmor;
    
    if(!isSelected && enoughPoints && previousLevelIsChecked && isWearingArmor){
      shieldOption.selected = true;
      this.armorService.onArmorOptionChosen(this.model, shieldProperty, shieldOption, 'shield');
    }
    else {
      if(isSelected){
        this.armorService.revertArmorChosen(this.model, shieldProperty, shieldOption, 'shield');
      }
      shieldOption.selected = false;
    }
    this.areShieldPropertyOptionsSelected = true;
  }
  createCharacter(){
    let features : IFeature[] = [];
    for(let a of this.model.ancestries){
      features = features.concat(this.featureService.makeFeaturesFromAncestry(a));
    }
    if(this.model.currentClass != undefined){
      features = features.concat(this.featureService.makeFeaturesFromClass(this.model.currentClass));
    }
    if(this.model.isWearingShield){
      features = features.concat(this.featureService.makeFeaturesFromShield(this.model.shieldProperties));
    }
    if(this.model.isWearingArmor){
      features = features.concat(this.featureService.makeFeaturesFromArmor(this.model.armorProperties));
    }
    let character :ICharacter = {
      uid: "",
      id: "",
      name: this.model.characterName,
      level: 1,
      combatMastery: 1,
      attack: 4,
      dc: 14,
      speed: this.model.speed,
      healthPoints: this.model.hp,
      precisionDefense: this.model.precisionDefense,
      areaDefense: this.model.areaDefense,
      characterClass: this.model.currentClass,
      mana: this.model.currentClass?.mana ?? 0,
      stamina: this.model.currentClass?.stamina ?? 0,
      ancestries: this.model.ancestries.filter(a=>a.selected==true),
      prime: 3,
      attributes: this.model.attributes,
      skills: this.model.skills,
      trades: this.model.trades,
      spells: this.model.spells.filter(s=>s.selected),
      maneuvers: this.model.maneuvers,
      features: features
    };
    this.characterCreated.character = character;
  }

  onFinishClicked() {
    if(this.validateFields()){
      this.createCharacter();
      console.log(this.characterCreated.character);
      this.router.navigate(['/app/viewCharacter']);
    }
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
  areManeuversSelected : boolean = true;
  areCantripsSelected : boolean = true;
  areSpellsSelected : boolean = true;
  areArmorPropertiesSelected : boolean = true;
  areArmorPropertyOptionsSelected : boolean = true;
  areShieldPropertiesSelected : boolean = true;
  areShieldPropertyOptionsSelected : boolean = true;
  navigationPoint : string = '';

  validateFields() : boolean {
    this.validateName();
    this.validateArmorOptions();
    this.validateArmorOptionSelections();
    this.validateShieldOptions();
    this.validateShieldOptionSelections();
    this.validateClass();
    this.validateClassOptions();
    this.validateAncestries();
    this.validateAncestryTraits(); 
    this.validateAncestryTraitOptions(); 
    this.validateTrades();
    this.validateSkills();
    this.validateAttributes();
    
    const areFieldsCorret = 
      this.isNameChosen &&
      this.areAttributePointsSpent &&
      this.areSkillPointsSpent &&
      this.areTradePointsSpent &&
      this.areAncestryPointsSpent &&
      this.areAncestriesChosen &&
      this.areAncestryTraitOptionsPicked &&
      this.isClassSelected &&
      this.areClassOptionsSelected &&
      this.areArmorPropertiesSelected &&
      this.areArmorPropertyOptionsSelected &&
      this.areShieldPropertiesSelected &&
      this.areShieldPropertyOptionsSelected

    if(areFieldsCorret){
      return true;
    }
    else {
      this.navigateToSection(this.navigationPoint);
      return false;
    }
    
  }
  validateName() : boolean{
    if(this.model.characterName != ''){
      this.isNameChosen = true;
    }
    else{
      this.isNameChosen = false;
      this.navigationPoint = 'finishSection';
    }
    return this.isNameChosen;
  }
  validateAttributes() : boolean{
    if(this.model.attributePoints <= 0){
      this.areAttributePointsSpent = true;
    }
    else{
      this.areAttributePointsSpent = false
      this.navigationPoint = 'attributesSection';
    }
    return this.areAttributePointsSpent;
  }
  validateSkills(){
    if(this.model.skillPoints == 0){
      this.areSkillPointsSpent = true;
    }
    else{
      this.areSkillPointsSpent = false;
      this.navigationPoint = 'skillSection';
    }
    return this.areSkillPointsSpent;
  }
  validateTrades() : boolean{
    if(this.model.tradePoints == 0){
      this.areTradePointsSpent = true;
    }
    else{
      this.areTradePointsSpent = false;
      this.navigationPoint = 'tradesSection';
    }
    return this.areTradePointsSpent;
  }
  validateAncestries() : boolean{
    if(this.model.ancestriesChosenNumber > 0 || 
      (this.model.allowLimitlessAncestries && this.model.ancestriesChosenNumber > 0)){
        this.areAncestriesChosen = true;
      }
    else{
      this.areAncestriesChosen = false;
      this.navigationPoint = 'ancestriesSection';
    }
      return this.areAncestriesChosen;
  }
  validateAncestryTraits() : boolean{
    if(this.model.ancestryPoints == 0){
      this.areAncestryPointsSpent = true;
    }
    else{
      this.areAncestryPointsSpent = false;
      this.navigationPoint = 'ancestriesSection';
    }
    return this.areAncestryPointsSpent;
  }
  validateAncestryTraitOptions(): boolean{
    let selectedAncestriesWithTraits = this.model.ancestries.filter(a=>a.selected==true && 
      a.traits.length>0);
    if(selectedAncestriesWithTraits.length != 0){
      for(let a of selectedAncestriesWithTraits){
        for(let t of a.traits){
          let hasOptions = t.options.length != 0;
          this.areAncestryTraitOptionsPicked = t.optionSelected != '';
          if(hasOptions && !this.areAncestryTraitOptionsPicked){
            this.navigationPoint='ancestriesSection';
            this.areAncestryTraitOptionsPicked = false;
            return false;
          }
        }
      }
    }
    this.areAncestryTraitOptionsPicked = true;
    return true;
  }
  validateClass() : boolean{
    if(this.model.currentClass != undefined){
      this.isClassSelected == true;
    }
    else{
      this.isClassSelected = false;
      this.navigationPoint = 'classSection';
    }
    return this.isClassSelected;
  }
  validateClassOptions() : boolean{
    let talentsWithOptions = this.model.currentClass?.talents.filter(t=>
      t.numberOfOptionsToChoose>0);
    let isEnoughOptionsSelected : boolean = true;
    if(talentsWithOptions != undefined){
      for(let talent of talentsWithOptions){
        let numberOfChosen = talent.options.filter(o=>o.selected).length;
        if(numberOfChosen != talent.numberOfOptionsToChoose){
          this.navigationPoint='classSection';
          this.areClassOptionsSelected = false;
          return false;
        }
      }
    }
    this.areClassOptionsSelected = true;
    return true
  }
  validateManeuvers() : boolean{
    if(this.model.currentClass != undefined &&
       this.model.currentClass.stamina>0 &&
       this.model.maneuverPoints > 0){
        this.areManeuversSelected = false;
        return false;
    }
    else return true;
  }
  validateCantrips() : boolean{
    if(this.model.currentClass != undefined &&
       this.model.currentClass.mana>0 &&
       this.model.cantripPoints > 0){
       this.areCantripsSelected = false;
        return false;
    }
    else return true;
  }
  validateSpells() : boolean{
    if(this.model.currentClass != undefined &&
       this.model.currentClass.mana>0 &&
       this.model.spellPoints > 0){
       this.areSpellsSelected = false;
        return false;
    }
    else return true;
  }
  validateArmorOptions() : boolean{
    if(this.model.isWearingArmor && this.model.armorPoints != 0){
      this.areArmorPropertiesSelected = false;
    }
    else{
      this.areArmorPropertiesSelected = true;
      this.navigationPoint = 'armorSection';
    }
    return this.areArmorPropertiesSelected;
  }
  validateArmorOptionSelections() : boolean{
    let armorPropertiesSelected = this.model.armorProperties.filter(p=>p.options.some(o=>o.selected));
    let armorPropertiesSelectedWithOptions = armorPropertiesSelected.filter(p=>p.selection.selections.length>0);
    if(armorPropertiesSelectedWithOptions.length == 0){
      this.areArmorPropertyOptionsSelected = true;
      return true;
    }
    else{
      for(let p of armorPropertiesSelectedWithOptions){
        this.areArmorPropertyOptionsSelected = p.selection.selectionName != '';
        if(!this.areArmorPropertyOptionsSelected){
          this.navigationPoint='armorSection';
          this.areArmorPropertyOptionsSelected = false;
          return false;
        }
      }
    }
    this.areArmorPropertyOptionsSelected = true;
    return true;
  }
  validateShieldOptions() : boolean{
    if(this.model.isWearingShield && this.model.shieldPoints != 0){
      this.areShieldPropertiesSelected = false;
    }
    else{
      this.navigationPoint = 'armorSection';
    }
    return this.areShieldPropertiesSelected
  }
  validateShieldOptionSelections() : boolean{
    let shieldPropertiesSelected = this.model.shieldProperties.filter(p=>p.options.some(o=>o.selected));
    let shieldPropertiesSelectedWithOptions = shieldPropertiesSelected.filter(p=>p.selection.selections.length>0);
    if(shieldPropertiesSelectedWithOptions.length == 0){
      this.areShieldPropertyOptionsSelected = true;
      return true;
    }
    else{
      for(let p of shieldPropertiesSelectedWithOptions){
        this.areShieldPropertyOptionsSelected = p.selection.selectionName != '';
        if(!this.areShieldPropertyOptionsSelected){
          this.navigationPoint='armorSection';
          this.areShieldPropertyOptionsSelected = false;
          return false;
        }
      }
    }
    this.areShieldPropertyOptionsSelected = true;
    return true;
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
    {display:'Maneuvers',name:'maneuversSection'},
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
    if(this.model.ancestries.length == 0){
    this.http.get<any>("https://dc20cs-default-rtdb.europe-west1.firebasedatabase.app/ancestries.json").subscribe({
      next: (data) => {
        console.log(data);
        this.model.ancestries = data;
      }
    });
  }

    if(this.model.classes.length == 0){
    this.http.get<any>('https://dc20cs-default-rtdb.europe-west1.firebasedatabase.app/classes.json').subscribe(data => {
      this.model.classes = data;
    });
  }

    if(this.model.armorProperties.length == 0){
    this.http.get<any>('https://dc20cs-default-rtdb.europe-west1.firebasedatabase.app/armourProperties.json').subscribe(data => {
      this.model.armorProperties = data;
    });
  }

    if(this.model.shieldProperties.length == 0){
    this.http.get<any>('https://dc20cs-default-rtdb.europe-west1.firebasedatabase.app/shieldProperties.json').subscribe(data => {
      this.model.shieldProperties = data;
    });
  }

    if(this.model.maneuvers.length == 0){
    this.http.get<any>('https://dc20cs-default-rtdb.europe-west1.firebasedatabase.app/maneuvers.json').subscribe(data => {
      this.model.maneuvers = data;
    });
  }

    let spells : ISpell[] = [];
    if(this.model.spells.length == 0 || this.model.cantrips.length == 0){
    this.http.get<any>('https://dc20cs-default-rtdb.europe-west1.firebasedatabase.app/spells.json').subscribe({
      next: (data) => {
        spells = data;
      },
      complete : () => {
        this.model.spells = spells
      }
    });
  }

  }
  ngOnDestroy(): void {
    this.subSkills.unsubscribe();
  }


  character: ICharacter = {
    uid: "",
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
    characterClass: this.model.currentClass,
    mana: 1,
    stamina: 1,
    ancestries: [],
    prime: 3,
    attributes: [],
    skills: [],
    trades: [],
    spells: [],
    maneuvers: [],
    features: []
  }; 
}
