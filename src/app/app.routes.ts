import { Routes } from '@angular/router';
import { CreateSheetComponent } from './components/create-sheet/create-sheet-component.component';
import { AppComponent } from './components/app/app.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { ViewCharacterComponent } from './components/view-character/view-character.component';
import { CharacterCollectionComponent } from './components/character-collection/character-collection.component';


export const routes: Routes = [
    { 
        path:'create',
        component: CreateSheetComponent
    },
    {
        path: '',
        component: AppComponent,
    },
    { 
        path:'viewCharacter',
        component: ViewCharacterComponent
    },
    {
        path: 'welcome',
        component: WelcomeComponent
    },
    {
        path: 'characterCollection',
        component: CharacterCollectionComponent
    },
    {
        path:'app/:appOutlet',
        component: AppComponent
    }
];
