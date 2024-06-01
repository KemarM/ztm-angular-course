import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import IClip from 'src/app/models/clip.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClipService } from 'src/app/services/clip.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() activeEditClip: IClip | null = null
  inSubmission = false
  showAlert = false
  alertColor = 'blue'
  alertMsg = 'Please wait! Updating clip...'

  @Output() update = new EventEmitter()

  clipID = new FormControl('', {
    nonNullable: true
  })

  videoTitle = new FormControl('', {
    validators: [
      Validators.required,
      Validators.minLength(3)
    ],
    nonNullable: true
})

  editForm = new FormGroup({
    videoTitle: this.videoTitle,
    id: this.clipID
  })

  constructor(
    private modal: ModalService,
    private clipService: ClipService
  ) { }

  ngOnInit(): void {
    this.modal.register('editClip')
  }

  ngOnDestroy(): void {
    this.modal.unregister('editClip')
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(!this.activeEditClip){
      return
    }

    this.inSubmission = false
    this.showAlert = false
    this.clipID.setValue(this.activeEditClip.docID as string)
    this.videoTitle.setValue(this.activeEditClip.videoTitle as string)
  }

  async submit() {
    if(!this.activeEditClip){
      return
    }

    this.inSubmission = true
    this.showAlert = true
    this.alertColor = 'blue'
    this.alertMsg = 'Please wait! Updating clip...'

    try{
      await this.clipService.updateClip(this.clipID.value, this.videoTitle.value)
    }
    catch(e){
      this.inSubmission = false
      this.alertColor = 'red'
      this.alertMsg = "Something went wrong. Try again later..."
      return
    }

    this.activeEditClip.videoTitle = this.videoTitle.value
    this.update.emit(this.activeEditClip)

    this.inSubmission = false
    this.alertColor = 'green'
    this.alertMsg = "Success!"
  }
}
