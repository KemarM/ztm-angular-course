import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'
import { ClipService } from 'src/app/services/clip.service';
import IClip from 'src/app/models/clip.model';
import { ModalService } from 'src/app/services/modal.service';
import {  BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
/*export class ManageComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe(console.log) //we subscribe to the observable from the active route the user is on so we can grab data from
                                          //the auth service, this is typical but see the other definition for our current situation
  }

}*/

export class ManageComponent implements OnInit {
  videoOrder = '1';
  clips: IClip[] = []
  activeEditClip: IClip | null = null
  sort$: BehaviorSubject<string> //note that the $ is appended to the end of variables to let other developers know it's an Observable, however, it's not required.

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clipService: ClipService,
    private modal: ModalService
  ) {
    this.sort$ = new BehaviorSubject(this.videoOrder)
   }

    ngOnInit(): void {
      this.route.queryParams.subscribe((params: Params) => {
        this.videoOrder = params['sort'] === '2' ? params['sort'] : '1';
        this.sort$.next(this.videoOrder)
      })
      this.clipService.getUserClips(this.sort$).subscribe(docs => {
        this.clips = []
        docs.forEach(doc => {
          this.clips.push({
            docID: doc.id,
            ...doc.data() //" . . . " is the spread operator to
          })
        })
      })
    }

    /*
    sort(event: Event) {  // this sort function allows us to update the video gallery sort order through manipulation the URL with query parameters
    const { value } = (event.target as HTMLSelectElement)

    this.router.navigateByUrl(`/manage?sort=${value}`)
    }
    */

    sort(event: Event) {
      const { value } = (event.target as HTMLSelectElement)

      this.router.navigate([], { //here in the array [] we can define the strings in the URL, or we can ignore it, and add to the overriding object, all the parameters we want, the function will convert everythig to a string to build the URL
        relativeTo: this.route,
        queryParams: {
          sort: value
        }
      });
     }

    openModal($event: Event, clip: IClip){
      $event.preventDefault()

      this.activeEditClip = clip

      this.modal.toggleModal('editClip')
    }

    update($event: IClip){ //this function accepts the emitted event from the edit.component and accesses the values in it. It then loops through all of the active clips in the manage compoenent and updates their properties as needed
      this.clips.forEach((element, index) => {
        if(element.docID == $event.docID) {
          this.clips[index].videoTitle = $event.videoTitle
        }
      })
    }

    deleteClip($event: Event, clip: IClip){
      $event.preventDefault()

      this.clipService.deleteClip(clip)

      this.clips.forEach((element, index) => {
        if(element.docID == clip.docID) {
          this.clips.splice(index, 1)
        }
      })

    }

    async copyToClipboard($event: MouseEvent, docID: string | undefined){
      $event.preventDefault()

      if(!docID){
        return
      }

      const url = `${location.origin}/clip/${docID}`

      await navigator.clipboard.writeText(url)

      alert('Link Copied!')
    }
  }
