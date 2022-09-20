//This is to Enable Production Mode when your app is completed and ready to be shipped
import { enableProdMode } from "@angular/core";
//(1) Intialize the app by building the platform
import { platformBrowserDynamic }  from "@angular/platform-browser-dynamic";
//(2) Load the Angular App Module
import { AppModule } from './app/app.module';
//(4) This is to check to see if we are in prodmode or not, to turn off/on Change Detection running twice - this is CRUCIAL for the app's performance
//check the './environments/environment.ts' file to see how angular automatically turns it on/off depending on the CLI command
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

//(3) Call the platformbrowserdynamic function for (AOT/JIT) and bootstrap the Angular App by passing the AppModule variable into it, catch any errors in the console
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
