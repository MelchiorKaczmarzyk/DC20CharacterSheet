import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {
  constructor(private router: Router) {}
  
  onCreatePicked() {
    this.router.navigate(['/app/create']);
  }
}
