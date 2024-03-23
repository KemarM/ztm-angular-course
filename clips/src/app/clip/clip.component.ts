import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.css']
})
export class ClipComponent implements OnInit {
  id = ''

  constructor(public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => { //The params variable in the router module emits an observable, optionally we Type Safey-ied the params in the arguments of the arrow funtion. We subscribed to the observable so we can automatically update the video titles with the ID
      this.id = params.id
    })
  }
}
