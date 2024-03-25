import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[app-event-blocker]'
})
export class EventBlockerDirective {

  @HostListener('drop', ['$event']) // the 'drop' is the name of the event we're listening for like when a user release their mouseclick on an element
  @HostListener('dragover', ['$event']) // we can define multiple decorators to one function as well, to reduce the amout of code written
  public handleEvent(event: Event) {
    event.preventDefault()
    //event.stopPropagation() <-- not necessary but can be used as an aditional precaution
  }
  //The above definitions will provent the default browser behaviour when a file is droped over an element

}
