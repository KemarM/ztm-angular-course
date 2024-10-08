import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app'
import { v4 as uuid } from 'uuid';
import { switchMap, timestamp } from 'rxjs';
import { ClipService } from 'src/app/services/clip.service';
import { Router } from '@angular/router';
import { FfmpegService } from 'src/app/services/ffmpeg.service';
import { combineLatest, forkJoin } from 'rxjs';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnDestroy {
  isDragOver = false // this property will be used to keep track of when a file is being dragged over an element
  file: File | null = null
  showThumbnailStep = false
  inSubmission = false
  uploadPercentage = 0
  showUploadPercentage = false
  showAlert = false
  alertMsg = 'Please wait! We\'re uploading your new video...'
  alertColor = 'blue'

  user: firebase.User | null = null
  uploadTask?: AngularFireUploadTask

  screenshots: string[] = []
  selectedScreenshot = ''
  screenshotTask?: AngularFireUploadTask

  videoTitle = new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ])

  videoUploadForm = new FormGroup({
    videoTitle: this.videoTitle
  })

  constructor(
    private store: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipsService: ClipService,
    private router: Router,
    public ffmpegService: FfmpegService
    ) {
        auth.user.subscribe(user => this.user = user)
        this.ffmpegService.init()
     }

  ngOnDestroy(): void {
    this.uploadTask?.cancel() // this will allow the application to imediately cancel the Firebase file upload if the user navigates away
  }
  // ^ we're not using the OnInit function or interface, so we're going to use the OnDestroy. This is part of Angular's life cycle functions, we want to monitor
  // when a component gets destroyed when a user navigates to another page in the application etc.

  async uploadFile($event: Event){
    if(this.ffmpegService.isRunning) { //if a file is being uploaded, disallow uploading another video syumultaneously till it's done.
      return
    }

    this.isDragOver = false

    this.file = ($event as DragEvent).dataTransfer ?
      ($event as DragEvent).dataTransfer?.files.item(0) ?? null :
      ($event.target as HTMLInputElement).files?.item(0) ?? null
    //^ We asserted the event type as DragEvent to be more specific for Angular, also we're allowing the data in the dataTransfer object to be optional, lastly we're also using nullish coalescing (??) to allow an undefined return to set the property to null

    if(!this.file || this.file.type !== 'video/mp4'){
      return
    }

    this.screenshots = await this.ffmpegService.getScreenshots(this.file)

    this.selectedScreenshot = this.screenshots[0]

    this.videoTitle.setValue( // used to automatically update the video file field with the file name
      this.file.name.replace(/\.[^/.]+$/, '')//this removes the file extention from the name, replacing it with nothing ' '
    )
    this.showThumbnailStep = true
  }

  async publishVideo() {
    this.videoUploadForm.disable()//disables the entire form upon clicking the publish button

    this.showAlert = true
    this.alertMsg = 'Please wait! We\'re uploading your new video...'
    this.alertColor = 'blue'
    this.inSubmission = true
    this.showUploadPercentage = true

    const clipFileName = uuid()
    const clipPath = `clips/${clipFileName}.mp4`

    const screenshotBlob = await this.ffmpegService.blobFromURL(this.selectedScreenshot)
    const screenshotPath = `screenshots/${clipFileName}.png`

    this.uploadTask = this.store.upload(clipPath, this.file)
    const clipRef = this.store.ref(clipPath)

    this.screenshotTask = this.store.upload(screenshotPath, screenshotBlob)

    const screenshotRef = this.store.ref(screenshotPath)

    // The blow now merges the progress of two observables into one observable then we are calculating the total progress and displaying it to the user
    // It's also checking to ensure both processes are running
    combineLatest([
      this.uploadTask.percentageChanges(),
      this.screenshotTask.percentageChanges()
    ]).subscribe((currentProgress) => {
      const [clipProgress, screenshotProgress] = currentProgress

      if(!clipProgress || !screenshotProgress){
        return
      }

      const totalProgress = clipProgress + screenshotProgress

      this.uploadPercentage = totalProgress as number / 200
    })

    /*
    Below is an alternative method of monitoring upload progress, the snapshotchanges() function returns an observable to subscribe to,
    each of those objects has a status value that says 'running' or 'success', we only care about the last object with the 'success' message,
    so we can pipe the returned objet to only show the last one using pipe().last() from the rxjs import

    Update:
    After intriducing the forkJoin operator to merge two observables into one, we no longer needed the last() operator
    */
    forkJoin([
      this.uploadTask.snapshotChanges(),
      this.screenshotTask.snapshotChanges()
    ]).pipe(
      switchMap(() => forkJoin([
        clipRef.getDownloadURL(),
        screenshotRef.getDownloadURL()
      ]))
    ).subscribe({
      next: async (urls) => {
        const [clipURL, screenshotURL] = urls

        const clip = {
          uid: this.user?.uid as string,
          displayName: this.user?.displayName as string,
          videoTitle: this.videoTitle.value,
          clipFileName: `${clipFileName}.mp4`,
          url: clipURL,
          screenshotURL,
          screenshotFileName: `${clipFileName}.png`,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }

        const clipDocRef = await this.clipsService.createClip(clip)

        this.alertMsg = "Video uploaded successfully!"
        this.alertColor ='green'
        this.showUploadPercentage = false

        setTimeout(() => {
          this.router.navigate(
            [
              'clip', clipDocRef.id //this clipDocRef variable is of type DocumentReference< T > from firebase, it comes with the 'id' property. this will help this function redirect the user to the uploaded file
            ]
          )
        }, 1000)
      },
      error: (error) => {
        this.videoUploadForm.enable()
        this.alertMsg = 'An unexpected error has occured. Please try again later.'
        this.alertColor = 'red'
        this.inSubmission = true
        this.showUploadPercentage = false
        console.error(error)
      }
    })

  }
}
