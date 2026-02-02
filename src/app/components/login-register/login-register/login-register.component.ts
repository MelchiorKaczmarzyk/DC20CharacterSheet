import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { ExtraOptions, Router, RouterModule } from '@angular/router';



@Component({
  selector: 'app-login-register',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './login-register.component.html',
  styleUrl: './login-register.component.css'
})
export class LoginRegisterComponent {
  
  form!: FormGroup;
  auth = inject(Auth);

  constructor(private router: Router){
    this.initForm();
  }

  //auth instance
   
  errorMessage : string = '';


  initForm(){
    this.form = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    })
  }


  email : string = ''
  password: string = ''

  onSubmit(){

  }

  onLogin(){
    if(!this.form.invalid){
      signInWithEmailAndPassword(this.auth, this.form.value.email, this.form.value.password).
        then((responese) => {
            this.router.navigate(['/app/characterCollection']);
        })
        .catch((error) => {
          console.error('error', error);
          if(error instanceof Error){
            if(error.message.includes('auth/invalid-email')){
              this.errorMessage = "Email is not valid"
              this.form.get('email')?.setErrors({ invalidEmail: true });
              this.form.get('email')?.markAsTouched();
            }
            //check firebase error codes and add handling
            else if(false)
            {

            }
          }
        })
    }
    else{

    }

  }
  onRegister(){
    if(!this.form.invalid){
      createUserWithEmailAndPassword(this.auth, this.form.value.email, this.form.value.password).
        then((responese) => {
          this.onLogin();
        })
        .catch((error) => {
          console.error('error', error);
          if(error instanceof Error){
            if(error.message.includes('auth/invalid-email')){
              this.errorMessage = "Email is not valid"
              this.form.get('email')?.setErrors({ invalidEmail: true });
              this.form.get('email')?.markAsTouched();
            }
            //check firebase error codes and add handling
            else if(false)
            {

            }
          }
        })
    }
    else{
      
    }
  }
}
