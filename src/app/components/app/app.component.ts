import { Component, input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  
  constructor(private router: Router, private route: ActivatedRoute) {}

  //To jest jakiś spaghetti code chyba
  ngOnInit(): void {
    let outletComponentName : String | null = this.route.snapshot.paramMap.get('appOutlet');
    if (outletComponentName == null){
      this.router.navigate(['/loginregister']);
    }
    if (outletComponentName == 'welcome'){
      this.router.navigate(['/welcome']);
    }
    if (outletComponentName == 'create') {
      this.router.navigate(['/create']);
    }
    if(outletComponentName == 'viewCharacter'){
      this.router.navigate(['/viewCharacter'])
    }
    if(outletComponentName == 'characterCollection'){
      this.router.navigate(['/characterCollection'])
    }
  }
}
