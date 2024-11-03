import { AngularFirestore, AngularFirestoreCollection, DocumentReference, QuerySnapshot } from '@angular/fire/compat/firestore';
import { Injectable } from '@angular/core';
import IClip from '../models/clip.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { switchMap, map } from 'rxjs/operators';
import { of, BehaviorSubject, combineLatest } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router'
import { snapshot } from 'node:test';

@Injectable({
  providedIn: 'root'
})
export class ClipService implements Resolve<IClip | null> {
  public clipsCollection: AngularFirestoreCollection<IClip>
  pageClips: IClip[] = []
  pendingRequests = false

  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private storage: AngularFireStorage,
    private route: Router
  ) {
    this.clipsCollection = db.collection('clips')
  }

  async createClip(data: IClip) : Promise<DocumentReference<IClip>> {
    return this.clipsCollection.add(data)
  }

  getUserClips(sort$: BehaviorSubject<string>) {
    return combineLatest([this.auth.user, sort$]).pipe(  //the combinelatest method from rxjs now accepts an array of user and the sort observable
      switchMap(values => {
        const [user, sort] = values

        if(!user) {
          return of([]) // because switchMap requires an observable returned, the 'of' operator will create an observable that pushes the value passed into it
        }

        const query = this.clipsCollection.ref.where(
          'uid', '==', user.uid // this is the forebase qury that looks inside the connected collection for records/documents that contain the logged in user's uploads that match thei ID
        ).orderBy('timestamp', sort == '1'? 'desc' : 'asc')//updates the softing order of the clips on the fly as the user updates the UI with their input

        return query.get()
      })
    )/*,
    map(snapshot => (snapshot as QuerySnapshot<IClip>).docs) */
  }

  updateClip(id: string, videoTitle: string) {
    return this.clipsCollection.doc(id).update({
    videoTitle
    })
  }

  async deleteClip(clip: IClip) {
    const clipRef = this.storage.ref(`clips/${clip.clipFileName}`)
    const screenshotRef = this.storage.ref(
      `screenshots/${clip.screenshotFileName}`
    )

    await clipRef.delete()
    await screenshotRef.delete()

    await this.clipsCollection.doc(clip.docID).delete()
  }

  async getClips(){
    if(this.pendingRequests){
      return
    }

    this.pendingRequests = true
    let query = this.clipsCollection.ref.orderBy('timestamp', 'desc').limit(6)

    const { length } = this.pageClips
    if(length){
      const lastDocID = this.pageClips[length - 1].docID
      const lastDoc = await this.clipsCollection.doc(lastDocID).get().toPromise()

      query = query.startAfter(lastDoc)
    }

    const snapshot = await query.get()
    snapshot.forEach(doc  => {
      this.pageClips.push({
        docID: doc.id,
        ...doc.data()
      })
    })

    this.pendingRequests = false
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    return this.clipsCollection.doc(route.params.id).get().pipe(
      map(snapshot => {
        const data = snapshot.data()

        if(!data) {
          this.route.navigate(['/'])
          return null
        }

        return data
      })
    )
  }
}
