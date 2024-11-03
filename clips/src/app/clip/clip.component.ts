import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import videojs from 'video.js/dist/video.min';
import IClip from '../models/clip.model';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.css'],
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None
})
export class ClipComponent implements OnInit {
  @ViewChild('videoPlayer', { static: true }) target?: ElementRef
  player?: videojs.Player
  clip?: IClip

  constructor(public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.player = videojs(this.target?.nativeElement) //initialises the video player and attaches it to the element in the html file

    this.route.data.subscribe(data => {
      this.clip = data.clip as IClip

      this.player?.src({
        src: this.clip.url,
        type: 'video/mp4'
      })
    })
    //this.route.params.subscribe((params: Params) => { //The params variable in the router module emits an observable, optionally we Type Safey-ied the params in the arguments of the arrow funtion. We subscribed to the observable so we can automatically update the video titles with the ID
    //  this.id = params.id
   // })
  }

  ngAfterInit(): void {

  }
}
