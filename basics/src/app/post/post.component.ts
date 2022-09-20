import { Component, Input, EventEmitter, Output, OnInit, OnChanges, DoCheck,
  AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy } from '@angular/core'; //Here we added 'Input' decorator to allow external component to set properties in this component

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit, OnChanges, DoCheck,
AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy{
  @Input('img') postImg = '' //We've added the Input decrator as a function, no need to add configurations at this point
  @Output() imgSelected = new EventEmitter<string>()

  constructor(){
    console.log('constructor() called', this.postImg)
  }

  ngOnInit() {
    console.log('ngonInt() called', this.postImg)
  }

  ngOnChanges() {
    console.log('ngOnChanges() called')
  }
  ngDoCheck() {//runs twice whenever changes are done in the app, this si to check to see if Anguale has missed any updates
    console.log('ngOnDoCheck() called')
  }

  ngAfterContentChecked(): void {
    console.log('ngAfterContentChecked() called')
  }

  ngAfterContentInit(): void {
    console.log('ngAfterContentInit() called')// Int functions run once and before their "Checked" counterparts
  }

  ngAfterViewChecked(): void {
    console.log('ngAfterViewChecked() called')
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit() called')
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy() called')
  }
}
