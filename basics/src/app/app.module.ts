import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { PostComponent } from './post/post.component';

@NgModule({//This decorator is needed to add imported functionality to the core AppModule class
  imports: [
    BrowserModule
  ],
  declarations: [
    AppComponent,
    PostComponent
  ],
  bootstrap: [//Defines AppComponent as the root component, we won't need to constantly add components to this array to be rendered
    AppComponent
  ]
})
export class AppModule {

}
