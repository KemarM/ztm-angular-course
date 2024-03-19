import { Component, Input, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  //providers: [ModalService]
})
export class ModalComponent implements OnInit, OnDestroy {
@Input() modalID = ''

  constructor(
    public modal: ModalService,
    public el: ElementRef //this helps to show the <app> element in the DOM so we can move it around with JS
    ) {}

  ngOnInit(): void {
    document.body.appendChild(this.el.nativeElement)//this moves the modal to the root, if needed
  }

  ngOnDestroy(): void {
    document.body.removeChild(this.el.nativeElement) //this removes the destroyed modal from the DOM as well
  }
  closeModal(){
    this.modal.toggleModal(this.modalID)
  }
}
