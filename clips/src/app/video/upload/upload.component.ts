import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  isDragOver = false // this property will be used to keep track of when a file is being dragged over an element
  file: File | null = null
  showThumbnailStep = false
  inSubmission = false

  videoTitle = new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ])

  videoUploadForm = new FormGroup({
    videoTitle: this.videoTitle
  })

  constructor(
    private store: AngularFireStorage

    ) {

     }

  ngOnInit(): void {
  }

  storeFile($event: Event){
    this.isDragOver = false

    this.file = ($event as DragEvent).dataTransfer?.files.item(0) ?? null
    //^ We asserted the event type as DragEvent to be more specific for Angular, also we're allowing the data in the dataTransfer object to be optional, lastly we're also using nullish coalescing (??) to allow an undefined return to set the property to null

    if(!this.file || this.file.type !== 'video/mp4'){
      return
    }

    this.videoTitle.setValue( // used to automatically update the video file field with the file name
      this.file.name.replace(/\.[^/.]+$/, '')//this removes the file extention from the name, replacing it with nothing ' '
    )
    this.showThumbnailStep = true
  }

  publishVideo() {
    const clipFileName = uuid()
    const clipPath = `clips/${clipFileName}.mp4`

    this.store.upload(clipPath, this.file)

  }
}
