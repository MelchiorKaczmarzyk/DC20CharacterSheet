import { Routes } from '@angular/router';
import { CreateSheetComponent } from './components/create-sheet/create-sheet-component.component';
import { AppComponent } from './components/app/app.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { ViewCharacterComponent } from './components/view-character/view-character.component';
import { CharacterCollectionComponent } from './components/character-collection/character-collection.component';
import { LoginRegisterComponent } from './components/login-register/login-register/login-register.component';


export const routes: Routes = [
    {
        path: '',
        component: AppComponent,
    },
    {
        path: 'loginregister',
        component: LoginRegisterComponent
    },
    { 
        path:'create',
        component: CreateSheetComponent
    },
    { 
        path:'viewCharacter/:id',
        component: ViewCharacterComponent
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
