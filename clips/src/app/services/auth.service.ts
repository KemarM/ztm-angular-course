import { Injectable, Type } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import IUser from '../models/user.model';
import { Observable } from 'rxjs';
import { map, delay } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<IUser>
  public isAuthenticated$: Observable<boolean>
  public isAuhthenticatedWithDelay$: Observable<boolean>
  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore
  ) {
    this.usersCollection = db.collection('users')
    this.isAuthenticated$ = auth.user.pipe( // the $ symbol is appended to the end of variables to simply identify that they are vessels for observations
      map(user => !!user) //this typecast's the 'user' arg into a boolean value, so that another part of the application can simily check (be subscribed to) to see if the user is logged in or not without needing the entiure User Observable
    )
    this.isAuhthenticatedWithDelay$ = this.isAuthenticated$.pipe(
      delay(1000) //adding this rxjs delay operator allows us to slow down the assignment of the data from one observable to another so that other actions can be delayed. Here were delaying it so that the modal doesn't disappear instantly for the user
    )
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
}
