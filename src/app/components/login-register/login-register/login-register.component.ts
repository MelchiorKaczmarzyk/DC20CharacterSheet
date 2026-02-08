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

  errorMessagePassword: string = ''
  errorMessageEmail: string = ''


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
  checkErrors(error: any){
    console.error('error', error);
          console.error('Firebase Auth Error:', error);

          switch (error.code) {

    /* =======================
       EMAIL ERRORS
    ======================== */

    case 'auth/invalid-email':
      this.errorMessageEmail = 'Email address is not valid.';
      this.form.get('email')?.setErrors({ invalidEmail: true });
      break;

    case 'auth/user-not-found':
      this.errorMessageEmail = 'No account found with this email.';
      this.form.get('email')?.setErrors({ userNotFound: true });
      break;

    case 'auth/user-disabled':
      this.errorMessageEmail = 'This account has been disabled.';
      this.form.get('email')?.setErrors({ userDisabled: true });
      break;

    /* =======================
       PASSWORD ERRORS
    ======================== */

    case 'auth/wrong-password':
    case 'auth/invalid-credential': // 👈 KEY FIX
      this.form.get('password')?.setErrors({ wrongPassword: true });
      break;

    case 'auth/too-many-requests':
      this.form.get('password')?.setErrors({ tooManyRequests: true });
      break;

    /* =======================
       FALLBACK
    ======================== */

    default:
      this.form.get('password')?.setErrors({ loginFailed: true });
  }

      // Ensure errors appear
      this.form.get('email')?.markAsTouched();
      this.form.get('password')?.markAsTouched();
  }

  onLogin(){
    if(!this.form.invalid){

      signInWithEmailAndPassword(this.auth, this.form.value.email, this.form.value.password).
        then((responese) => {
            this.router.navigate(['/app/characterCollection']);
        })
        .catch((error) => {
          this.checkErrors(error);
      });
    }
  }
  onRegister(){
    if(!this.form.invalid){
      createUserWithEmailAndPassword(this.auth, this.form.value.email, this.form.value.password).
        then((responese) => {
          this.onLogin();
        })
        .catch((error) => {
          this.checkErrors(error);
        })
    }
    else{
      
    }
  }
}
