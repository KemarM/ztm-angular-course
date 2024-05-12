import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'
import { ClipService } from 'src/app/services/clip.service';
import IClip from 'src/app/models/clip.model';
import { ModalService } from 'src/app/services/modal.service';

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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clipService: ClipService,
    private modal: ModalService
  ) { }

    ngOnInit(): void {
      this.route.queryParams.subscribe((params: Params) => {
        this.videoOrder = params['sort'] === '2' ? params['sort'] : '1';
      })
      this.clipService.getUserClips().subscribe(docs => {
        this.clips = []
        docs.forEach(doc => {
          this.clips.push({
            docID: doc.id,
            ...doc.data() //" . . . " is the spread operator to
          })
        })
      })
    }

    /*sort(event: Event) {// this sort function allows us to update the video gallery sort order through manipulation the URL with query parameters
      const { value } = (event.target as HTMLSelectElement)

      this.router.navigateByUrl(`/manage?sort=${value}`)
    }*/

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
  }
