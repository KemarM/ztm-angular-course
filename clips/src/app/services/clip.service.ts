import { AngularFirestore, AngularFirestoreCollection, DocumentReference, QuerySnapshot } from '@angular/fire/compat/firestore';
import { Injectable } from '@angular/core';
import IClip from '../models/clip.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { switchMap, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClipService {
  public clipsCollection: AngularFirestoreCollection<IClip>

  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth
  ) {
    this.clipsCollection = db.collection('clips')
  }

  async createClip(data: IClip) : Promise<DocumentReference<IClip>>{
    return this.clipsCollection.add(data)
  }

  getUserClips(){
    return this.auth.user.pipe(
      switchMap(user => {
        if(!user) {
          return of([]) // because switchMap requires an observable returned, the 'of' operator will create an observable that pushes the value passed into it
        }

        const query = this.clipsCollection.ref.where(
          'uid', '==', user.uid // this is the forebase qury that looks inside the connected collection for records/documents that contain the logged in user's uploads that match thei ID
        )

        return query.get()
      })
    )/*,
    map(snapshot => (snapshot as QuerySnapshot<IClip>).docs) */
  }
}
