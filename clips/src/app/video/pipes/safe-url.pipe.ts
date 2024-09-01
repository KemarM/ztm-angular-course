import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeURL'
})
export class SafeURLPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer){}
  transform(value: string) {
    return this.sanitizer.bypassSecurityTrustUrl(value);
  }

}

//this is a RARE case where we need to use this pipe. When uploading the videos and getting the screenshots from the blob
// angular doesn't recognise the URL the ffmpeg service blob generates and appeands an 'unsafeURL' to the video URL, breaking the images
