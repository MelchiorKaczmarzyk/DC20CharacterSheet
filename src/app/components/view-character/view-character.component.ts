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
import { SwipeDirective } from '../../directives/swipe.directive';
import {MatListModule} from '@angular/material/list';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {MatTableModule} from '@angular/material/table';
import {FormsModule } from '@angular/forms';
import {  Subscription } from 'rxjs';
import { ISkill } from '../../interfaces/ISkill';
import { ITrade } from '../../interfaces/ITrade';
import {  ActivatedRoute, Router } from '@angular/router';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { IFeature } from '../../interfaces/IFeature';
import { CharactersService } from '../../services/characters.service';
import { AuthService } from '../../services/auth.service';

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
  constructor(private characterCreated: CharacterCreatedService, private iconRegistry: MatIconRegistry, private charactersService: CharactersService,
    private router: Router, private http: HttpClient, private route: ActivatedRoute, private authService: AuthService
  ){
    iconRegistry.setDefaultFontSetClass('material-symbols-outlined');
  }
  private _snackBar = inject(MatSnackBar);
  openSnackBar(message: string, action: string, duration: number) {
    this._snackBar.open(message, action, {duration:duration});
  }

  character : ICharacter = {
    uid:"",
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
    spells:[],
    maneuvers:[],
    speed: 0
  };
  statsTableDataSource : any[] = []
  combatStatsColumnNames: string[] = ['Attack', 'Save DC', 'Combat Mastery', 'Speed '];
  skillsColumnNames: string[] = ['Skill', 'Attribute', 'Total Modifier'];
  tradesColumnNames: string[] = ['Trade', 'Trade Modifier']
  sections: string[] = [
    'Combat', 'Attributes', 'Skills&Trades', 'Maneuvers', 'Spells', 'Class', 'Ancestry','Armor', 
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

  toCreate()
  {
    this.router.navigate(['/app/create']);
  }
  
  toCollection()
  {
    this.router.navigate(['/app/characterCollection']);
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

  classFeatures : IFeature[] = [];
  filterClassFeatures(){
    this.classFeatures = this.character.features.filter(f=>f.section=='Class');
  }

  ancestryFeatures : IFeature[] = [];
  fitlerAncestryFeatures(){
    this.ancestryFeatures = this.character.features.filter(f=>f.section=='Ancestry');
  }

  armorFeatures : IFeature[] = [];
  filterArmorFeatures(){
    this.armorFeatures = this.character.features.filter(f=>f.section=='Armor' || f.section=='Shield');
    console.log(this.armorFeatures);
  }

  filterFeatures(){
    this.filterClassFeatures();
    this.fitlerAncestryFeatures();
    this.filterArmorFeatures();
  }
  cameFromCharacterCollection : boolean = false;
  characterId : string = ''
  characterUid: string = ''
  ngOnInit(): void {
    this.characterId = this.route.snapshot.paramMap.get('id')!;
    console.log(this.characterId);
    if(this.characterId == null){
      this.character = this.characterCreated.character;
      this.cameFromCharacterCollection = false;
    }
    else{
      this.cameFromCharacterCollection = true;

      let retrievedCharacters : ICharacter[] = [];
      this.charactersService.getCharacters().subscribe({
        error: () => {
            this.openSnackBar('Failed to load the character', 'Close',1500);
          },
          next: (data : any) => {
            retrievedCharacters = data;
          },
          complete: () => {
            let limbo = retrievedCharacters.find(c=>c.id==this.characterId);
            if(limbo != undefined){
              this.character = limbo;
            }
            this.filterFeatures();
          }
      });
    }
    this.statsTableDataSource = [{
      attack: this.character?.attack,
      saveDc: this.character?.dc,
      combatMastery: this.character?.combatMastery,
      speed: this.character?.speed
    }]
    this.authService.user.subscribe(user => {
      if (user) {
        this.character.uid = user.uid;
        console.log(this.character.uid);

    } else {
      console.log('Not logged in');
    }
    })
  }

  ngOnDestroy(): void {
   this.subCharacter.unsubscribe(); 
  }
}
