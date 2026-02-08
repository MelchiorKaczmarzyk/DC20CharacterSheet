import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, model, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import { ICharacter } from '../../interfaces/ICharacter';
import { Subscription } from 'rxjs';
import { CharactersService } from '../../services/characters.service';
import { Router } from '@angular/router';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { DeleteDialogComponent, DeleteDialogData } from './delete-dialog/delete-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { signOut } from 'firebase/auth';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-character-collection',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatCardModule, MatDialogModule, CommonModule, HttpClientModule],
  templateUrl: './character-collection.component.html',
  styleUrl: './character-collection.component.css'
})
export class CharacterCollectionComponent implements OnInit, OnDestroy {
  constructor(private charactersService: CharactersService, private iconRegistry: MatIconRegistry,
    private router: Router, private http: HttpClient, private dialog: MatDialog, private authService: AuthService)
  {
    iconRegistry.setDefaultFontSetClass('material-symbols-outlined');
  }

  subGetCharacters = new Subscription();
  characters : ICharacter[] = [];

  goToLvlUp(character : ICharacter){

  }

  goToCreateCharacter() {
    this.router.navigate(['/app/create']);
  }

  urlDeleteCharacter = "https://dc20cs-default-rtdb.europe-west1.firebasedatabase.app/characters"
  subDeleteCharacter = new Subscription();
  onDeleteCharacter(character: ICharacter){
    const dialogRef = this.dialog.open<DeleteDialogComponent, DeleteDialogData, boolean>(
      DeleteDialogComponent,
      {
        data: { message: character.name } // pass data
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // User clicked Delete
        this.http.delete(this.urlDeleteCharacter+'/'+character.id+'.json').subscribe({
          error: () => {
            this.openSnackBar('Failed to delete the character', 'Close',1500);
          },
          complete: () => {
            this.characters = this.characters.filter(c=>c.id != character.id);
          }
        })
      } else {
        // User clicked Cancel (or dismissed)
        console.log('Delete canceled');
      }
    });
  }

  viewCharacter(character: ICharacter){
    console.log(character.id);
    this.router.navigate(['/viewCharacter', character.id]);
  }

  private _snackBar = inject(MatSnackBar);
  openSnackBar(message: string, action: string, duration: number) {
    this._snackBar.open(message, action, {duration:duration});
  }

  logout() {
    this.authService.logout()
      .then(() => {
        this.router.navigate(['/loginregister']);
      })
      .catch(err => console.error(err));
  }

  failedToGetCharacters : boolean = false;
  userName: string = '';
  ngOnInit(): void {
    let currentUser: any
    this.authService.user.subscribe(user => {
      if (user) {
        console.log('Logged in user:', user.uid, user.email);
        currentUser = user;
        this.userName = currentUser.email?.split('@')[0] ?? "";

    } else {
      console.log('Not logged in');
    }
    })
    this.subGetCharacters = this.charactersService.getCharacters().subscribe({
      next: characters => {
        if(currentUser.uid = 'rzfvl5RKMPUBM7vbXIhdWOnK1BJ2'){
          this.characters = characters;
        }
        else {
          this.characters = characters.filter(c=>c.uid==currentUser.uid);
        }
      },
      error: () => {
        this.failedToGetCharacters = true;
      },
      complete: () => {
        this.failedToGetCharacters = false;
        console.log(this.characters);
      }
    })
  }

  ngOnDestroy(): void {
    this.subGetCharacters.unsubscribe()
    this.subDeleteCharacter.unsubscribe();
  }

}
