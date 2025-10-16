import { MatInputModule } from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule, MatIconRegistry} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatRadioModule} from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatOption } from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import { ICharacter } from '../../interfaces/ICharacter';
import { CharacterCreatedService } from '../../services/character-created.service';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import { SwipeDirective } from '../../directives/swipe-directive';
import {MatListModule} from '@angular/material/list';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {MatTableModule} from '@angular/material/table';
import {FormsModule } from '@angular/forms';
import {  Subscription } from 'rxjs';
import { ISkill } from '../../interfaces/ISkill';
import { ITrade } from '../../interfaces/ITrade';
import {  Router } from '@angular/router';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-character',
  standalone: true,
  imports: [MatButtonModule, MatRadioModule, MatInputModule, MatFormFieldModule, MatIconModule,
      MatCheckboxModule, MatExpansionModule, MatSelectModule, MatSidenavModule, MatTableModule,
      MatToolbarModule, MatListModule, CommonModule, HttpClientModule, SwipeDirective, FormsModule,
      MatSnackBarModule],
  templateUrl: './view-character.component.html',
  styleUrl: './view-character.component.css'
})
export class ViewCharacterComponent implements OnInit, OnDestroy {
  constructor(private characterCreated: CharacterCreatedService, private iconRegistry: MatIconRegistry,
    private router: Router, private http: HttpClient
  ){
    iconRegistry.setDefaultFontSetClass('material-symbols-outlined');
  }
  private _snackBar = inject(MatSnackBar);
  openSnackBar(message: string, action: string, duration: number) {
    this._snackBar.open(message, action, {duration:duration});
  }

  character : ICharacter = {
    id: "",
    name: "",
    characterClass: undefined,
    healthPoints: 0,
    mana: 0,
    stamina: 0,
    level: 0,
    combatMastery: 0,
    precisionDefense: 0,
    areaDefense: 0,
    attack: 0,
    dc: 0,
    prime: 3,
    attributes: [],
    ancestries: [],
    skills: [],
    trades: [],
    features: [],
    speed: 0
  };
  statsTableDataSource : any[] = []
  combatStatsColumnNames: string[] = ['Attack', 'Save DC', 'Combat Mastery', 'Speed '];
  skillsColumnNames: string[] = ['Skill', 'Attribute', 'Total Modifier'];
  tradesColumnNames: string[] = ['Trade', 'Trade Modifier']
  sections: string[] = [
    'Combat', 'Attributes', 'Skills&Trades','Actions', 'Maneuvers', 'Spells', 'Features', 'Class', 'Ancestry', 
    'Finish'
  ]
  getAttributeScoreForSkill(skill: ISkill) : number{
    let attribute = this.character.attributes.find(a=>a.name==skill.attribute);
    if(attribute!= undefined)
    {
      return attribute.value;
    }
    else return this.character.prime;
  }

  get skillsTrained() : ISkill[] {
    return this.character.skills.filter(s=>s.level>0);
  }
  
  get tradesTrained() : ITrade[] {
    return this.character.trades.filter(t=>t.name!='');
  }

  formatSkillModifier(skill: ISkill) : string{
    let modifier = skill.level*2 + this.getAttributeScoreForSkill(skill);    
    return modifier.toString();
  }

  formatTradeModifier(trade: ITrade) : string {
    let modifier = trade.level*2;
    return modifier.toString();
  }

  navigateToSection(sectionId : string){
    this.router.navigateByUrl('viewCharacter#'+sectionId);
  } 
  openSidenav(sidenav: any) {
    sidenav.open();
  }
  closeSidenav(sidenav: any) {
    sidenav.close();
  }

  onBackClicked()
  {
    this.router.navigate(['/app/create']);
  }

  urlCharacter = 'https://dc20cs-default-rtdb.europe-west1.firebasedatabase.app/characters.json'
  subCharacter = new Subscription();
  onDoneClicked() {
    //navigate to the collection view (display if the character was or wasn't uploaded successfully)
    
    this.subCharacter = this.http.post(this.urlCharacter, this.character).subscribe({
      error: () => {
        this.openSnackBar('Failed to create character', 'Close',1500);
      },
      complete: () => {
        this.router.navigate(['/app/characterCollection']);
      }
    })
  }

  ngOnInit(): void {
    //this.icons.setDefaultFontSetClass();
    console.log(this.characterCreated.character);
    this.character = this.characterCreated.character;
    this.statsTableDataSource = [{
      attack: this.character?.attack,
      saveDc: this.character?.dc,
      combatMastery: this.character?.combatMastery,
      speed: this.character?.speed
    }]
  }

  ngOnDestroy(): void {
   this.subCharacter.unsubscribe(); 
  }
}
