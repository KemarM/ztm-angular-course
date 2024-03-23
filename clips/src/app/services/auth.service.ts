import { Injectable, Type } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import IUser from '../models/user.model';
import { Observable, of } from 'rxjs';
import { map, delay, filter, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ActivatedRoute, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<IUser>;
  public isAuthenticated$: Observable<boolean>;
  public isAuhthenticatedWithDelay$: Observable<boolean>;
  public redirect = false;

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.usersCollection = db.collection('users')
    this.isAuthenticated$ = auth.user.pipe( // the $ symbol is appended to the end of variables to simply identify that they are vessels for observations
      map(user => !!user) //this typecast's the 'user' arg into a boolean value, so that another part of the application can simily check (be subscribed to) to see if the user is logged in or not without needing the entiure User Observable
    )
    this.isAuhthenticatedWithDelay$ = this.isAuthenticated$.pipe(
      delay(1000) //adding this rxjs delay operator allows us to slow down the assignment of the data from one observable to another so that other actions can be delayed. Here were delaying it so that the modal doesn't disappear instantly for the user
    )
    this.router.events.pipe( //the rxjs pipe operator here allows us to listen to specific router events since Angular doesn't do it in this context by default
      filter(e => e instanceof NavigationEnd),
      map(e => this.route.firstChild),
      switchMap(route => route?.data ?? of({ authOnly: false })) //the switchMap rxjs operator is used here to get the actual route event data, the ?? nullish coalecent operator check the variable on the left to see if it's null or undefined and if so, returns the right-hand variable
    ).subscribe((data) => {
      this.redirect = data.authOnly ?? false;
    });
  }

  public async createUser(userData: IUser) {
    if(!userData.password) {
      throw new Error("Password not provided!")
    }
    const userCred = await this.auth.createUserWithEmailAndPassword(
      userData.email, userData.password
    )

    if(!userCred.user) {
      throw new Error("User can't be found")
    }
    await this.usersCollection.doc(userCred.user.uid).set({ //we added await here because the .add() / .set() function returns a promise
      name: userData.name,
      email: userData.email,
      age: userData.age,
      phoneNumber: userData.phoneNumber
    })

    await userCred.user.updateProfile({
      displayName: userData.name
    })
  }
  public async logout($event?: Event) {
    if ($event) {
      $event.preventDefault()
    }

    await this.auth.signOut()

    if (this.redirect) {
      await this.router.navigateByUrl('/')
    }
  }
}
