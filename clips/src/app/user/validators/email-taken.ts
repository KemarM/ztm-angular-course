import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Injectable } from "@angular/core";
import { AsyncValidator, AbstractControl, ValidationErrors } from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class EmailTaken implements AsyncValidator{
  constructor(private auth: AngularFireAuth) { }// We will need to manually tell Angular that we need services injected / dependency injection into the class so it can be used

  validate = (control: AbstractControl) : Promise<ValidationErrors | null> => {
     return this.auth.fetchSignInMethodsForEmail(control.value).then(
        response => response.length ? { emailTaken: true } : null
      )
    }
}
