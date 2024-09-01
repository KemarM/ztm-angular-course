import { Injectable } from '@angular/core';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

@Injectable({
  providedIn: 'root'
})
export class FfmpegService {
  public isReady = false
  private ffmpeg

  constructor() {
    this.ffmpeg = createFFmpeg({ log: true })
  }

  async init(){
    if(this.isReady){
      return
    }

    await this.ffmpeg.load()

    this.isReady = true
  }

  async getScreenshots(file: File){
    const data = await fetchFile(file)

    //This function is the File System function which will enable us to manage and interact with the local file system
    //... in order to tap into and convert video into binary data
    this.ffmpeg.FS('writeFile', file.name, data)

    const seconds = [1,2,3]
    const commands: string[] = []

    seconds.forEach(second =>{
      commands.push(
         // Input
      '-i', file.name,
      // Output Options
      '-ss', `00:00:0${second}`, //<-- timestamp to determine where to get the screenshot in the video
      '-frames:v', '1', //<-- tells ffmpeg to only capture one frame/screenshot
      '-filter:v', 'scale=510:-1', //<-- this allows us to keep theaspect ration whilst forcing the with to be 510, if we don't want this, typeat 510:300
      // Output
      `output_0${second}.png`
      )
    })

    await this.ffmpeg.run(
      ...commands //Because this function expects a list of strings instead of an array of functions, we use the spread operator on the commands variable
    )

    const screenshots: string[] = []

    seconds.forEach(second => {
      const screenshotFile = this.ffmpeg.FS('readFile', `output_0${second}.png`)
      const screenshotBlob = new Blob(
        [screenshotFile.buffer], {
          type: 'image/png'
        }
      )

      const screenshotURL = URL.createObjectURL(screenshotBlob)

      screenshots.push(screenshotURL)
    })

    return screenshots
  }
}
