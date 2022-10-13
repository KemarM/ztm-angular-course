import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  //providers: [ModalService]
})
export class ModalComponent implements OnInit {
@Input() modalID = ''

  constructor(
    public modal: ModalService,
    public el: ElementRef //this helps to show the <app> element in the DOM so we can move it around with JS
    ) {}

  ngOnInit(): void {
    document.body.appendChild(this.el.nativeElement)//this moves the modal to the root, if needed
  }
  closeModal(){
    this.modal.toggleModal(this.modalID)
  }
}
